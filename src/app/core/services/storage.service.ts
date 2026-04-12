import { ENV_ADMIN } from './../../features/auth/models/.env_user';
import { computed, Injectable, signal } from '@angular/core';
import { Role, ROLES, User } from '../../features/auth/models/user.model';

interface PersistedAuthState {
  version: 1;
  users: User[];
  currentUserId: number | null;
  signature: string;
}

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private static readonly STORAGE_KEY = 'spare_parts.auth.state.v1';
  private static readonly SIGNING_PEPPER = 'spare-parts-local-signing-pepper-v1';

  private readonly usersState = signal<User[]>([]);
  private readonly currentUserIdState = signal<number | null>(null);
  private readonly errorState = signal<string | null>(null);

  readonly users = this.usersState.asReadonly();
  readonly currentUserId = this.currentUserIdState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly currentUser = computed(() => {
    const id = this.currentUserIdState();
    if (id === null) {
      return null;
    }

    return this.usersState().find((user) => user.id === id) ?? null;
  });
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isCurrentUserAdmin = computed(() => this.currentUser()?.role === 'admin');

  constructor() {
    this.initialize();
  }

  login(username: string, password: string): boolean {
    const normalizedUsername = username.trim().toLowerCase();
    const user = this.usersState().find(
      (entry) => entry.username.toLowerCase() === normalizedUsername && entry.password === password,
    );

    if (!user) {
      this.errorState.set('Invalid username or password.');
      return false;
    }

    this.currentUserIdState.set(user.id);
    this.persistState();
    this.errorState.set(null);
    return true;
  }

  logout() {
    this.currentUserIdState.set(null);
    this.persistState();
    this.errorState.set(null);
  }

  createUser(input: Pick<User, 'username' | 'password' | 'role'>): User | null {
    const sanitizedUsername = input.username.trim();
    const sanitizedPassword = input.password.trim();

    if (!this.isValidUsername(sanitizedUsername) || !this.isValidPassword(sanitizedPassword)) {
      this.errorState.set('Invalid user data. Username and password do not match policy.');
      return null;
    }

    if (!this.isRole(input.role)) {
      this.errorState.set('Invalid role.');
      return null;
    }

    const users = this.usersState();
    const usernameExists = users.some(
      (user) => user.username.toLowerCase() === sanitizedUsername.toLowerCase(),
    );

    if (usernameExists) {
      this.errorState.set('Username already exists.');
      return null;
    }

    const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
    const user: User = {
      id: nextId,
      username: sanitizedUsername,
      password: sanitizedPassword,
      role: input.role,
    };

    this.usersState.set([...users, user]);
    this.persistState();
    this.errorState.set(null);
    return user;
  }

  updateRole(targetUserId: number, newRole: Role): boolean {
    if (!this.isRole(newRole)) {
      this.errorState.set('Invalid role update request.');
      return false;
    }

    const actor = this.currentUser();
    if (!actor || actor.role !== 'admin') {
      this.errorState.set('Only admin users are allowed to update roles.');
      return false;
    }

    const users = this.usersState();
    const target = users.find((user) => user.id === targetUserId);
    if (!target) {
      this.errorState.set('Target user not found.');
      return false;
    }

    const updatedUsers = users.map((user) =>
      user.id === targetUserId ? { ...user, role: newRole } : user,
    );

    this.usersState.set(updatedUsers);
    this.persistState();
    this.errorState.set(null);
    return true;
  }

  clearError() {
    this.errorState.set(null);
  }

  hasActiveSession(): boolean {
    return this.isAuthenticated();
  }

  private initialize() {
    const loaded = this.loadFromStorage();
    if (loaded) {
      this.ensureAdminExists();
      this.persistState();
      return;
    }

    const admin = this.createDefaultAdmin();
    this.usersState.set([admin]);
    this.currentUserIdState.set(null);
    this.persistState();
  }

  private ensureAdminExists() {
    const hasAdmin = this.usersState().some((user) => user.role === 'admin');
    if (hasAdmin) {
      return;
    }

    const admin = this.createDefaultAdmin();
    const nextId = Math.max(0, ...this.usersState().map((user) => user.id)) + 1;
    this.usersState.set([...this.usersState(), { ...admin, id: nextId }]);
  }

  private createDefaultAdmin(): User {
    return {
      id: ENV_ADMIN.id,
      username: ENV_ADMIN.username,
      password: ENV_ADMIN.password,
      role: ENV_ADMIN.role,
    };
  }

  private loadFromStorage(): boolean {
    if (!this.hasStorage()) {
      this.errorState.set('localStorage is not available. In-memory mode is used.');
      return false;
    }

    try {
      const raw = localStorage.getItem(StorageService.STORAGE_KEY);
      if (!raw) {
        return false;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!this.isPersistedState(parsed)) {
        this.errorState.set('Stored data format is invalid. Storage has been reset.');
        return false;
      }

      const signedPayload = {
        version: parsed.version,
        users: parsed.users,
        currentUserId: parsed.currentUserId,
      };

      const expectedSignature = this.signPayload(signedPayload);
      if (expectedSignature !== parsed.signature) {
        this.errorState.set('Stored data appears manipulated and has been rejected.');
        return false;
      }

      this.usersState.set(parsed.users);
      this.currentUserIdState.set(parsed.currentUserId);
      this.errorState.set(null);
      return true;
    } catch {
      this.errorState.set('Failed to parse stored data. Storage has been reset.');
      return false;
    }
  }

  private persistState() {
    if (!this.hasStorage()) {
      return;
    }

    const users = this.usersState();
    if (!this.isValidUsersArray(users)) {
      this.errorState.set('Refusing to store invalid user data.');
      return;
    }

    const currentUserId = this.currentUserIdState();
    if (currentUserId !== null && !users.some((user) => user.id === currentUserId)) {
      this.errorState.set('Refusing to store invalid session reference.');
      return;
    }

    const payload = {
      version: 1 as const,
      users,
      currentUserId,
    };

    const state: PersistedAuthState = {
      ...payload,
      signature: this.signPayload(payload),
    };

    try {
      localStorage.setItem(StorageService.STORAGE_KEY, JSON.stringify(state));
    } catch {
      this.errorState.set('Failed to persist data to localStorage.');
    }
  }

  private hasStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }

  private isPersistedState(value: unknown): value is PersistedAuthState {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<PersistedAuthState>;
    return (
      candidate.version === 1 &&
      typeof candidate.signature === 'string' &&
      this.isValidUsersArray(candidate.users) &&
      (candidate.currentUserId === null || typeof candidate.currentUserId === 'number')
    );
  }

  private isValidUsersArray(users: unknown): users is User[] {
    if (!Array.isArray(users)) {
      return false;
    }

    const ids = new Set<number>();
    const usernames = new Set<string>();

    for (const entry of users) {
      if (!this.isUser(entry)) {
        return false;
      }

      if (ids.has(entry.id) || usernames.has(entry.username.toLowerCase())) {
        return false;
      }

      ids.add(entry.id);
      usernames.add(entry.username.toLowerCase());
    }

    return true;
  }

  private isUser(value: unknown): value is User {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const candidate = value as Partial<User>;
    return (
      typeof candidate.id === 'number' &&
      Number.isInteger(candidate.id) &&
      candidate.id > 0 &&
      this.isValidUsername(candidate.username) &&
      this.isValidPassword(candidate.password) &&
      this.isRole(candidate.role)
    );
  }

  private isRole(role: unknown): role is Role {
    return ROLES.includes(role as Role);
  }

  private isValidUsername(username: unknown): username is string {
    return (
      typeof username === 'string' && username.trim().length >= 3 && username.trim().length <= 48
    );
  }

  private isValidPassword(password: unknown): password is string {
    return typeof password === 'string' && password.length >= 6 && password.length <= 128;
  }

  private signPayload(payload: Omit<PersistedAuthState, 'signature'>): string {
    const raw = JSON.stringify(payload) + StorageService.SIGNING_PEPPER;
    let hash = 2166136261;

    for (let index = 0; index < raw.length; index++) {
      hash ^= raw.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).padStart(8, '0');
  }
}

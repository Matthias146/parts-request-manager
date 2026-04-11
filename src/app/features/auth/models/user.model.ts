export type Role = 'admin' | 'clerk' | 'employees';

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
}

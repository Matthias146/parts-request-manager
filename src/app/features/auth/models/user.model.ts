export type Role = 'admin' | 'clerk' | 'employee';

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
}

export const ROLES = ['admin', 'clerk', 'employee'] as const;
export type Role = (typeof ROLES)[number];

export interface User {
  id: number;
  username: string;
  password: string;
  role: Role;
}

// .env_user.example.ts — copy to .env_user.ts and fill in your credentials
import { User } from './user.model';

export const ENV_ADMIN: User = {
  id: 1,
  username: 'your-admin-username',
  password: 'your-secure-password',
  role: 'admin',
};

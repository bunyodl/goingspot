import type { UserRole } from '@/modules/user/constants/user.constants';

export type AuthUser = {
  id: string;
  role: UserRole;
};

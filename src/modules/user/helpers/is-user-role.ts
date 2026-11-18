import {
  USER_ROLE_VALUES,
  type UserRole,
} from '@/modules/user/constants/user.constants';

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === 'string' &&
    (USER_ROLE_VALUES as readonly string[]).includes(value)
  );
}

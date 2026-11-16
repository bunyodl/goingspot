import type { UserDto } from '@/modules/user/schemas/resources/user.schema';

/** Service → controller: refreshToken is for httpOnly cookie, never JSON. */
export type AuthSessionResult = {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
};

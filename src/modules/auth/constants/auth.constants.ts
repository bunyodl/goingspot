import type { CookieOptions } from 'express';

import { env } from '@/config/env';

import { durationToMs } from '@/common/libs/duration-to-ms';

export const AUTH_REFRESH_COOKIE = 'refreshToken';

const refreshCookieBase: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
};

export function getRefreshCookieOptions(): CookieOptions {
  return {
    ...refreshCookieBase,
    maxAge: durationToMs(env.JWT_REFRESH_TOKEN_EXPIRES_IN),
  };
}

/** Same identity as set — required for Express to clear the cookie. */
export function getClearRefreshCookieOptions(): CookieOptions {
  return { ...refreshCookieBase };
}

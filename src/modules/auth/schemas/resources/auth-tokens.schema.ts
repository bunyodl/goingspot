import { z } from '@/openapi/zod-openapi';

/** Access token returned in JSON bodies. Refresh stays in httpOnly cookie. */
export const accessTokenSchema = z
  .object({
    accessToken: z.string().openapi({
      example: 'eyJhbGciOiJIUzI1NiJ9.access.token',
    }),
  })
  .openapi('AccessToken');

export type AccessTokenDto = z.infer<typeof accessTokenSchema>;

/** Internal pair from generateTokens — refresh is for Set-Cookie only. */
export type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
};

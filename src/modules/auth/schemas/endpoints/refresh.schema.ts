import {
  type AccessTokenDto,
  accessTokenSchema,
} from '@/modules/auth/schemas/resources/auth-tokens.schema';

/** Same JSON shape as AccessToken — refresh cookie is not in the body. */
export const refreshResponseSchema =
  accessTokenSchema.openapi('RefreshResponse');

export type RefreshResponse = AccessTokenDto;

import { z } from '@/openapi/zod-openapi';

export const logoutResponseSchema = z
  .object({
    loggedOut: z.literal(true),
  })
  .openapi('LogoutResponse');

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

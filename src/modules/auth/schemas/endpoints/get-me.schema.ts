import { userSchema } from '@/modules/user/schemas/resources/user.schema';

import { z } from '@/openapi/zod-openapi';

export const getMeResponseSchema = z
  .object({
    user: userSchema,
  })
  .openapi('GetMeResponse');

export type GetMeResponse = z.infer<typeof getMeResponseSchema>;

import { z } from '@/openapi/zod-openapi';

export const paginationQuerySchema = z
  .object({
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(200)
      .default(10)
      .openapi({ example: 10, description: 'Maximum number of items to return' }),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .default(0)
      .openapi({
        example: 0,
        description: 'Number of items to skip before starting to return results',
      }),
  })
  .openapi('PaginationQuery');

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

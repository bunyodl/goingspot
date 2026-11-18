import { eventSchema } from '@/modules/event/schemas/resources/event.schema';

import { paginationQuerySchema } from '@/openapi/schemas/pagination.schema';
import { uuidV7Schema } from '@/openapi/schemas/uuid.schema';
import { z } from '@/openapi/zod-openapi';

export const getEventsQuerySchema = z
  .object({
    search: z.string().optional().openapi({
      description: 'Search term to filter events by title or description',
    }),
    organizerId: uuidV7Schema.optional().openapi({
      description: 'Filter events by organizer user id',
    }),
    sort: z
      .enum(['asc', 'desc'])
      .optional()
      .openapi({ example: 'asc', description: 'Sort order' }),
    sortBy: z
      .enum(['title', 'description', 'date', 'createdAt'])
      .optional()
      .openapi({ example: 'date', description: 'Field to sort by' }),
  })
  .extend(paginationQuerySchema.shape)
  .openapi('GetEventsQuery');

export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;

export const getEventsResponseSchema = z
  .object({
    events: z.array(eventSchema),
    eventsCount: z.number().openapi({ example: 25 }),
  })
  .openapi('GetEventsResponse');

export type GetEventsResponse = z.infer<typeof getEventsResponseSchema>;

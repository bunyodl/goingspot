import {
  createEventRequestBodySchema,
  createEventResponseSchema,
} from '@/modules/event/schemas/endpoints/create-event.schema';
import {
  getEventParamsSchema,
  getEventResponseSchema,
} from '@/modules/event/schemas/endpoints/get-event.schema';
import {
  getEventsQuerySchema,
  getEventsResponseSchema,
} from '@/modules/event/schemas/endpoints/get-events.schema';
import {
  getMyAttendanceQuerySchema,
  getMyAttendanceResponseSchema,
} from '@/modules/event/schemas/endpoints/get-my-attendance.schema';
import {
  patchEventParamsSchema,
  patchEventRequestBodySchema,
  patchEventResponseSchema,
} from '@/modules/event/schemas/endpoints/patch-event.schema';
import {
  upsertAttendanceParamsSchema,
  upsertAttendanceRequestBodySchema,
  upsertAttendanceResponseSchema,
} from '@/modules/event/schemas/endpoints/upsert-attendance.schema';

import { registry } from '@/openapi/registry-instance';
import { apiResponseSchema } from '@/openapi/schemas/shared.schema';

const getEventsApiResponseSchema = apiResponseSchema(
  getEventsResponseSchema,
  'GetEventsApiResponse',
);

const getEventApiResponseSchema = apiResponseSchema(
  getEventResponseSchema,
  'GetEventApiResponse',
);

const getMyAttendanceApiResponseSchema = apiResponseSchema(
  getMyAttendanceResponseSchema,
  'GetMyAttendanceApiResponse',
);

const upsertAttendanceApiResponseSchema = apiResponseSchema(
  upsertAttendanceResponseSchema,
  'UpsertAttendanceApiResponse',
);

const createEventApiResponseSchema = apiResponseSchema(
  createEventResponseSchema,
  'CreateEventApiResponse',
);

const patchEventApiResponseSchema = apiResponseSchema(
  patchEventResponseSchema,
  'PatchEventApiResponse',
);

const eventExample = {
  id: '0190f5a3-0000-7000-8000-000000000001',
  title: 'Summer Music Festival',
  description: 'A fantastic outdoor music festival',
  type: 'in-person',
  status: 'published',
  venueId: '0190f5a3-0000-7000-8000-000000000001',
  organizerId: '0190f5a3-0000-7000-8000-000000000001',
  date: '2024-07-15T18:00:00.000Z',
  tags: ['music', 'outdoor', 'festival'],
  goingCount: 42,
  createdAt: '2024-07-01T12:00:00.000Z',
  updatedAt: null,
};

const createEventBodyExample = {
  title: 'Summer Music Festival',
  description: 'A fantastic outdoor music festival',
  type: 'in-person',
  status: 'draft',
  venueId: '0190f5a3-0000-7000-8000-000000000001',
  date: '2024-07-15T18:00:00.000Z',
  tags: ['music', 'outdoor', 'festival'],
};

registry.registerPath({
  method: 'get',
  path: '/api/v1/events',
  summary: 'Retrieve a list of events',
  description:
    'Get a paginated and sortable list of events with optional search functionality',
  tags: ['events'],
  request: {
    query: getEventsQuerySchema,
  },
  responses: {
    200: {
      description: 'A list of events',
      content: {
        'application/json': {
          schema: getEventsApiResponseSchema,
          example: {
            code: 200,
            message: 'Events fetched successfully',
            data: {
              events: [eventExample],
              eventsCount: 25,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/events/me/attendance',
  summary: 'List my event attendance',
  description:
    'Return paginated events the authenticated user responded to (RSVP). Optional status filter.',
  tags: ['events'],
  security: [{ bearerAuth: [] }],
  request: {
    query: getMyAttendanceQuerySchema,
  },
  responses: {
    200: {
      description: 'Attendance list',
      content: {
        'application/json': {
          schema: getMyAttendanceApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              attendance: [
                {
                  event: eventExample,
                  status: 'going',
                },
              ],
              attendanceCount: 12,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/events/{eventId}',
  summary: 'Retrieve a single event by ID',
  description: 'Get a single event by its id.',
  tags: ['events'],
  request: {
    params: getEventParamsSchema,
  },
  responses: {
    200: {
      description: 'Event details',
      content: {
        'application/json': {
          schema: getEventApiResponseSchema,
          example: {
            code: 200,
            message: 'Event fetched successfully',
            data: {
              event: eventExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/v1/events/{eventId}/attendance',
  summary: 'Upsert attendance for an event',
  description:
    'Create or update the authenticated user attendance (RSVP). going is rejected when the venue is at capacity.',
  tags: ['events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: upsertAttendanceParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: upsertAttendanceRequestBodySchema,
          example: { status: 'going' },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Attendance saved',
      content: {
        'application/json': {
          schema: upsertAttendanceApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              event: { ...eventExample, goingCount: 43 },
              myAttendance: 'going',
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/v1/events',
  summary: 'Create a new event',
  description:
    'Create a new event. organizerId is set from the authenticated user.',
  tags: ['events'],
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: createEventRequestBodySchema,
          example: createEventBodyExample,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Event created successfully',
      content: {
        'application/json': {
          schema: createEventApiResponseSchema,
          example: {
            code: 201,
            message: 'Success.',
            data: {
              createdEvent: eventExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/v1/events/{eventId}',
  summary: 'Patch an event',
  description:
    'Partially update an existing event. Requires organizer or platform admin.',
  tags: ['events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: patchEventParamsSchema,
    body: {
      content: {
        'application/json': {
          schema: patchEventRequestBodySchema,
          example: {
            title: 'Updated Summer Music Festival',
            status: 'published',
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Event patched successfully',
      content: {
        'application/json': {
          schema: patchEventApiResponseSchema,
          example: {
            code: 200,
            message: 'Success.',
            data: {
              updatedEvent: eventExample,
            },
            timestamp: 1_704_067_200_000,
          },
        },
      },
    },
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/v1/events/{eventId}',
  summary: 'Delete an event',
  description:
    'Hard-delete an event by ID (attendees cascade). Requires organizer or platform admin. Soft delete is deferred.',
  tags: ['events'],
  security: [{ bearerAuth: [] }],
  request: {
    params: getEventParamsSchema,
  },
  responses: {
    204: {
      description: 'Event deleted; no response body.',
    },
  },
});

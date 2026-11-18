import { type Request, Router } from 'express';

import { eventController } from '@/modules/event/event.controller';

import { authenticate } from '@/common/middlewares/authenticate.middleware';
import { validate } from '@/common/middlewares/validate.middleware';

import {
  type CreateEventRequestBody,
  createEventRequestBodySchema,
} from './schemas/endpoints/create-event.schema';
import {
  type GetEventParams,
  getEventParamsSchema,
} from './schemas/endpoints/get-event.schema';
import {
  type GetEventsQuery,
  getEventsQuerySchema,
} from './schemas/endpoints/get-events.schema';
import {
  type GetMyAttendanceQuery,
  getMyAttendanceQuerySchema,
} from './schemas/endpoints/get-my-attendance.schema';
import {
  type PatchEventParams,
  type PatchEventRequestBody,
  patchEventParamsSchema,
  patchEventRequestBodySchema,
} from './schemas/endpoints/patch-event.schema';
import {
  type UpsertAttendanceParams,
  type UpsertAttendanceRequestBody,
  upsertAttendanceParamsSchema,
  upsertAttendanceRequestBodySchema,
} from './schemas/endpoints/upsert-attendance.schema';

export const eventsRouter = Router();

eventsRouter.get(
  '/',
  validate({ query: getEventsQuerySchema }),
  async (req, res) => {
    await eventController.getMany(
      req as unknown as Request<{}, {}, {}, GetEventsQuery>,
      res,
    );
  },
);

eventsRouter.get(
  '/me/attendance',
  authenticate,
  validate({ query: getMyAttendanceQuerySchema }),
  async (req, res) => {
    await eventController.getMyAttendance(
      req as unknown as Request<{}, {}, {}, GetMyAttendanceQuery>,
      res,
    );
  },
);

eventsRouter.put(
  '/:eventId/attendance',
  authenticate,
  validate({
    params: upsertAttendanceParamsSchema,
    body: upsertAttendanceRequestBodySchema,
  }),
  async (
    req: Request<UpsertAttendanceParams, {}, UpsertAttendanceRequestBody>,
    res,
  ) => {
    await eventController.upsertAttendance(req, res);
  },
);

eventsRouter.get(
  '/:eventId',
  validate({ params: getEventParamsSchema }),
  async (req: Request<GetEventParams>, res) => {
    await eventController.getById(req, res);
  },
);

eventsRouter.post(
  '/',
  authenticate,
  validate({ body: createEventRequestBodySchema }),
  async (req: Request<{}, {}, CreateEventRequestBody>, res) => {
    await eventController.create(req, res);
  },
);

eventsRouter.patch(
  '/:eventId',
  authenticate,
  validate({
    params: patchEventParamsSchema,
    body: patchEventRequestBodySchema,
  }),
  async (
    req: Request<PatchEventParams, {}, PatchEventRequestBody>,
    res,
  ) => {
    await eventController.patch(req, res);
  },
);

eventsRouter.delete(
  '/:eventId',
  authenticate,
  validate({ params: getEventParamsSchema }),
  async (req: Request<GetEventParams>, res) => {
    await eventController.delete(req, res);
  },
);

import type { Request, Response } from 'express';

import { eventService } from '@/modules/event/event.service';
import type {
  CreateEventRequestBody,
  CreateEventResponse,
} from '@/modules/event/schemas/endpoints/create-event.schema';
import type {
  GetEventParams,
  GetEventResponse,
} from '@/modules/event/schemas/endpoints/get-event.schema';
import type {
  GetEventsQuery,
  GetEventsResponse,
} from '@/modules/event/schemas/endpoints/get-events.schema';
import type {
  GetMyAttendanceQuery,
  GetMyAttendanceResponse,
} from '@/modules/event/schemas/endpoints/get-my-attendance.schema';
import type {
  PatchEventParams,
  PatchEventRequestBody,
  PatchEventResponse,
} from '@/modules/event/schemas/endpoints/patch-event.schema';
import type {
  UpsertAttendanceParams,
  UpsertAttendanceRequestBody,
  UpsertAttendanceResponse,
} from '@/modules/event/schemas/endpoints/upsert-attendance.schema';

import { HTTP_STATUS } from '@/common/constants/http-codes';
import { sendSuccess } from '@/common/libs/send-success';
import type { ApiResponse } from '@/common/types/api-response.type';

export class EventController {
  async getMany(
    req: Request<{}, {}, {}, GetEventsQuery>,
    res: Response<ApiResponse<GetEventsResponse>>,
  ) {
    const data = await eventService.getMany(req.query);
    return sendSuccess(res, { data });
  }

  async getById(
    req: Request<GetEventParams>,
    res: Response<ApiResponse<GetEventResponse>>,
  ) {
    const data = await eventService.getById(req.params.eventId);
    return sendSuccess(res, { data });
  }

  async create(
    req: Request<{}, {}, CreateEventRequestBody>,
    res: Response<ApiResponse<CreateEventResponse>>,
  ) {
    const createdEvent = await eventService.create(req.body, req.user!.id);

    return sendSuccess(res, {
      data: { createdEvent },
      code: HTTP_STATUS.CREATED,
    });
  }

  async patch(
    req: Request<PatchEventParams, {}, PatchEventRequestBody>,
    res: Response<ApiResponse<PatchEventResponse>>,
  ) {
    const updatedEvent = await eventService.patch(
      req.params.eventId,
      req.body,
      req.user!,
    );

    return sendSuccess(res, { data: { updatedEvent } });
  }

  async delete(req: Request<GetEventParams>, res: Response) {
    await eventService.delete(req.params.eventId, req.user!);
    return res.status(HTTP_STATUS.NO_CONTENT).send();
  }

  async upsertAttendance(
    req: Request<UpsertAttendanceParams, {}, UpsertAttendanceRequestBody>,
    res: Response<ApiResponse<UpsertAttendanceResponse>>,
  ) {
    const data = await eventService.upsertAttendance(
      req.params.eventId,
      req.user!.id,
      req.body.status,
    );

    return sendSuccess(res, { data });
  }

  async getMyAttendance(
    req: Request<{}, {}, {}, GetMyAttendanceQuery>,
    res: Response<ApiResponse<GetMyAttendanceResponse>>,
  ) {
    const data = await eventService.getMyAttendance(req.user!.id, req.query);

    return sendSuccess(res, { data });
  }
}

export const eventController = new EventController();

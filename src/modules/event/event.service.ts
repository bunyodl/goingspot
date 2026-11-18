import {
  EVENT_ATTENDANCE_STATUSES,
  type EventAttendanceStatus,
} from '@/modules/event/constants/event.constants';
import { eventRepository } from '@/modules/event/event.repository';
import type { CreateEventRequestBody } from '@/modules/event/schemas/endpoints/create-event.schema';
import type { GetEventResponse } from '@/modules/event/schemas/endpoints/get-event.schema';
import type {
  GetEventsQuery,
  GetEventsResponse,
} from '@/modules/event/schemas/endpoints/get-events.schema';
import type {
  GetMyAttendanceQuery,
  GetMyAttendanceResponse,
} from '@/modules/event/schemas/endpoints/get-my-attendance.schema';
import type { PatchEventRequestBody } from '@/modules/event/schemas/endpoints/patch-event.schema';
import type { UpsertAttendanceResponse } from '@/modules/event/schemas/endpoints/upsert-attendance.schema';
import type { EventDto } from '@/modules/event/schemas/resources/event.schema';
import { USER_ROLES } from '@/modules/user/constants/user.constants';
import { venueRepository } from '@/modules/venue/venue.repository';

import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@/common/exceptions';
import { exists } from '@/common/libs/exists';
import type { AuthUser } from '@/common/types/auth-user.type';

import { mapEventRowToDto } from './helpers/map-event-row';

class EventService {
  async getMany(params: GetEventsQuery): Promise<GetEventsResponse> {
    const [eventRows, eventsCount] = await Promise.all([
      eventRepository.getMany(params),
      eventRepository.getTotalCount(params),
    ]);

    // N+1: one COUNT per event. Swap for a single JOIN/GROUP BY when list size hurts.
    const goingCounts = await Promise.all(
      eventRows.map((row) => eventRepository.countGoing(row.id)),
    );
    const events = eventRows.map((row, index) =>
      mapEventRowToDto(row, goingCounts[index]!),
    );

    return { events, eventsCount };
  }

  async getById(eventId: string): Promise<GetEventResponse> {
    const [eventRow, goingCount] = await Promise.all([
      eventRepository.getById(eventId),
      eventRepository.countGoing(eventId),
    ]);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    return { event: mapEventRowToDto(eventRow, goingCount) };
  }

  async create(
    body: CreateEventRequestBody,
    organizerId: string,
  ): Promise<EventDto> {
    const createdEvent = await eventRepository.create(body, organizerId);
    return mapEventRowToDto(createdEvent, 0);
  }

  async patch(
    eventId: string,
    body: PatchEventRequestBody,
    user: AuthUser,
  ): Promise<EventDto> {
    await this.assertCanManage(eventId, user);

    const [eventRow, goingCount] = await Promise.all([
      eventRepository.patch(eventId, body),
      eventRepository.countGoing(eventId),
    ]);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    return mapEventRowToDto(eventRow, goingCount);
  }

  async delete(eventId: string, user: AuthUser): Promise<void> {
    await this.assertCanManage(eventId, user);

    const eventRow = await eventRepository.delete(eventId);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }
  }

  async upsertAttendance(
    eventId: string,
    userId: string,
    status: EventAttendanceStatus,
  ): Promise<UpsertAttendanceResponse> {
    const eventRow = await eventRepository.getById(eventId);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    const isGoing = status === EVENT_ATTENDANCE_STATUSES.GOING;

    if (isGoing) {
      const venue = await venueRepository.getById(eventRow.venue_id);

      if (!exists(venue)) {
        throw new NotFoundException('Venue not found');
      }

      const otherGoingCount =
        await eventRepository.countGoingExcludingUser(eventId, userId);
      const isAtCapacity = otherGoingCount >= venue.capacity;

      if (isAtCapacity) {
        throw new ConflictException('Event is at capacity');
      }
    }

    const attendanceRow = await eventRepository.upsertAttendance(
      eventId,
      userId,
      status,
    );
    const goingCount = await eventRepository.countGoing(eventId);

    return {
      event: mapEventRowToDto(eventRow, goingCount),
      myAttendance: attendanceRow.status,
    };
  }

  async getMyAttendance(
    userId: string,
    params: GetMyAttendanceQuery,
  ): Promise<GetMyAttendanceResponse> {
    const [rows, attendanceCount] = await Promise.all([
      eventRepository.getMyAttendance(userId, params),
      eventRepository.getMyAttendanceCount(userId, params.status),
    ]);

    // Same N+1 as getMany; fold into the attendance list SQL when it becomes slow.
    const goingCounts = await Promise.all(
      rows.map((row) => eventRepository.countGoing(row.id)),
    );

    return {
      attendance: rows.map((row, index) => ({
        event: mapEventRowToDto(row, goingCounts[index]!),
        status: row.attendance_status,
      })),
      attendanceCount,
    };
  }

  private async assertCanManage(
    eventId: string,
    user: AuthUser,
  ): Promise<void> {
    const eventRow = await eventRepository.getById(eventId);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    const isOrganizer = eventRow.organizer_id === user.id;
    const isAdmin = user.role === USER_ROLES.ADMIN;

    if (!isOrganizer && !isAdmin) {
      throw new ForbiddenException('You cannot manage this event');
    }
  }
}

export const eventService = new EventService();

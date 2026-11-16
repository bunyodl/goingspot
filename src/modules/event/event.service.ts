import { eventRepository } from '@/modules/event/event.repository';
import type { CreateEventRequestBody } from '@/modules/event/schemas/endpoints/create-event.schema';
import type { GetEventResponse } from '@/modules/event/schemas/endpoints/get-event.schema';
import type {
  GetEventsQuery,
  GetEventsResponse,
} from '@/modules/event/schemas/endpoints/get-events.schema';
import type { PatchEventRequestBody } from '@/modules/event/schemas/endpoints/patch-event.schema';
import type { EventDto } from '@/modules/event/schemas/resources/event.schema';
import { USER_ROLES } from '@/modules/user/constants/user.constants';

import { ForbiddenException, NotFoundException } from '@/common/exceptions';
import { exists } from '@/common/libs/exists';
import type { AuthUser } from '@/common/types/auth-user.type';

import { mapEventRowToDto } from './helpers/map-event-row';

class EventService {
  async getMany(params: GetEventsQuery): Promise<GetEventsResponse> {
    const [eventRows, eventsCount] = await Promise.all([
      eventRepository.getMany(params),
      eventRepository.getTotalCount(params.search),
    ]);

    const events = eventRows.map(mapEventRowToDto);
    return { events, eventsCount };
  }

  async getById(eventId: string): Promise<GetEventResponse> {
    const eventRow = await eventRepository.getById(eventId);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    return { event: mapEventRowToDto(eventRow) };
  }

  async create(
    body: CreateEventRequestBody,
    organizerId: string,
  ): Promise<EventDto> {
    const createdEvent = await eventRepository.create(body, organizerId);
    return mapEventRowToDto(createdEvent);
  }

  async patch(
    eventId: string,
    body: PatchEventRequestBody,
    user: AuthUser,
  ): Promise<EventDto> {
    await this.assertCanManage(eventId, user);

    const eventRow = await eventRepository.patch(eventId, body);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    return mapEventRowToDto(eventRow);
  }

  async delete(eventId: string, user: AuthUser): Promise<EventDto> {
    await this.assertCanManage(eventId, user);

    const eventRow = await eventRepository.delete(eventId);

    if (!exists(eventRow)) {
      throw new NotFoundException('Event not found');
    }

    return mapEventRowToDto(eventRow);
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

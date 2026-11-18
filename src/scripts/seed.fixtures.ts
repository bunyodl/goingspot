import {
  EVENT_ATTENDANCE_STATUSES,
  EVENT_STATUSES,
  EVENT_TYPES,
} from '@/modules/event/constants/event.constants';
import type { EventAttendeeDto } from '@/modules/event/helpers/map-event-attendee-row';
import type { EventDto } from '@/modules/event/schemas/resources/event.schema';
import {
  USER_ROLES,
  type UserRole,
} from '@/modules/user/constants/user.constants';
import type { UserDto } from '@/modules/user/schemas/resources/user.schema';
import type { VenueDto } from '@/modules/venue/schemas/resources/venue.schema';

const FIRST_NAMES = [
  'Alice',
  'Bob',
  'Carlos',
  'Diana',
  'Ethan',
  'Fatima',
  'George',
  'Hiro',
  'Isabella',
  'Jack',
  'Liam',
  'Mia',
  'Noah',
  'Olivia',
  'Paul',
  'Quinn',
  'Rita',
  'Sam',
  'Tina',
  'Uma',
  'Victor',
  'Wendy',
  'Xavier',
  'Yara',
  'Zane',
] as const;

const LAST_NAMES = [
  'Nguyen',
  'Patel',
  'Garcia',
  'Kim',
  'Johnson',
  'Silva',
  'Andersen',
  'Kowalski',
  'Ivanov',
  'Brown',
  'Chen',
  'Rossi',
  'Müller',
  'Sato',
  'Ali',
] as const;

const VENUE_DEFS = [
  {
    name: 'Main Hall SF',
    location: 'San Francisco, USA',
    timezone: 'America/Los_Angeles',
    capacity: 300,
  },
  {
    name: 'Berlin Tech Arena',
    location: 'Berlin, Germany',
    timezone: 'Europe/Berlin',
    capacity: 500,
  },
  {
    name: 'Online - Zoom',
    location: 'Virtual, Global',
    timezone: 'UTC',
    capacity: 1000,
  },
  {
    name: 'Tokyo Dev Hub',
    location: 'Tokyo, Japan',
    timezone: 'Asia/Tokyo',
    capacity: 250,
  },
  {
    name: 'Frunze Stadium',
    location: 'Dushanbe, Tajikistan',
    timezone: 'Asia/Dushanbe',
    capacity: 400,
  },
  {
    name: 'Paris Startup Studio',
    location: 'Paris, France',
    timezone: 'Europe/Paris',
    capacity: 150,
  },
  {
    name: 'London CodeBase',
    location: 'London, UK',
    timezone: 'Europe/London',
    capacity: 350,
  },
  {
    name: 'Dubai Tech Center',
    location: 'Dubai, UAE',
    timezone: 'Asia/Dubai',
    capacity: 200,
  },
  {
    name: 'São Paulo Campus',
    location: 'São Paulo, Brazil',
    timezone: 'America/Sao_Paulo',
    capacity: 300,
  },
  {
    name: 'Melbourne Digital Arena',
    location: 'Melbourne, Australia',
    timezone: 'Australia/Sydney',
    capacity: 250,
  },
  {
    name: 'Seoul Maker Space',
    location: 'Seoul, South Korea',
    timezone: 'Asia/Seoul',
    capacity: 180,
  },
  {
    name: 'Toronto Hub',
    location: 'Toronto, Canada',
    timezone: 'America/Toronto',
    capacity: 220,
  },
  {
    name: 'Amsterdam Dock',
    location: 'Amsterdam, Netherlands',
    timezone: 'Europe/Amsterdam',
    capacity: 160,
  },
  {
    name: 'Lisbon Loft',
    location: 'Lisbon, Portugal',
    timezone: 'Europe/Lisbon',
    capacity: 120,
  },
  {
    name: 'Warsaw Arena',
    location: 'Warsaw, Poland',
    timezone: 'Europe/Warsaw',
    capacity: 280,
  },
  {
    name: 'Nairobi Innovation Lab',
    location: 'Nairobi, Kenya',
    timezone: 'Africa/Nairobi',
    capacity: 140,
  },
  {
    name: 'Mexico City Forum',
    location: 'Mexico City, Mexico',
    timezone: 'America/Mexico_City',
    capacity: 260,
  },
  {
    name: 'Stockholm Studio',
    location: 'Stockholm, Sweden',
    timezone: 'Europe/Stockholm',
    capacity: 130,
  },
] as const;

const EVENT_TITLE_SEEDS = [
  ['React Meetup', ['react', 'frontend']],
  ['Vue.js Europe', ['vue', 'frontend']],
  ['Docker Deep Dive', ['docker', 'devops']],
  ['Python for Data Science', ['python', 'data']],
  ['Next.js SEO Workshop', ['nextjs', 'seo']],
  ['AI Startups Demo Day', ['ai', 'startups']],
  ['Security Best Practices', ['security', 'web']],
  ['Cloudflare & Edge Computing', ['cloudflare', 'edge']],
  ['GraphQL vs REST', ['graphql', 'rest', 'api']],
  ['Kubernetes Crash Course', ['kubernetes', 'devops']],
  ['Rust Game Dev', ['rust', 'game']],
  ['Firebase & Firestore', ['firebase', 'backend']],
  ['SvelteConf', ['svelte', 'frontend']],
  ['Web3 Summit', ['web3', 'blockchain']],
  ['PostgreSQL Performance', ['postgresql', 'database']],
  ['Deno for Beginners', ['deno', 'javascript']],
  ['Machine Learning Bootcamp', ['ml', 'ai']],
  ['Flutter Mobile Fest', ['flutter', 'mobile']],
  ['TypeScript Advanced', ['typescript', 'advanced']],
  ['CI/CD Pipelines Workshop', ['ci', 'cd', 'devops']],
  ['Node.js Internals', ['nodejs', 'backend']],
  ['CSS Architecture', ['css', 'frontend']],
  ['Observability 101', ['otel', 'ops']],
  ['Product Design Critique', ['design', 'ux']],
  ['API Gateway Patterns', ['api', 'gateway']],
] as const;

export const SEED_USER_COUNT = 220;
export const SEED_EVENT_COUNT = 50;
export const SEED_CREATED_AT = '2024-07-01T12:00:00.000Z';
const FIRST_EVENT_STARTS_AT = '2025-09-03T00:00:00.000Z';
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_BETWEEN_EVENTS = 2;

export type SeedUser = UserDto & { password: string };
export type SeedVenue = VenueDto;
export type SeedEvent = EventDto;
export type SeedAttendee = EventAttendeeDto;
export type SeedCredential = Pick<UserDto, 'email' | 'role'> & {
  password: string;
};

export function seedUuid(n: number): string {
  return `0190f5a3-0000-7000-8000-${String(n).padStart(12, '0')}`;
}

export function seedPasswordForIndex(index: number): string {
  return `Pass-${String(index).padStart(3, '0')}!Ab`;
}

function mulberry32(seed: number): () => number {
  const mixer = 0x6d2b79f5;
  const uint32Count = 2 ** 32;
  let state = seed;

  return () => {
    const stateAsInt32 = state | 0;
    const stateAfterMix = (stateAsInt32 + mixer) | 0;
    state = stateAfterMix; // next call starts here; unused in this call

    const shiftedBy15 = stateAfterMix >>> 15;
    const mixedOnce = Math.imul(stateAfterMix ^ shiftedBy15, 1 | stateAfterMix);

    const shiftedBy7 = mixedOnce >>> 7;
    const mixedTwice =
      (mixedOnce + Math.imul(mixedOnce ^ shiftedBy7, 61 | mixedOnce)) ^
      mixedOnce;

    const shiftedBy14 = mixedTwice >>> 14;
    const unsignedBits = (mixedTwice ^ shiftedBy14) >>> 0;

    return unsignedBits / uint32Count;
  };
}

function pickRole(index: number): UserRole {
  if (index <= 3) {
    return USER_ROLES.ADMIN;
  }
  return USER_ROLES.USER;
}

export function buildSeedUsers(): SeedUser[] {
  const users: SeedUser[] = [];

  for (let index = 1; index <= SEED_USER_COUNT; index += 1) {
    const firstName = FIRST_NAMES[(index - 1) % FIRST_NAMES.length]!;
    const lastName =
      LAST_NAMES[
        Math.floor((index - 1) / FIRST_NAMES.length) % LAST_NAMES.length
      ]!;
    const email =
      index === 1
        ? 'alice@example.com'
        : index === 2
          ? 'bob@example.com'
          : `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${String(index).padStart(3, '0')}@example.com`;

    users.push({
      id: seedUuid(index),
      firstName: index === 1 ? 'Alice' : firstName,
      lastName: index === 1 ? 'Admin' : lastName,
      email,
      imageUrl: null,
      role: pickRole(index),
      password: seedPasswordForIndex(index),
      createdAt: SEED_CREATED_AT,
      updatedAt: null,
    });
  }

  return users;
}

export function buildSeedVenues(): SeedVenue[] {
  return VENUE_DEFS.map((venue, index) => ({
    id: seedUuid(index + 1),
    name: venue.name,
    location: venue.location,
    timezone: venue.timezone,
    capacity: venue.capacity,
    createdAt: SEED_CREATED_AT,
    updatedAt: null,
  }));
}

export function buildSeedEvents(
  users: SeedUser[],
  venues: SeedVenue[],
): SeedEvent[] {
  const events: SeedEvent[] = [];
  const organizerPool = users.filter((user) => user.role === USER_ROLES.USER);
  const firstEventStartsAtMs = Date.parse(FIRST_EVENT_STARTS_AT);
  const eventSpacingMs = DAYS_BETWEEN_EVENTS * MS_PER_DAY;
  const random = mulberry32(7);
  const emptyGoingChance = 0.2;

  for (let index = 0; index < SEED_EVENT_COUNT; index += 1) {
    const [titleBase, tags] =
      EVENT_TITLE_SEEDS[index % EVENT_TITLE_SEEDS.length]!;
    const yearSuffix = 2025 + Math.floor(index / EVENT_TITLE_SEEDS.length);
    const venue = venues[index % venues.length]!;
    const organizer =
      organizerPool[index % organizerPool.length] ?? users[users.length - 1]!;
    const eventStartsAtMs = firstEventStartsAtMs + index * eventSpacingMs;
    const date = new Date(eventStartsAtMs).toISOString();
    const halfCapacity = Math.floor(venue.capacity / 2);
    const capacitySpan = venue.capacity - halfCapacity + 1;
    const isEmptyGoing = random() < emptyGoingChance;
    const goingCount = isEmptyGoing
      ? 0
      : halfCapacity + Math.floor(random() * capacitySpan);

    events.push({
      id: seedUuid(index + 1),
      title: `${titleBase} ${yearSuffix}`,
      description: `A session on ${titleBase.toLowerCase()} with expert speakers.`,
      type: venue.name.startsWith('Online')
        ? EVENT_TYPES.ONLINE
        : EVENT_TYPES.IN_PERSON,
      status: EVENT_STATUSES.PUBLISHED,
      venueId: venue.id,
      organizerId: organizer.id,
      date,
      tags: [...tags],
      goingCount,
      createdAt: SEED_CREATED_AT,
      updatedAt: null,
    });
  }

  return events;
}

export function buildSeedAttendees(
  users: SeedUser[],
  venues: SeedVenue[],
  events: SeedEvent[],
): SeedAttendee[] {
  const random = mulberry32(42);
  const venueById = new Map(venues.map((venue) => [venue.id, venue]));
  const attendees: SeedAttendee[] = [];

  for (const event of events) {
    const venue = venueById.get(event.venueId)!;
    const goingTarget = Math.min(
      venue.capacity,
      25 + Math.floor(random() * 55),
    );
    const interestedTarget = 20 + Math.floor(random() * 40);
    const notGoingTarget = 10 + Math.floor(random() * 25);
    const totalNeeded = goingTarget + interestedTarget + notGoingTarget;

    const shuffled = [...users]
      .sort(() => random() - 0.5)
      .slice(0, totalNeeded);
    let cursor = 0;

    const pushAttendee = (
      user: SeedUser | undefined,
      status: SeedAttendee['status'],
    ) => {
      if (!user) return;

      attendees.push({
        eventId: event.id,
        userId: user.id,
        status,
        createdAt: SEED_CREATED_AT,
        updatedAt: null,
      });
    };

    for (let i = 0; i < goingTarget; i += 1) {
      pushAttendee(shuffled[cursor++], EVENT_ATTENDANCE_STATUSES.GOING);
    }

    for (let i = 0; i < interestedTarget; i += 1) {
      pushAttendee(shuffled[cursor++], EVENT_ATTENDANCE_STATUSES.INTERESTED);
    }

    for (let i = 0; i < notGoingTarget; i += 1) {
      pushAttendee(shuffled[cursor++], EVENT_ATTENDANCE_STATUSES.NOT_GOING);
    }
  }

  return attendees;
}

export function toSeedCredentials(users: SeedUser[]): SeedCredential[] {
  return users.map((user) => ({
    email: user.email,
    password: user.password,
    role: user.role,
  }));
}

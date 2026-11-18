import 'dotenv/config';

import { hash } from 'argon2';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { pool } from '@/db/pool';

import {
  buildSeedAttendees,
  buildSeedEvents,
  buildSeedUsers,
  buildSeedVenues,
  toSeedCredentials,
} from '@/scripts/seed.fixtures';

async function seed(): Promise<void> {
  const users = buildSeedUsers();
  const venues = buildSeedVenues();
  const events = buildSeedEvents(users, venues);
  const attendees = buildSeedAttendees(users, venues, events);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(
      'TRUNCATE refresh_tokens, event_attendees, events, venues, users CASCADE',
    );

    for (const user of users) {
      const passwordHash = await hash(user.password);

      await client.query(
        `INSERT INTO users (
           id, first_name, last_name, email, image_url, role, password_hash, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.imageUrl,
          user.role,
          passwordHash,
          user.createdAt,
          user.updatedAt,
        ],
      );
    }

    for (const venue of venues) {
      await client.query(
        `INSERT INTO venues (
           id, name, location, timezone, capacity, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          venue.id,
          venue.name,
          venue.location,
          venue.timezone,
          venue.capacity,
          venue.createdAt,
          venue.updatedAt,
        ],
      );
    }

    for (const event of events) {
      await client.query(
        `INSERT INTO events (
           id, title, description, type, status, venue_id, organizer_id,
           date, tags, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          event.id,
          event.title,
          event.description,
          event.type,
          event.status,
          event.venueId,
          event.organizerId,
          event.date,
          event.tags,
          event.createdAt,
          event.updatedAt,
        ],
      );
    }

    for (const attendee of attendees) {
      await client.query(
        `INSERT INTO event_attendees (
           event_id, user_id, status, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4, $5)`,
        [
          attendee.eventId,
          attendee.userId,
          attendee.status,
          attendee.createdAt,
          attendee.updatedAt,
        ],
      );
    }

    await client.query('COMMIT');

    const credentialsPath = path.resolve(process.cwd(), '.seed-credentials.json');
    await writeFile(
      credentialsPath,
      `${JSON.stringify(toSeedCredentials(users), null, 2)}\n`,
      'utf8',
    );

    const alice = users[0]!;
    const sampleUser = users.find((user) => user.role === 'user')!;

    process.stdout.write(
      `Seeded ${users.length} users, ${venues.length} venues, ${events.length} events, ${attendees.length} attendees\n`,
    );
    process.stdout.write(`Credentials written to ${credentialsPath}\n`);
    process.stdout.write(
      `Demo admin: ${alice.email} / ${alice.password}\n`,
    );
    process.stdout.write(
      `Demo user:  ${sampleUser.email} / ${sampleUser.password}\n`,
    );
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main(): Promise<void> {
  try {
    await seed();
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

void main();

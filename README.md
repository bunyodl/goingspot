# GoingSpot

Local event discovery and coordination API. Educational Express + PostgreSQL backend for browsing venues and events, creating accounts, and (later) RSVPs, auth, and more.

## Tech stack

- Node.js (ESM) + TypeScript
- Express 5, Zod 4, PostgreSQL (`pg`), argon2
- OpenAPI via `@asteasolutions/zod-to-openapi` + Swagger UI
- Docker Compose, Dockerfile, Fly.io (`goingspot`)

## Current progress

MVP target is schema/CRUD, auth/RBAC, then validation/cache/queues. Right now the CRUD foundation is largely in place; auth and the rest are still ahead.

| Area | Status |
| --- | --- |
| Users / venues / events CRUD | Done — mounted under `/api/v1` |
| Schema (`users`, `venues`, `events`, `event_attendees`) | Done — [`src/db/migrations/001-init.sql`](src/db/migrations/001-init.sql) |
| Password hashing on user create | Done — argon2 via auth service |
| Auth routes / JWT / RBAC | Not started (OpenAPI bearer scheme declared only) |
| RSVP / attendees API | Table only — no endpoints |
| Redis, queues, Stripe, maps, AI | Planned |
| Automated tests | None yet |
| Deploy workflow | Manual only (`workflow_dispatch` in [`.github/workflows/publish.yml`](.github/workflows/publish.yml)) |

## API at a glance

Base path: `/api/v1`

| Resource | Methods |
| --- | --- |
| `/events` | `GET`, `POST` |
| `/events/:eventId` | `GET`, `PATCH`, `DELETE` |
| `/venues` | `GET`, `POST` |
| `/venues/:venueId` | `GET`, `PATCH`, `DELETE` |
| `/users` | `GET`, `POST` |
| `/users/:userId` | `GET`, `DELETE` |

Interactive docs: `/api-spec` (Swagger UI) · OpenAPI JSON: `/swagger.json`

## Run locally

Create a `.env` in the project root:

```env
PORT=3000
API_URL=http://localhost:3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=goingspot
DB_DATA_DIR=/var/lib/postgresql/data
```

`DB_DATA_DIR` is used by Docker Compose only.

### With Docker Compose

```bash
docker compose up
```

Postgres is initialized from `src/db/migrations/001-init.sql` on first start. The API listens on port 3000.

### Without Compose

Run PostgreSQL yourself (apply `001-init.sql`), then:

```bash
npm install
npm run dev
```

### Seed data (optional)

```bash
npm run seed
```

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with watch |
| `npm run build` / `npm start` | Production build and run |
| `npm run typecheck` | TypeScript check |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run format` | Prettier |
| `npm run seed` | Seed the database |

## Project layout

```
src/
  modules/          # user, venue, event, auth (route → controller → service → repository)
  db/               # pool, migrations
  openapi/          # OpenAPI document, paths, schemas
  common/           # exceptions, middlewares, shared libs
  config/           # env, swagger
  scripts/          # seed
```

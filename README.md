# GoingSpot

Local event discovery and coordination API. Educational Express + PostgreSQL backend for browsing venues and events, accounts, auth, and attendance (RSVP).

## Tech stack

- Node.js (ESM) + TypeScript
- Express 5, Zod 4, PostgreSQL (`pg`), argon2, jose
- OpenAPI via `@asteasolutions/zod-to-openapi` + Swagger UI
- Docker Compose, Dockerfile, Fly.io (`goingspot`)

## Current progress

Thin backend MVP: CRUD + password auth + attendance + demo seed. Redis/queues and frontend come next.

| Area | Status |
| --- | --- |
| Users / venues / events CRUD | Done — mounted under `/api/v1` |
| Schema (`users`, `venues`, `events`, `event_attendees`, `refresh_tokens`) | Done |
| Password auth (register/login/refresh/logout) + `GET /auth/me` | Done |
| Platform admin RBAC on `/users` + event ownership | Done |
| Attendance / RSVP (`PUT /events/:eventId/attendance`, my attendance, going counts, capacity) | Done |
| Demo seed (200+ users, unique passwords, dense attendees) | Done — `npm run seed` |
| Redis, queues, Stripe, maps, AI | Planned |
| Automated tests | None yet |
| Deploy workflow | Manual only (`workflow_dispatch` in [`.github/workflows/publish.yml`](.github/workflows/publish.yml)) |

Pain-driven follow-ups (N+1 counts, cache, etc.): [DEFERRED.md](DEFERRED.md).

## API at a glance

Base path: `/api/v1`

| Resource | Methods |
| --- | --- |
| `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout` | `POST` |
| `/auth/me` | `GET` |
| `/events` | `GET`, `POST` |
| `/events/me/attendance` | `GET` |
| `/events/:eventId` | `GET`, `PATCH`, `DELETE` |
| `/events/:eventId/attendance` | `PUT` |
| `/venues` | `GET`, `POST` |
| `/venues/:venueId` | `GET`, `PATCH`, `DELETE` |
| `/users` | `GET`, `POST` (admin) |
| `/users/:userId` | `GET`, `DELETE` (admin) |

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

Writes ~220 users (unique argon2 passwords), ~18 venues, ~50 events, and dense `event_attendees` rows. Full credentials land in gitignored `.seed-credentials.json`. Demo logins printed by the seed script (also recoverable as `Pass-NNN!Ab` where `NNN` is the 1-based user index):

| Account | Email | Password |
| --- | --- | --- |
| Admin | `alice@example.com` | `Pass-001!Ab` |
| User | `diana.nguyen.004@example.com` | `Pass-004!Ab` |

Requires `refresh_tokens` migration applied (`002-refresh-tokens-table.sql`).

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

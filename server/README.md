# Landmark Port Harcourt · Admin API

Node + Express + MySQL (AWS RDS) backend for the Landmark site. Serves the public content endpoint the frontend hydrates from, exposes CRUD for every content collection, and handles admin auth + bookings.

## Prerequisites

- Node 20+
- An AWS RDS MySQL 8 instance (or any MySQL 8-compatible server)
- A database created on that instance (e.g. `landmark`) and a user with `ALL PRIVILEGES` on it

## Setup

```bash
cd server
cp .env.example .env      # fill in DB_HOST / DB_USER / DB_PASSWORD / DB_NAME / JWT_SECRET
npm install
npm run db:schema         # apply db/schema.sql
npm run db:seed           # populate from ../src/content.json + create admin user
npm run dev               # start API on :4000
```

`npm run db:reset` runs schema + seed together, useful during development.

## AWS RDS notes

- Set `DB_SSL=true` in `.env` — the pool ships with `rejectUnauthorized: false`, which is enough for RDS' self-signed CA out of the box.
- If you tighten security later, download `rds-combined-ca-bundle.pem` from AWS and pass it via `ssl: { ca: fs.readFileSync(...) }` in `src/db.js`.
- The RDS security group must allow inbound `3306` from wherever you run the API (your EC2 / ECS / local IP).

## API surface

### Public
- `GET  /api/health`
- `GET  /api/content` — returns the full site content shape (same as `src/content.json`), assembled from `settings` + collection tables
- `POST /api/bookings` — writes a booking from the `/bookings/:type` flow

### Auth
- `POST /api/auth/login` — `{ email, password }` → `{ token, user }`
- `GET  /api/auth/me` (Bearer)
- `POST /api/auth/password` (Bearer) — `{ newPassword }`

### Admin (all `Bearer` protected)
- `GET  /api/admin/collections` — metadata for all managed collections
- `GET  /api/admin/collections/:key` — list rows in a collection
- `POST /api/admin/collections/:key` — create
- `PUT  /api/admin/collections/:key/:id` — update
- `POST /api/admin/collections/:key/reorder` — `{ order: [id, id, ...] }`
- `DELETE /api/admin/collections/:key/:id` — remove
- `GET  /api/admin/settings` — all singleton JSON sections
- `GET  /api/admin/settings/:section` — one section
- `PUT  /api/admin/settings/:section` — `{ value: {...} }`
- `GET  /api/bookings` — list all bookings
- `PATCH /api/bookings/:id` — `{ status }` update
- `DELETE /api/bookings/:id`

## Data model

Two-tier storage:

1. **Singletons** live in the `settings` table as JSON blobs keyed by section — one row per section from `content.json` (`siteSettings`, `hero`, `intro`, `flagship`, `citizenApp`, …). Nested arrays that need row-level editing are *stripped* out of the JSON blob and moved into proper relational tables so the admin can edit and reorder them.
2. **Collections** live in dedicated tables (`nav_links`, `intro_pillars`, `zones`, `zone_items`, `waterfront_gallery`, `fnb_vendors`, `ticket_categories`, `ticket_items`, `citizen_features`, `rooms`, `panorama_chapters`, `reveal_callouts`). Each has an `id` PK, `sort_order` column, and the shape defined in [`src/collections.js`](src/collections.js).

`bookings` and `admin_users` are also relational tables — see `db/schema.sql`.

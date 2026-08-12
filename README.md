# Frokes OS

A calm, mobile-first personal operating system built around vocabulary, emotional check-in, and financial awareness.

## Run locally

```bash
npm install
npm run dev
```

V1 stores personal data locally in the browser for a fast, private, offline-friendly experience. Domain models and persistence are separated so a Drizzle/PostgreSQL repository can replace local storage when accounts and sync are introduced.

## Authentication and database

Copy `.env.example` to `.env.local`, then set:

- `DATABASE_URL` to a PostgreSQL connection string.
- `AUTH_SECRET` to the output of `openssl rand -base64 32`.
- `AUTH_TRUST_HOST=true` on trusted hosted deployments.

Apply the committed schema migration before opening registration:

```bash
npm run db:migrate
```

Accounts use email/password credentials, bcrypt password hashing, HTTP-only signed session cookies, and protected application routes. Daily records still use browser storage until the next synchronization milestone; the database table for user-owned records is already included in the migration.

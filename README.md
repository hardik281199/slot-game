# Slot Game API

TypeScript/Express API for the slot game backend.

## Project structure (LOOT-style)

- **src/app.ts** – Entry point; Express app, middlewares, router mounted at `/api/v1`.
- **src/config/** – Constants and Couchbase connection.
- **src/constants/** – Message keys and HTTP status.
- **src/controllers/** – Request handlers (`*.controller.ts`).
- **src/helpers/** – Utilities and mappers (`*.helper.ts`).
- **src/middlewares/** – Auth, validation, extendReq (`*.middleware.ts`).
- **src/routes/** – Route definitions (`*.routes.ts`); main router in `index.ts`.
- **src/validators/** – Joi schemas (`*.validator.ts`).
- **src/types/** – Shared TypeScript types.
- **src/seeder/** – Seed data and seeder script.

## Scripts

- **npm run dev** – Start with ts-node-dev (watch).
- **npm run build** – Compile TypeScript to `dist/`.
- **npm start** – Run `node dist/app.js`.
- **npm run lint** – ESLint + `tsc --noEmit`.
- **npm run format** – Prettier + ESLint --fix.

## API base path

All routes are under **`/api/v1`** (e.g. `POST /api/v1/login`, `GET /api/v1/userinfo`).

## Environment

Create a `.env` with `PORT`, `JWT_SECRET`, and optionally `COUCHBASE_USERNAME` / `COUCHBASE_PASSWORD`. See `COUCHBASE_SETUP.md` for Couchbase and in-memory fallback.

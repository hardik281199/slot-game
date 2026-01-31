# Stack & Project Definition

## Project Definition

**Slot Game API** is a REST backend for a slot-game product. It provides user authentication, wallet/bet state, game configuration (CRUD), and core slot mechanics (spin, gamble, collect). Data is stored in Couchbase with an in-memory fallback when Couchbase is unavailable.

## Node Version

- **Recommended:** **Node.js 20.x** (LTS)
- **Defined in:** `.nvmrc` (value: `20`)
- **Usage:** Run `nvm use` or `nvm install` in the project root to align your Node version.

Other LTS versions (e.g. 22.x) may work; Node 23+ can require building native modules (e.g. Couchbase) from source.

## Tech Stack

| Layer        | Technology        | Purpose / Notes                                      |
|-------------|-------------------|--------------------------------------------------------|
| Runtime     | Node.js 20.x      | Server runtime                                        |
| Language    | TypeScript 5.x    | Typed JS, strict mode, compiled to `dist/`            |
| Framework   | Express 4.x       | HTTP server, routing, middleware                      |
| Database    | Couchbase 3.x     | Document store; lazy-loaded, optional in-memory mode  |
| Auth        | JWT (jsonwebtoken)| Token-based auth; secret via `JWT_SECRET`             |
| Validation  | Joi 17.x          | Request body/query validation                         |
| Password    | bcryptjs 2.x      | Hashing (no native bindings)                          |
| IDs         | uuid 10.x         | Unique identifiers                                    |
| Env         | dotenv 16.x       | Loads `.env` for `PORT`, `JWT_SECRET`, Couchbase      |
| Dev         | ts-node-dev       | Watch mode for `npm run dev`                          |
| Lint/Format | ESLint, Prettier  | Code style and formatting                             |

## Scripts

| Command         | Description                                  |
|----------------|----------------------------------------------|
| `npm run dev`  | Start app with ts-node-dev (watch)           |
| `npm run build`| Compile TypeScript to `dist/`                |
| `npm start`    | Run `node dist/app.js`                      |
| `npm run lint` | ESLint + `tsc --noEmit`                      |
| `npm run format`| Prettier + ESLint --fix                     |

## API Base

All HTTP routes are under **`/api/v1`** (e.g. `POST /api/v1/login`, `GET /api/v1/userinfo`).

## Environment Variables

| Variable             | Required | Description                    |
|----------------------|----------|--------------------------------|
| `PORT`               | No       | Server port (default: 3000)    |
| `JWT_SECRET`         | Yes      | Secret for signing JWTs        |
| `COUCHBASE_USERNAME` | No*      | Couchbase username             |
| `COUCHBASE_PASSWORD` | No*      | Couchbase password             |

\* If Couchbase is not configured or native bindings fail, the app uses an in-memory store so it can still start.

## Repository Structure (High Level)

- **Entry:** `src/app.ts`
- **Config:** `src/config/` (constants, Couchbase connection)
- **Constants:** `src/constants/` (message keys, HTTP status)
- **Controllers:** `src/controllers/` (async request handlers)
- **Helpers:** `src/helpers/` (game logic, user build, mappers)
- **Middlewares:** `src/middlewares/` (auth, validation, response helpers)
- **Routes:** `src/routes/` (mount at `/api/v1`)
- **Validators:** `src/validators/` (Joi schemas)
- **Types:** `src/types/` (shared TypeScript types)
- **Seeder:** `src/seeder/` (seed data and script)

For Couchbase setup and native build issues, see **COUCHBASE_SETUP.md**.

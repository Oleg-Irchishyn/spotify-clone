# Spotify Clone — Server

This is the **backend (server)** part of the Spotify Clone project. The frontend (Next.js client) lives in the sibling [`client/`](../client) folder.

## About the project

Spotify Clone is a REST API for a music-streaming style app, built with [NestJS](https://nestjs.com) and MongoDB. It supports:

- **Auth** — registration/login/logout with a JWT stored in an httpOnly cookie, plus `GET /auth/me` to restore the session on page load.
- **Users** — list all users; only activated (logged-in) users may create/edit/delete tracks and albums.
- **Tracks** — upload (audio + picture), update, delete, list with pagination, full-text search, listen counter, comments.
- **Albums** — upload (picture), update, delete, list with pagination and search.
- **Comments** — attached to tracks, open to everyone (no login required).
- File storage for uploaded audio/picture files, served statically.
- Input validation (`class-validator`) with a consistent error response shape.
- Interactive API docs via Swagger.

## Tech stack

- [NestJS](https://nestjs.com) 11 (TypeScript)
- [MongoDB](https://www.mongodb.com) via [Mongoose](https://mongoosejs.com)
- [@nestjs/jwt](https://docs.nestjs.com/security/authentication) + `bcryptjs` for auth, `cookie-parser` for the httpOnly session cookie
- [Swagger](https://docs.nestjs.com/openapi/introduction) (`@nestjs/swagger`)
- [class-validator](https://github.com/typestack/class-validator) / [class-transformer](https://github.com/typestack/class-transformer)
- [Jest](https://jestjs.io) for unit/e2e tests

## Prerequisites

- [Node.js](https://nodejs.org) (v20+ recommended)
- A MongoDB instance (local, Docker, or a hosted cluster like MongoDB Atlas) and its connection string

## Local setup

1. **Clone the repository and enter the server folder:**

   ```bash
   git clone git@github.com:Oleg-Irchishyn/spotify-clone.git
   cd spotify-clone/server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables.** Copy the example file to `.development.env` and fill in real values:

   ```bash
   cp .env.example .development.env
   ```

   (For a production run, the same variables are read from `.production.env` instead — copy [`.env.example`](.env.example) there too, with production values.)

4. **Start the server in watch mode:**

   ```bash
   npm run start:dev
   ```

   The API will be available at `http://localhost:5000`, and interactive Swagger docs at `http://localhost:5000/docs`.

## Other useful commands

```bash
# production build
npm run build
npm run start:prod

# unit tests
npm run test

# unit tests with coverage
npm run test:cov

# e2e tests
npm run test:e2e

# lint
npm run lint
```

## Deployment

The server is deployed as a [Render](https://render.com) Web Service. Root Directory is `server` (this is a monorepo).

- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm run start:prod`

`start:prod` already sets `NODE_ENV=production` (via `cross-env`) for the running process, so there's no need to set `NODE_ENV` as a Render environment variable — in fact, **don't** set it there: Render passes dashboard env vars into the build step too, and `NODE_ENV=production` during `npm ci` makes npm skip `devDependencies`, which breaks the build (`nest: not found`, since `@nestjs/cli` is a dev dependency).

### Environment variables (Render dashboard → Environment)

Set the same keys as in `.production.env`, with production values:

| Key | Notes |
|---|---|
| `MONGO_URI` | production MongoDB connection string |
| `PRIVATE_KEY` | JWT signing secret |
| `CLIENT_URL` | the client's origin, e.g. `https://oleg-irchishyn.github.io` — **origin only**, no path, no trailing slash (must match the browser's `Origin` header exactly for CORS to allow it) |

`PORT` should **not** be set manually — Render injects its own and `main.ts` already reads `process.env.PORT`. `SERVER_URL` isn't read anywhere in the server code, so it can be skipped too.

### MongoDB Atlas

Add `0.0.0.0/0` to Network Access → IP Access List. Render's standard plans don't have static outbound IPs, so the connection will otherwise time out.

### ⚠️ Uploaded files don't persist on the free plan

`FileService` writes uploaded audio/pictures to `server/static` on local disk, served via `ServeStaticModule`. Render's free instance type has **no persistent disk** — every spin-down/restart or redeploy boots a fresh filesystem, so uploaded tracks and pictures get wiped. This is fine for demoing, but real persistence requires either a paid Render Disk or moving uploads to external object storage (e.g. Cloudflare R2, S3-compatible).

### Free plan cold starts

Free instances spin down after ~15 minutes of inactivity; the next request can take 30–50s while it wakes back up.

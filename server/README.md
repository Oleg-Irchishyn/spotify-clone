# Spotify Clone — Server

Backend REST API for **Spotify Clone**, built with [NestJS](https://nestjs.com) and MongoDB (via Mongoose). Frontend lives in the sibling [`client/`](../client) folder. Auth is JWT in an httpOnly cookie (`GET /auth/me` restores the session); tracks/albums support upload, edit, delete, search, pagination; file storage is local disk in development and [Cloudflare R2](https://developers.cloudflare.com/r2/) in production. Interactive API docs via Swagger at `/docs`. Tested with Jest.

## Local setup

```bash
git clone git@github.com:Oleg-Irchishyn/spotify-clone.git
cd spotify-clone/server
npm install
cp .env.example .development.env   # fill in MONGO_URI, PRIVATE_KEY, etc.
npm run start:dev                  # http://localhost:5000, docs at /docs
```

Requires Node.js 20+, a MongoDB instance (local, Docker, or a hosted cluster like MongoDB Atlas), and a Redis instance (see below).

## Redis

Redis backs two independent things here:

- **BullMQ** — `POST /tracks/listen/:id` queues a job instead of writing to Mongo synchronously; a worker in the same process applies the increment atomically (`$inc`), so the HTTP response is instant and concurrent listens can't race each other.
- **cache-manager** — `GET /tracks`, `GET /tracks/search`, and `GET /album` are cached for 30s (`@nestjs/cache-manager` + `@keyv/redis`, namespaced `spotify-clone` so it's safe on a shared Redis instance). Any track/album create/update/delete clears the cache immediately, so mutations are always reflected right away.

Both are wired from a single `REDIS_URL` env var (default `redis://localhost:6379` if unset). For local dev:

```bash
docker compose up -d   # starts redis:8-alpine on localhost:6379
```

In production, point `REDIS_URL` at your own Redis instance (Render/Upstash/etc.) — this isn't provisioned for you.

## Commands

```bash
npm run build && npm run start:prod     # production build
npm run test / test:cov / test:e2e      # tests
npm run lint
```

## Deployment

Deployed as a [Render](https://render.com) Web Service. **Root Directory:** `server` (monorepo). **Build:** `npm ci && npm run build`. **Start:** `npm run start:prod`.

Don't set `NODE_ENV` on Render — `start:prod` already sets it, and setting it as a dashboard variable makes `npm ci` skip `devDependencies` during the build, breaking it (`nest: not found`, since `@nestjs/cli` is a dev dependency).

**Environment variables** (Render dashboard → Environment), same keys as `.production.env`:

| Key | Notes |
|---|---|
| `MONGO_URI`, `PRIVATE_KEY` | Mongo connection string, JWT signing secret |
| `CLIENT_URL` | client's **origin only**, e.g. `https://oleg-irchishyn.github.io` — no path/trailing slash, must match the browser's `Origin` header exactly for CORS |
| `REDIS_URL` | your own Redis instance (Render/Upstash/etc.) — backs the track-listens queue and the response cache, see [Redis](#redis) |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL` | Cloudflare R2 (see below) |

Skip `PORT` (Render injects its own) and `SERVER_URL` (unused in the server code).

**MongoDB Atlas:** add `0.0.0.0/0` to Network Access — Render has no static outbound IP.

**File storage (Cloudflare R2):** Render's free plan has no persistent disk, so production uploads go to R2 via the S3-compatible API instead of `server/static` (dev is unaffected). To set up:

1. [Cloudflare dashboard](https://dash.cloudflare.com) → **Storage & databases → R2 Object Storage** → create a bucket.
2. Bucket → **Settings → Public Development URL → Enable** — copy the `pub-xxxx.r2.dev` URL as `R2_PUBLIC_URL`.
3. R2 → **Manage API Tokens → Create API Token** — permissions **Object Read & Write**, scoped to that bucket — save the Access Key ID / Secret Access Key.
4. Account ID = the first path segment of the Cloudflare dashboard URL.
5. Set all five `R2_*` variables on Render.

**Free plan:** instances spin down after ~15 min idle; the next request can take 30–50s to wake back up.

# Microservices sandbox

A learning exercise: the same auth/tracks/albums domain from `../server` (the
real, deployed monolith — **untouched by this folder**), split into two
independent NestJS microservices behind an API Gateway. Nothing here is wired
to the actual client or the actual production database; it's meant to be run
locally and poked at with curl to see the concepts work.

```
                    HTTP (curl / Postman / browser)
                              │
                              ▼
                      ┌───────────────┐
                      │  api-gateway  │  :4000 — the ONLY public HTTP surface
                      │               │  verifies JWTs itself, CORS, cookies
                      └───────┬───────┘
                    TCP       │       TCP
              ┌───────────────┴───────────────┐
              ▼                                ▼
      ┌───────────────┐               ┌────────────────┐
      │ auth-service  │  TCP :4001    │ catalog-service │  TCP :4012
      │ pure TCP      │  no HTTP —    │ hybrid: HTTP    │  HTTP :4002 (static
      │ microservice  │  unreachable  │ :4002 + TCP     │  files only) + TCP
      │               │  via curl     │ microservice    │  for @MessagePattern
      └───────┬───────┘               └────────┬────────┘
              ▼                                 ▼
      its own MongoDB                   its own MongoDB
      (users only)                (tracks / albums / comments)
```

## Concepts this demonstrates

- **Service data ownership.** `auth-service` and `catalog-service` each get
  their own MongoDB database — no shared collections, no cross-service
  `.populate()`. That's *why* a Gateway (or a composition endpoint) exists:
  there's no database join to fall back on once two collections are owned by
  two different services. See `GET /stats` below for the concrete case.
- **A Gateway as the only public surface.** `auth-service`/`catalog-service`
  are bootstrapped with `NestFactory.createMicroservice()` — they have no
  HTTP listener for their business logic and can't be hit with curl at all,
  only via a `ClientProxy` (`@nestjs/microservices`) from the Gateway. Try
  `curl http://localhost:4001` — connection refused/reset, there's no HTTP
  server there. `catalog-service` is the one exception: it's a *hybrid* app
  that keeps a small HTTP listener just to serve uploaded picture/audio
  files as static assets (see "Where files live" below) — its actual
  tracks/albums API is still TCP-only.
- **Stateless JWT trust at the edge.** `api-gateway`'s `JwtGuard` verifies
  the token's signature itself, using a `PRIVATE_KEY` it shares with
  `auth-service` — no network round-trip to Auth on every request. Only
  `auth-service` ever touches the users database to check credentials; every
  other request just needs to check a signature. `catalog-service` doesn't
  know the secret at all and doesn't need to — it trusts whatever the
  Gateway forwards.
- **Composition.** `GET /stats` calls `auth-service` for a user count and
  `catalog-service` for track/album counts, and merges all three into one
  response. The client gets one round trip; the Gateway made three.

## Deliberate simplifications vs. the real monolith (`../server`)

- No Cloudflare R2 — `catalog-service` only writes to local disk.
- No DTO validation inside `auth-service`/`catalog-service`: validation runs
  once, at the Gateway's HTTP boundary (`class-validator` DTOs +
  `ValidationPipe`, copied from `server/src/pipes`), and everything past
  that point is treated as already-trusted internal traffic.
- Files cross the Gateway → `catalog-service` boundary base64-encoded inside
  the TCP message (the default TCP transport is JSON, it can't carry a raw
  `Buffer`). Fine for demo-sized mp3/jpg files; a real system would give
  uploads their own dedicated path (e.g. a media service the client uploads
  to directly, or presigned URLs) instead of routing bytes through RPC.
  This is the concrete cost of decoupling a service that used to just have
  the multipart stream sitting in-process.
- The monolith's `JwtAuthGuard` flips a user's `isActivated` off when it
  sees an expired token (a DB write on the read path). `JwtGuard` here just
  rejects the request — it intentionally doesn't reach into `auth-service`'s
  database to replicate that side effect. This is a real tradeoff of
  decoupling: cross-service side effects either need an explicit RPC call
  (added latency/coupling) or get dropped/deferred to an event later.
- No automated tests for these three projects (unlike `server/`'s Jest
  suite) — this folder is for seeing the architecture run, not for
  production parity.

## Where files live

`catalog-service` writes uploads to its own `static/` folder and returns an
**absolute** URL built from its own `PUBLIC_URL` env var (e.g.
`http://localhost:4002/image/<uuid>.jpg`) — not a path the Gateway proxies.
This mirrors how the monolith's client already treats R2 URLs (already-
absolute URLs pass straight through, see `client/app/utils/resolveAssetUrl.ts`)
and sidesteps needing to stream file bytes back through the Gateway on every
read.

## Running it

Each folder is a fully independent Nest project — its own `package.json`,
its own `node_modules`, no shared dependency with `../server` or `../client`.

```bash
# once, in each of the three folders:
cd auth-service && npm install && cp .env.example .env   # then fill in MONGO_URI + PRIVATE_KEY
cd ../catalog-service && npm install && cp .env.example .env   # then fill in MONGO_URI
cd ../api-gateway && npm install && cp .env.example .env   # PRIVATE_KEY must match auth-service's
```

`MONGO_URI` in `auth-service` and `catalog-service` must point at two
**different** databases — reusing the same Atlas cluster with two new db
names (e.g. `spotify_auth_ms`, `spotify_catalog_ms`) is the easiest way to
get that for free.

Start in order (each in its own terminal):

```bash
cd auth-service && npm run start:dev       # TCP :4001
cd catalog-service && npm run start:dev    # HTTP :4002, TCP :4012
cd api-gateway && npm run start:dev        # HTTP :4000 — hit this one
```

## API docs

`api-gateway` has Swagger at **http://localhost:4000/docs** — same port as
the API itself, just another route (`SwaggerModule.setup('/docs', ...)`,
same idea as `server/`'s own `/docs`). It's only on the Gateway: that's the
one piece with an actual public HTTP surface to describe.
`auth-service`/`catalog-service` have no Swagger, and couldn't meaningfully —
their real API is TCP `@MessagePattern`s, which Swagger (an HTTP/OpenAPI
tool) has no vocabulary for.

## Trying it out

```bash
# register (cookie gets set)
curl -i -c cookies.txt -X POST http://localhost:4000/auth/registration \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com","name":"Demo","password":"12345"}'

# contributors list (goes through auth-service)
curl http://localhost:4000/users

# create an album (multipart, needs the cookie from registration/login)
curl -b cookies.txt -X POST http://localhost:4000/album \
  -F name="Test Album" -F author="Test Author" \
  -F picture=@../../server/static/image/<some-file>.jpg

# list albums, list tracks, GET /stats (composition example), etc.
curl http://localhost:4000/album
curl http://localhost:4000/stats
```

`server/static/image/*` and `server/static/audio/*` already have real sample
files checked in locally you can reuse for uploads.

## Natural next steps (not built here)

- `docker-compose.yml` to start all three + a local Mongo with one command.
- A third `media-service` for uploads, once the base64-over-TCP tradeoff
  above starts to bother you — the real next lesson is usually "how do I
  actually stream large files between services."
- Swap the "flip isActivated off on token expiry" side effect for a proper
  event (e.g. RabbitMQ/Kafka) `auth-service` publishes and nobody has to call
  synchronously — a first taste of eventual consistency.
- A shared `libs/common` workspace package instead of copy-pasting
  `ValidationPipe`/`ValidationException` — deliberately skipped here to keep
  each service a fully standalone project while learning the core pattern.

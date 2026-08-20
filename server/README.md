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

3. **Configure environment variables.** Create a `.development.env` file in `server/` with:

   ```env
   PORT=5000
   SERVER_URL=http://localhost:5000
   CLIENT_URL=http://localhost:3000
   MONGO_URI=your-mongodb-connection-string
   PRIVATE_KEY=your-jwt-signing-secret
   ```

   (For a production run, the same variables are read from `.production.env` instead.)

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

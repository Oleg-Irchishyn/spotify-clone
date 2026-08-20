# Spotify Clone — Client

This is the **frontend (client)** part of the Spotify Clone project. The backend (NestJS API) lives in the sibling [`server/`](../server) folder — the client needs it running to work.

## About the project

Spotify Clone is a music-streaming style web app built with [Next.js](https://nextjs.org) and [Material UI](https://mui.com). It supports:

- **Auth** — register/login via a modal, session persisted through an httpOnly cookie (nothing to manage on the client besides sending it), logout with a confirmation dialog.
- **Contributors** — a page listing all activated (logged-in) users, visible once you're logged in.
- **Tracks** — browse, search, paginate, play/pause/loop, upload, edit, delete, comment, listen counter.
- **Albums** — browse, search, paginate, upload, edit, delete; filters the tracklist by album.
- Upload/edit/delete controls and the Contributors tab only show once you're logged in — logged-out visitors can browse and comment.
- Light/dark theme toggle.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router, TypeScript)
- [Material UI](https://mui.com) for components and theming
- [Redux](https://redux.js.org) + [redux-thunk](https://github.com/reduxjs/redux-thunk) for state management
- [Axios](https://axios-http.com) for API calls
- [Sass](https://sass-lang.com) (CSS Modules) for component styles
- [Jest](https://jestjs.io) + [React Testing Library](https://testing-library.com/react) for unit tests

## Prerequisites

- [Node.js](https://nodejs.org) (v20+ recommended)
- The [server](../server) running locally (or reachable at whatever URL you set below)

## Local setup

1. **Clone the repository and enter the client folder:**

   ```bash
   git clone git@github.com:Oleg-Irchishyn/spotify-clone.git
   cd spotify-clone/client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables.** Create a `.env` file in `client/` with:

   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   ```

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Other useful commands

```bash
# production build
npm run build
npm run start

# lint
npm run lint

# lint and auto-fix
npm run format

# unit tests
npm run test

# unit tests in watch mode
npm run test:watch

# unit tests with coverage
npm run test:cov
```

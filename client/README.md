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
- [Playwright](https://playwright.dev) for e2e tests

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

3. **Configure environment variables.** Copy the example file and adjust if needed:

   ```bash
   cp .env.example .env
   ```

   ([`.env.example`](.env.example) currently just points at the server running locally: `NEXT_PUBLIC_SERVER_URL=http://localhost:5000`.)

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

## E2E tests (Playwright)

```bash
# run all e2e tests headless (auto-starts `npm run dev` if nothing is
# already listening on :3000)
npm run test:e2e

# smoke subset only (tests tagged @smoke) — the fast pass for CI
npm run test:e2e:smoke

# interactive UI mode — step through tests, inspect the DOM/network
npm run test:e2e:ui

# headed (visible browser window)
npm run test:e2e:headed
```

Specs live in [`e2e/`](e2e). `playwright.config.ts` starts the Next dev server for you (`reuseExistingServer` when not in CI, so it'll reuse a server you already have running), so no separate setup is needed to run them. The current specs (homepage, navigation) only exercise the client shell and don't require the [server](../server) to be running — pages fetch data client-side and degrade to an empty/error state without crashing. Specs that need real data (auth, uploading a track, etc.) will need the server + MongoDB running too.

Only Chromium is installed locally (`npx playwright install chromium`); run `npx playwright install` for the full browser matrix if you add cross-browser projects.

## Deployment

The client is deployed as a static export to [GitHub Pages](https://pages.github.com), live at **https://oleg-irchishyn.github.io/spotify-clone/**. Deploys run automatically via [`.github/workflows/deploy-client.yml`](../.github/workflows/deploy-client.yml) on every push to `main` that touches `client/**`, or manually via **Actions → Deploy client to GitHub Pages → Run workflow**.

How it works:

- `next.config.ts` enables `output: 'export'` and `basePath: '/spotify-clone'` only when the `GITHUB_PAGES=true` env var is set (set by the workflow) — local dev and `npm run build` outside CI are unaffected.
- Because GitHub Pages is fully static, `/tracks/[id]` (server-rendered, per-ID `generateMetadata`) isn't compatible with static export — track IDs are created dynamically by users and can't be pre-rendered at build time. The track details page instead lives at `/tracks/details?id=...` and reads the ID client-side via `useSearchParams`.
- The workflow builds with `NEXT_PUBLIC_SERVER_URL` set from the `NEXT_PUBLIC_SERVER_URL` **repository variable** (Settings → Secrets and variables → Actions → Variables) — point it at the deployed server's URL (see [server deployment](../server/README.md#deployment)). Since this is a build-time env var, changing it requires re-running the workflow, not just a redeploy.

### One-time setup for a fork/new repo

1. Repo **Settings → Pages → Build and deployment → Source** → select **GitHub Actions**.
2. Repo **Settings → Secrets and variables → Actions → Variables** → add `NEXT_PUBLIC_SERVER_URL` pointing at the deployed server.
3. Push to `main` (or run the workflow manually).

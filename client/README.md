# Spotify Clone — Client

Frontend for **Spotify Clone**, a music-streaming style web app built with [Next.js](https://nextjs.org) and [Material UI](https://mui.com). Talks to the [server](../server) API for auth, tracks, albums, and comments — auth uses an httpOnly session cookie, upload/edit/delete and the Contributors page only show once logged in. Unit tests: Jest + React Testing Library. E2E: Playwright.

## Local setup

```bash
git clone git@github.com:Oleg-Irchishyn/spotify-clone.git
cd spotify-clone/client
npm install
cp .env.example .env   # defaults to NEXT_PUBLIC_SERVER_URL=http://localhost:5000
npm run dev            # http://localhost:3000
```

Requires Node.js 20+ and the [server](../server) running locally for real data (pages still render without it, just without content).

## Commands

```bash
npm run build && npm run start          # production build
npm run lint / npm run format           # lint / lint + fix
npm run test / test:watch / test:cov    # unit tests

npm run test:e2e                        # e2e tests (specs in e2e/, auto-starts the dev server)
npm run test:e2e:smoke                  # @smoke-tagged subset only
npm run test:e2e:ui / test:e2e:headed   # interactive / visible-browser modes
```

## Deployment

Static export to [GitHub Pages](https://pages.github.com), live at **https://oleg-irchishyn.github.io/spotify-clone/**. Deploys automatically via [`.github/workflows/deploy-client.yml`](../.github/workflows/deploy-client.yml) on push to `main` touching `client/**`, or manually via **Actions → Deploy client to GitHub Pages → Run workflow**.

Notes:
- `next.config.ts` only sets `output: 'export'` + `basePath: '/spotify-clone'` when the workflow sets `GITHUB_PAGES=true` — local dev/build are unaffected.
- GitHub Pages is fully static, so `/tracks/[id]` (per-track `generateMetadata`) can't work — dynamically created track IDs can't be pre-rendered at build time. Track details live at `/tracks/details?id=...` instead, reading the id client-side via `useSearchParams`.
- The build reads `NEXT_PUBLIC_SERVER_URL` from a **repository variable** (Settings → Secrets and variables → Actions → Variables), pointing at the deployed [server](../server/README.md#deployment). It's baked in at build time, so changing it needs a re-run of the workflow, not just a redeploy.

**One-time setup for a fork/new repo:** Settings → Pages → Source → **GitHub Actions**; add the `NEXT_PUBLIC_SERVER_URL` repo variable; push to `main`.

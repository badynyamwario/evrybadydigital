# AGENTS.md

Guidance for AI agents working in this repository.

## Repository layout

- Monorepo root: `studiohub/` (npm workspaces for `apps/*` and `packages/*`)
- Default app: **Dashboard** (`apps/dashboard`) — internal StudioHub console
- Public marketing site: **Evrybady Digital** (`apps/evrybadydigital`)
- **Core** (`apps/core`) — dev launchpad; requires Node ≥24 and missing `apps/shared/` modules (dev/build may fail)
- **Savannah** (`apps/savannah`) — static HTML site (no Next.js dev script)

## Standard commands

Run from `studiohub/`:

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev (dashboard) | `npm run dev` → http://localhost:3001 |
| Dev (evrybady) | `npm run dev:evrybady` → http://localhost:3000 |
| Lint | `npm run lint` |
| Build dashboard | `npm run build:dashboard` |
| Build evrybady | `npm run build:evrybady` |
| Seed admin users | `npm run seed:admins` (requires Supabase `.env.local`) |

## Supabase (full auth/CMS flows)

Hosted Supabase is required for dashboard login, project CRUD, and evrybady admin/CMS. Without it:

- Dashboard serves public routes (`/`, `/login`) with graceful degradation in middleware
- Evrybady public pages use hardcoded fallback section content

Create `studiohub/.env.local` and/or `studiohub/apps/dashboard/.env.local` with:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server routes, seeding)

Apply SQL migrations from `studiohub/supabase_migrations/` in the Supabase dashboard (in order). If project CRUD fails with `projects_org_id_fkey`, run `20260609_organizations.sql` to create `organizations` / `organization_members` and backfill `projects.org_id`.

## Cursor Cloud specific instructions

- **Working directory**: `cd studiohub` before npm commands; the git root is `/workspace`.
- **Node version**: Dashboard and evrybady run on Node 22. `apps/core` declares `engines.node >= 24` and will warn on Node 22; avoid `npm run dev:all` unless core/shared are fixed and Node 24 is available.
- **No Docker/local DB**: Supabase is external SaaS only; there is no `docker-compose` in this repo.
- **Dashboard ESLint**: `apps/dashboard` has no `eslint.config.*` yet — `npm run lint` fails for that workspace until config is added. `apps/evrybadydigital` lint runs but has pre-existing errors.
- **No automated tests**: There are no unit/e2e test scripts in the monorepo; verify changes with `npm run build:*` and manual browser checks.
- **Dev servers**: Use separate terminals/tmux sessions for dashboard (`:3001`) and evrybady (`:3000`) when testing both apps concurrently.
- **Core caveat**: `apps/core` imports `@shared/*` from a missing `apps/shared/` directory — do not treat core dev as part of the default setup until that package exists.

# Savannah - Bar & Grill

Production  at **https://savannah.vercel.app**. Where we serve up delicious food and refreshing drinks in a vibrant atmosphere.

## Stack

- Next.js 16 (App Router, `src/proxy.ts` for Supabase session + route guard)
- Supabase Auth + Postgres
- Deployed on **Vercel** (server mode — not static export)

## Local development

```bash
npm install
# Use repo-root .env.local or apps/kanban/.env.local
npm run dev                        # http://localhost:3001
```

## Quality gates (run before deploy)

```bash
npm run typecheck
npm run predeploy:check            # typecheck + next build
```

## Vercel

Dedicated project for **savannah.vercel.app**. Root `/` uses `vercel.json`.

| Setting | Value |
| --- | --- |
| Root Directory | `/` |
| Framework | Next.js |
| Build Command | *(from `vercel.json`)* `cd ../.. && npm run vercel-build:kanban` |
| Install Command | *(from `vercel.json`)* `cd ../.. && npm install` |
| Output Directory | `.next` |
| Node | 22.x |

**Do not** use `vercel-build:panel` or repo-root `vercel.json` on this project — those are for `panel.espeezy.com` only (`apps/admin`, root `.`).

Required environment variables (see `src/lib/supabase/env.ts`):

- `NEXT_PUBLIC_SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_PROJECT_URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server routes / admin only)

## Auth

Unauthenticated users are redirected to `/login`. Public routes (login, auth callbacks, docs, legal pages) are allowlisted in `src/proxy.ts`.


## E2E tests

```bash
npm run test:e2e:completion
```

Requires live Supabase credentials in `.env.local` (see `src/tests/lib/load-test-env.ts`).

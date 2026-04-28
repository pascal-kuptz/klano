# Klano

> Make musicians be musicians.
>
> KI-Agent für Hobby- und Semi-Pro-Bands. Booking, Koordination, Follow-ups — automatisiert.

## Repo-Layout

```
klano/
├── apps/
│   ├── marketing/          Astro — klano.ai (Landing, Blog, Pricing)
│   └── web/                Next.js — app.klano.ai (App, Auth, Dashboard)
├── packages/
│   ├── ui/                 shadcn/ui-Komponenten (ab v0.4 gefüllt)
│   ├── db/                 Supabase Types & Client (ab v0.2)
│   ├── agent/              AI-Agent Tools & Prompts (ab v0.5)
│   ├── email/              React Email Templates (ab v0.6)
│   ├── i18n/               Geteilte Übersetzungen DE/EN
│   └── config/             Geteilte Brand/Limits/Pricing Konstanten
├── _source/                Vision-Docs (master-plan, day-1, build-plan, design-system, demo)
├── _admin/                 Lebende Doku — überschreibt _source bei Konflikt
├── biome.json              Linter + Formatter (ersetzt ESLint+Prettier)
├── tsconfig.base.json      Geteilte TS-Strict-Settings
├── turbo.json              Turborepo Pipeline
└── pnpm-workspace.yaml     pnpm Workspaces
```

## Voraussetzungen

- **Node ≥ 22** (lokal v24 OK)
- **pnpm 10.x**
- Docker (für lokale Supabase ab v0.2)

## Setup

```bash
pnpm install
```

## Dev

```bash
pnpm dev                              # Beide Apps parallel
pnpm --filter @klano/marketing dev    # Nur Marketing (Astro, http://localhost:4321)
pnpm --filter @klano/web dev          # Nur App (Next.js, http://localhost:3000)
```

## Build / Lint / Typecheck

```bash
pnpm build         # Turbo, alle Workspaces
pnpm lint          # Biome check
pnpm typecheck     # tsc --noEmit pro Workspace
pnpm check         # Biome check --write (auto-fix)
pnpm format        # Biome format --write
```

## Wo finde ich was?

| Frage | Antwort |
|-------|---------|
| Was bauen wir wann? | [_source/build-plan-v0.md](_source/build-plan-v0.md) |
| Wie sieht es aus? | [_source/design-system.md](_source/design-system.md) |
| Welche Entscheidung gilt? | [_admin/decisions.md](_admin/decisions.md) (überschreibt _source) |
| Was ist offen? | [_admin/open-questions.md](_admin/open-questions.md) |
| Was ist als nächstes dran? | [_admin/next-steps.md](_admin/next-steps.md) |
| Was haben wir schon gemacht? | [_admin/progress-log.md](_admin/progress-log.md) |
| Begriff unklar? | [_admin/glossary.md](_admin/glossary.md) |

## Stack

Astro 5 · Next.js 15 · React 19 · Tailwind v4 · TypeScript Strict · Biome · Turborepo · pnpm.
Backend: Supabase (Postgres, Auth, Storage, Realtime) · Resend · Stripe · Inngest · Vercel AI SDK + Claude.

## Git-Strategie

Trunk-based, kurze Feature-Branches, PRs auf `main` mit grüner CI.
Niemals: `--no-verify`, force-push auf `main`, Secrets in Repo.

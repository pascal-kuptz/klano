# Progress Log

Chronologisches Logbuch. Neueste Einträge oben.

---

## 2026-04-28 — Tag 1: v0 Foundation Scaffold

**Wer:** Pascal + Claude
**Dauer:** ~1 Session

**Was gemacht:**
- Root-Setup: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `biome.json`, `tsconfig.base.json`, `.gitignore`
- `apps/marketing` (Astro 5 + Tailwind v4 + Fraunces/Geist Fonts) mit:
  - i18n-Routing-Config (de default, en optional)
  - **SEO/AI-optimiert**: `SeoHead.astro` Component, `seo.ts` Lib mit Schema.org-Builders (Organization, WebSite, SoftwareApplication, FAQPage)
  - `robots.txt` + `llms.txt` + `.well-known/ai.txt` mit AI-Crawler-Allowlist (siehe D11)
  - Hero-Page mit Klano-Tagline und Mixed-Type-Pattern (Fraunces WONK 1)
- `apps/web` (Next.js 15 + React 19 + Tailwind v4) mit:
  - App Router, typedRoutes, Turbopack-Dev
  - `noindex,nofollow` global (Auth-Bereich)
  - Hero-Stub mit Brand-Tokens
- 6 Workspace-Packages als Stubs: `@klano/{ui,db,agent,email,i18n,config}`
- `@klano/config` enthält bereits kanonische Brand/Limits/Pricing-Konstanten
- `pnpm install` grün (531 packages)
- `pnpm --filter @klano/marketing build` ✅
- `pnpm --filter @klano/web build` ✅
- README mit Repo-Layout, Setup, Dev-Commands, Doku-Index
- `_admin/decisions.md` D11 (SEO/AI-Crawler) ergänzt

**Was offen:**
- Git init + initial commit (folgt gleich)
- Vercel-Deploys (extern, braucht Account)
- Domain `klano.ai` registrieren (Founder)
- v0.1: Astro-Komponenten ausbauen (Hero, Pain, Solution, Pricing, Waitlist), Plausible, Resend, Edge-Function

**Bekannte Punkte:**
- Tailwind v4 verteilt seine Theme-Tokens via `@theme {}` direkt in beiden Apps. Konsolidierung nach `packages/ui/styles.css` in v0.4.
- shadcn/ui noch nicht initialisiert — kommt mit erstem App-Screen-Bedarf in v0.2/v0.3.

---

## 2026-04-28 — Setup `_admin/` & _source-Bereinigung

**Wer:** Pascal + Claude
**Dauer:** ~1 Session

**Was gemacht:**
- Vier `_source/`-Docs gelesen (master-plan, day-1-plan, build-plan-v0, design-system, klano-demo.html überflogen)
- `_admin/` Ordner-Struktur angelegt mit:
  - `README.md` (Index/Workflow)
  - `decisions.md` (D1–D10)
  - `clarifications.md` (C1–C12)
  - `open-questions.md` (Q-F1..4, Q-L1..3, Q-E1..3, Q-M1..2)
  - `progress-log.md` (dieses File)
  - `next-steps.md`
  - `glossary.md`
- Direkt-Fixes in `_source/`:
  - `master-plan.md`: 4× `banddings.com` → korrekte `klano.ai`-Domains (Sektionen 5, 13)
  - `master-plan.md`: §13 "Resend Inbound (oder Cloudflare)" → "Resend Inbound" (D6)
  - `master-plan.md`: §13 User-OAuth-Versprechen entfernt/verschoben
  - `build-plan-v0.md`: §8 "12% Rabatt" → "≈17% Rabatt"

**Was offen:**
- 12 Open Questions an Founder/Legal/Eng-Lead — siehe `open-questions.md`
- Noch nicht entschieden: Tag-1-Repo-Scaffolding starten (Monorepo, beide Apps lokal). Wartet auf Greenlight.

**Nächster Schritt:** siehe `next-steps.md`.

---

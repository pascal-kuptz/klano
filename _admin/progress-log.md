# Progress Log

Chronologisches Logbuch. Neueste Einträge oben.

---

## 2026-04-28 — v0.3 Onboarding-Wizard (public, 7 Steps, sign-up am Schluss)

**Architektur-Move:** Onboarding ist **public** (kein Login nötig bis Schritt 7). State client-side via Reducer + localStorage. Magic-Link-Sign-up am Schluss → `/auth/callback?next=/onboarding/finalize` → Server-Action persistiert alles → `/dashboard`.

**Was gemacht:**
- **`lib/onboarding/state.ts`** — typed Reducer (`next`/`prev`/`goto`/`patch-band`/`set-invites`/`select-venue`/`hydrate`/`reset`), `canAdvance(step)` Gate-Logik
- **`lib/onboarding/venues-static.ts`** — 12 statische DACH-Venues + `matchVenues(input, limit)` Score-Algorithmus (Genre×3 + Region×2 + Capacity×1)
- **`lib/onboarding/finalize.ts`** — Server-Action `finalizeOnboarding(state)`: erstellt Band (Trigger erstellt automatisch leader-Membership), Invitations mit 14d-Token, optionales Booking aus statischem Venue. Untyped Cast wegen Workspace-Type-Resolution; clean nach `gen-types`.
- **`components/onboarding/`**
  - `WizardProvider.tsx` — Context + Reducer + auto-hydrate/persist localStorage
  - `Wizard.tsx` — Shell: Header (Logo + StepProgress + "Schon ein Konto?"), Step-Body, Sticky-Footer mit Zurück/Weiter/Skip
  - `StepProgress.tsx` — Pills `01..07` mit aktiv/past/future States
  - `Step1Welcome.tsx` — Bold Display-Headline + Continue
  - `Step2BandBasics.tsx` — Bandname (mit Live-Echo), Genre-Multi (max 3), Bandgröße-Stepper 3–8
  - `Step3Geo.tsx` — Country-Picker (CH/DE/AT mit Flaggen) + 1–5 Cities Chip-Multi (vorbereitet für MapLibre v0.4)
  - `Step4Ambition.tsx` — 3 Cards Hobby/Semi-Pro/Pro mit Auto-Advance bei Klick
  - `Step5Invites.tsx` — 1–7 Email-Rows mit Instrument, Skip-prominent
  - `Step6Venues.tsx` — 1.4s Loading-Shimmer + 3 Match-Cards (mit Match%, Cap, Genres) + Auswahl
  - `Step7SignUp.tsx` — Zusammenfassung + Email-Input + Magic-Link signInWithOtp(emailRedirectTo: `/auth/callback?next=/onboarding/finalize`)
  - `FinalizeClient.tsx` — Loading → Reads localStorage → calls `finalizeOnboarding` → success: cleart Storage + redirect zu `/dashboard` · error: zurück zu Onboarding
- **`app/onboarding/page.tsx`** + **`app/onboarding/finalize/page.tsx`** — beide noindex
- **`middleware.ts`** — `/onboarding` zu `PUBLIC_PATHS` hinzugefügt
- **Marketing CTAs** (Hero + Nav) zeigen jetzt auf `https://app.klano.ai/onboarding` statt `#waitlist`

**Build:** Web 11 Routes (Onboarding 10.3kB · Finalize 2kB) + Middleware grün. Marketing 4 Pages grün.

**Bekannte Punkte (für später):**
- Idempotente Re-Run-Schutz in `finalize.ts` deaktiviert — kommt zurück mit echten Types post-`gen-types`
- Step 3 Geografie nutzt Chip-Liste statt MapLibre — Map-Implementation Q-E2 deferred bis v0.4
- Logo-Upload (`band.logoDataUrl`) ist im State definiert aber UI fehlt — kommt mit Storage-Wiring v0.4
- Typed Supabase-Client durch Workspace re-export bricht Generic-Inference; Workaround mit `as SupabaseClient` cast in `finalize.ts`. Sauberere Lösung: Database aus `@klano/db` direkt re-exportieren oder Types nach `gen-types` neu generieren

**Push:** Initial-Push auf https://github.com/pascal-kuptz/klano.git erfolgt; v0.3 Commit folgt.

---

## 2026-04-28 — v0.2 Schema + Auth-Pipeline (offline ready)

**Was gemacht:**
- **Supabase migrations** (3 Files in `supabase/migrations/`)
  - `0001_init.sql` — alle Kerntabellen: profiles, bands, band_members, band_invitations, venues, bookings, email_threads, events, availabilities, subscriptions, agent_actions, waitlist
  - `0002_rls.sql` — Helper-Funktionen `is_band_member/leader/owner` (SECURITY DEFINER STABLE) + RLS-Policies für alle Tenant-Tabellen, Default-Deny auf `waitlist`
  - `0003_triggers.sql` — generischer `set_updated_at`, `handle_new_user` (auto-create `profiles` aus `auth.users`), `ensure_owner_is_leader` (D4 invariant), `prevent_owner_member_removal`
- **`supabase/seed.sql`** — 6 DACH-Venues für lokales Dev (Bogen F, Mascotte, Sender, Kammgarn, Lido, Flex)
- **`supabase/config.toml`** — lokaler Dev-Config (Ports, Storage Buckets, Auth Email Templates, kein Email-Confirm in dev)
- **`packages/db`** als richtiger Workspace-Package:
  - `@supabase/ssr` + `@supabase/supabase-js` Deps
  - `src/types.gen.ts` — Placeholder-Types passend zur Schema-Struktur (kann mit `pnpm --filter @klano/db gen-types` ersetzt werden sobald Supabase läuft)
  - `src/browser.ts` → `createBrowserClient<Database>()`
  - `src/server.ts` → `createServerClient(cookies)`
  - Re-exports aller Domain-Enums (BookingStatus, BandRole, etc.)
- **`apps/web` Auth-Pipeline:**
  - `lib/supabase/server.ts` mit `getUser()` Server-Helper
  - `lib/supabase/client.ts` Browser-Re-export
  - `middleware.ts` — Token-Refresh + Route-Guards (signed-out → /sign-in, signed-in → /dashboard für /sign-in)
  - `app/auth/callback/route.ts` — Magic-Link Code-Exchange + redirect zu `next`
  - `app/auth/sign-out/route.ts` — POST → `signOut()` → /sign-in
  - `SignInForm` an echtes `signInWithOtp` gewired (mit `next` query param + `emailRedirectTo` callback URL)
  - `(app)/layout.tsx` lädt `getUser()` server-side, übergibt name/initials/role an Sidebar
  - Dashboard-Greeting bekommt echten Vornamen (oder Email-Prefix)
  - Sidebar-User-Pill hat Sign-out-Button (Form POST nach `/auth/sign-out`)
- **Env Setup:**
  - `apps/web/.env.example` — `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` + Server-only Secrets (Service-Role, Resend, Stripe, Anthropic, OpenAI)
  - `apps/marketing/.env.example` — Public Supabase + Plausible + Resend

**Build:** Web 9 Routes + Middleware (88.3kB), Marketing 4 Pages — beide grün.

**Was du als nächstes brauchst (extern, Q-F2/Q-L1/Q-M1 in `_admin/open-questions.md`):**
1. `supabase init` (CLI installieren falls noch nicht: `pnpm dlx supabase --version`) und dann `pnpm dlx supabase start` lokal — gibt dir `URL` + `anon_key` für `.env.local`
2. `pnpm --filter @klano/db gen-types` — generiert echte Types aus laufendem Schema, ersetzt Placeholder
3. Cloud-Projekt anlegen unter [supabase.com](https://supabase.com) (EU-Frankfurt) sobald wir richtigen Auth-Mail-Versand wollen → SMTP-Override mit Resend in Supabase Auth Settings

---

## 2026-04-28 — Brand Reset v1.0 (Suno-Stil · Instrument Serif + Inter)

**Was passiert ist:**
Nach zwei Iterationen der Editorial/Affinity-Direction (langweilig + zu laut) hat Pascal harten Reset gefordert: „neutrales design wie suno.com" → „sauberes design system. neue tokens brand file anpassen alles. wir müssen clean sein von tag 1".

**Neue Brand-Direction (Decision D12):**
- **Light by default** — Canvas `#FAFAFA`, Surface `#FFFFFF`, Text `#0A0A0A`
- **Type:** Instrument Serif (Display + h1) + Inter Variable (alles andere) + Geist Mono (technische Labels). Fraunces + Geist Sans entfernt.
- **Action:** Schwarz auf Weiß, Pill-Buttons (full radius). Keine Brand-Akzentfarben.
- **Cards:** weiß, 1px-Border `#E4E4E7`, Radius 20px.
- **Keine Editorial-Moves:** kein Marquee, keine Cream-Pause-Sections, kein Wordmark-XL, kein Track-Marker, keine Italic-em-Mixed-Type.

**Was gemacht:**
- `_source/design-system.md` komplett ersetzt (v0.3 → v1.0)
- `_admin/decisions.md` D12 ergänzt
- Alle Marketing-Components gewiped, neu gebaut: Logo, Button, Container, Nav, Hero, Demo (Browser-Mockup mit Bookings-Tabelle), Features (3-spaltige Card-Grid mit Lucide-Icons), Plans (3 Plan-Cards inkl. Beta-Highlight), Waitlist, Footer
- `lib/copy.ts` neu — neutraler, direkter Ton („Der Booking-Agent für Bands.")
- DE/EN-Pages, Datenschutz/Impressum mit neuem Legal-Layout
- `apps/web` globals + page synchronisiert
- Fonts deps: `@fontsource/instrument-serif` + `@fontsource-variable/inter` ersetzen Fraunces + Geist Sans
- Favicon: schwarzer Square mit weißem Instrument-Serif "k"
- Theme-Color → `#FAFAFA`, color-scheme → light

**Build:** beide Apps grün.

---

## 2026-04-28 — v0.1 Marketing-Site (Sektionen + Inhalte) [VERWORFEN]

**Hinweis:** Diese Iteration wurde durch Reset oben ersetzt. Komponenten/Copy von hier existieren nicht mehr.



**Wer:** Pascal + Claude

**Was gemacht:**
- 4 Primitives: `LogoMark` (k-Mark mit Coral-Pulse), `Button` (primary/ghost/dark + arrow-shift), `Pill` (default/acid), `Eyebrow` (acid/coral/dark)
- 7 Sektionen: `Nav` (sticky, blur, scroll-darken), `Hero` (rise-Animation, 5h/3× Stats), `CreamPause` (Editorial-Quote), `Wordmark` (massive "klano" mit Waveform-SVG), `Features` (3 Cards inkl. wide), `Venues` (3 Match-Cards), `Waitlist` (Acid-CTA, optimistic Submit), `Footer` (3 Cols + Mega-Wordmark)
- Vollständige DE/EN-Copy in `lib/copy.ts` (typed, pillar-narrowed)
- Pages: `/` (DE), `/en/`, `/datenschutz`, `/impressum` (Stub-Texte, Status: Entwurf v0)
- `Legal.astro` Layout für rechtliche Seiten
- Reveal-on-Scroll via IntersectionObserver, prefers-reduced-motion respektiert
- Waitlist-Form: lokaler optimistic-success Stub, Plausible-Goal `waitlist_signup` getrackt
- `pnpm --filter @klano/marketing build` ✅ (0 errors, 0 warnings, 4 pages, sitemap-index)

**Was offen:**
- Wartelisten-POST gegen Supabase Edge Function — ab v0.2 wenn Supabase live
- Plausible-Script einbinden — wenn Account/Domain bereit
- AGB-Seite — wartet auf Anwalt
- Pricing-Page (`/pricing`) — eigener Sprint

**Bekannte Punkte:**
- Tailwind v4 `@theme`-Tokens dupliziert in beiden Apps. Konsolidierung ab v0.4 in `packages/ui`.
- shadcn/ui noch nicht initialisiert.

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

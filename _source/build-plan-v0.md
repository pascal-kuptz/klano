# Build Plan — Klano ab v0
## Vom leeren Repo bis zur ersten zahlenden Band

> **Stand:** Tag 1
> **Brand:** Klano · **Domain:** klano.ai · **App:** app.klano.ai
> **Design-Direction:** Bold, dark, künstlerisch. Inspiration: affinity.studio. Mobile-First.
> **Begleit-Docs:** `master-plan.md` (Vision), `day-1-plan.md` (PO-Plan), `design-system.md` (Visual System)
> **Dieses Doc:** Hands-on Build-Plan. Was schreibt der Engineer am Montag morgen?

---

## 0. Wie dieses Dokument zu lesen ist

Aufgebaut in **Versions-Sprüngen**: v0 → v0.1 → v0.2 → ... → v1.0 (Public Launch).
Jede Version hat: **Scope · Tech-Entscheidungen · Konkrete Tasks · Done-Kriterium**.

Reihenfolge ist nicht verhandelbar. Das hier ist die kritische Pfad-Sequenz.

---

## 1. v0 — Foundation (Woche 1, ~5 Tage)

### Scope
Repo, Infrastruktur-Accounts, leere Apps deployable, lokale Dev-Umgebung läuft bei jedem im Team.

### Tech-Entscheidungen (final, nicht mehr verhandelbar)

| Entscheidung | Wahl | Warum |
|--------------|------|-------|
| Repo-Strategie | **Monorepo (Turborepo)** | Geteilte Packages (UI, DB-Types, Agent), atomare Commits |
| Package Manager | **pnpm** | Schneller, weniger Disk, Workspace-Support nativ |
| Node-Version | **22 LTS** | Aktuell, Long-Term-Support |
| TypeScript | **Strict Mode an, überall** | Ohne Diskussion |
| Linter/Formatter | **Biome** statt ESLint+Prettier | Schneller, eine Config |
| Git-Strategie | **Trunk-Based, kurze Feature-Branches** | Tempo. Keine Long-Running-Branches |
| CI | **GitHub Actions** | Standard, Vercel-Integration nativ |
| Hosting | **Vercel** für beide Apps | Edge, Preview-Deployments pro PR |
| Region | **Vercel Frankfurt** + **Supabase EU-Frankfurt** | DSGVO/DSG-Argumentation, Latenz DACH |

### Repo-Struktur

```
klano/
├── apps/
│   ├── web/                    # Next.js — die App (app.klano.ai)
│   └── marketing/              # Astro — Landing, Blog (klano.ai)
├── packages/
│   ├── ui/                     # shadcn/ui Components, geteilt
│   ├── db/                     # Supabase Types, SQL-Migrations
│   ├── agent/                  # AI-Agent: Tools, Prompts, SDK-Wrapper
│   ├── email/                  # React Email Templates für Resend
│   ├── i18n/                   # next-intl Setup, geteilte Strings
│   └── config/                 # tsconfig, biome, tailwind base
├── supabase/                   # Migrations, RLS-Policies, Seed
├── .github/workflows/          # CI/CD
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

### Konkrete Tasks v0

1. GitHub-Org `klano-ai` erstellen, Repo `klano` (privat)
2. `pnpm init` + Turborepo-Setup
3. Beide Apps initialisieren:
   ```bash
   cd apps/marketing && pnpm create astro@latest
   cd apps/web && pnpm dlx create-next-app@latest --app --typescript --tailwind
   ```
4. Tailwind v4 in beiden Apps, geteilte Tailwind-Config in `packages/config`
5. Biome-Config global
6. shadcn/ui in `packages/ui` initialisieren, in `apps/web` konsumieren
7. Supabase-Projekt erstellen (EU-Frankfurt), `supabase init`, lokales Postgres via Docker
8. Vercel-Projekte verbinden (zwei Projekte: `klano-marketing`, `klano-web`)
9. CI-Workflow: lint + typecheck + build pro PR
10. Branch-Protection auf `main`: PR + 1 Review + grüne CI

### Done-Kriterium v0
- [ ] `pnpm dev` startet beide Apps lokal ohne Fehler
- [ ] Beide Apps haben Preview-Deployment auf Vercel
- [ ] Supabase lokal erreichbar (`supabase start`)
- [ ] CI grün auf einem leeren PR
- [ ] README mit Setup-Anleitung für neue Devs

---

## 2. v0.1 — Brand & Marketing-Site (Woche 2)

### Scope
Astro-Marketing-Site mit Landing-Page, Pricing-Preview, Wartelisten-Form. Brand finalisiert.

### Tech-Entscheidungen

| Entscheidung | Wahl | Warum |
|--------------|------|-------|
| Astro-Integrations | **@astrojs/tailwind, @astrojs/sitemap, @astrojs/react** (für Forms) | Minimal-Set |
| Display-Font | **@fontsource-variable/fraunces** | Editorial Serif für emotionale Headlines (Hero, Quotes, Mega-Wordmark) — variable axes (opsz, SOFT, WONK) |
| UI/Sans-Font | **@fontsource-variable/geist** | Modern Grotesk für strukturelle Headlines, Body, Buttons |
| Mono-Font | **@fontsource-variable/geist-mono** | Eyebrows, Numbers, Code, Track-References |
| Analytics | **Plausible** (self-hosted oder Cloud) | DSGVO-freundlich, kein Cookie-Banner |
| Form-Backend | **Supabase Edge Function** + Resend | Kein 3rd-Party-Form-Service nötig |
| Animations | **GSAP** + **Lenis** (smooth scroll) | Bold scroll-driven sequences, nicht nur Hero |
| Bilder | **Astro Image** + Sharp | Auto-Optimierung |
| Theme | **Dark-Mode-First** (kein Light-Mode in v1) | Editorial/künstlerische Brand-Identität |

### Wartelisten-Daten (Supabase-Tabelle)

```sql
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  language text default 'de',
  metadata jsonb default '{}'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz default now()
);

-- RLS: niemand darf direkt drauf, nur via Edge Function
alter table waitlist enable row level security;
```

### Konkrete Tasks v0.1

1. Domain registrieren (sobald Name final)
2. Brand-Assets in `apps/marketing/public/brand/` ablegen
3. Astro-Layout mit i18n-Routing (`/de/...`, `/en/...`)
4. Komponenten: `Hero`, `PainSection`, `SolutionSection`, `PricingPreview`, `WaitlistForm`, `Footer`
5. GSAP-Hero-Animation (subtil, eine Hauptbewegung beim Scroll-In)
6. Wartelisten-Form: Email + Sprache → POST an Supabase Edge Function `submit-waitlist`
7. Edge Function: Validierung, Insert in DB, Resend-Bestätigungs-Mail mit Double-Opt-In-Link
8. Resend-Domain konfigurieren (DNS: SPF, DKIM, DMARC)
9. Plausible einbinden, Goal "waitlist_signup" tracken
10. Datenschutz-Seite, Impressum, AGB-Platzhalter (rechtlich Phase 1 ausreichend)
11. SEO: OG-Images, Sitemap, robots.txt
12. Lighthouse-Score ≥95 sicherstellen

### Done-Kriterium v0.1
- [ ] Marketing-Site live unter Production-Domain
- [ ] Wartelisten-Funnel funktional, mit Double-Opt-In
- [ ] Plausible trackt Sign-ups
- [ ] Lighthouse Performance/SEO/A11y ≥95
- [ ] DE und EN beide produktionsreif

---

## 3. v0.2 — Datenmodell & Auth (Woche 3, parallel zu v0.1)

### Scope
Komplettes Supabase-Schema, Row-Level-Security-Policies, Auth-Flow in der Web-App. Noch keine Features — nur Login/Logout funktioniert.

### Datenmodell (komplett)

```sql
-- ===== Users =====
-- Supabase Auth managed `auth.users` automatisch.
-- Wir spiegeln Profil-Daten:
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  preferred_language text default 'de' check (preferred_language in ('de', 'en')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== Bands =====
create table bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  genre text[],
  region text,
  country text default 'CH' check (country in ('CH', 'DE', 'AT')),
  preferred_language text default 'de' check (preferred_language in ('de', 'en')),
  ambition_level text default 'hobby' check (ambition_level in ('hobby', 'semi_pro', 'pro')),
  bio text,
  owner_user_id uuid not null references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_bands_owner on bands(owner_user_id);

-- ===== Band Members =====
create table band_members (
  band_id uuid references bands(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'member' check (role in ('leader', 'member')),
  instrument text,
  joined_at timestamptz default now(),
  primary key (band_id, user_id)
);

create index idx_band_members_user on band_members(user_id);

-- ===== Band Invitations =====
create table band_invitations (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references bands(id) on delete cascade,
  email text not null,
  invited_by uuid not null references profiles(id),
  token text unique not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz default now()
);

-- ===== Venues (kuratierte Datenbank) =====
create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null check (country in ('CH', 'DE', 'AT')),
  region text,
  postal_code text,
  address text,
  lat numeric,
  lng numeric,
  capacity int,
  genres text[],
  primary_language text default 'de',
  contact_email text,
  contact_form_url text,
  website text,
  notes text,
  source text,
  last_verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_venues_country_city on venues(country, city);
create index idx_venues_genres on venues using gin(genres);

-- ===== Bookings =====
create table bookings (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references bands(id) on delete cascade,
  venue_id uuid not null references venues(id),
  status text default 'drafted' check (status in (
    'drafted', 'sent', 'opened', 'replied', 'negotiating',
    'booked', 'declined', 'no_response', 'archived'
  )),
  desired_date date,
  agreed_date date,
  agreed_fee numeric,
  notes text,
  last_followup_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_bookings_band on bookings(band_id);
create index idx_bookings_status on bookings(status);

-- ===== Email Threads =====
create table email_threads (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  resend_id text,
  direction text check (direction in ('outbound', 'inbound')),
  from_address text,
  to_address text,
  subject text,
  body_text text,
  body_html text,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  ai_classification jsonb,
  created_at timestamptz default now()
);

create index idx_email_threads_booking on email_threads(booking_id);

-- ===== Events (Proben, Gigs) =====
create table events (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references bands(id) on delete cascade,
  type text check (type in ('rehearsal', 'gig', 'meeting', 'other')),
  title text not null,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  notes text,
  booking_id uuid references bookings(id),
  created_at timestamptz default now()
);

create index idx_events_band_date on events(band_id, starts_at);

-- ===== Member Availability =====
create table availabilities (
  user_id uuid references profiles(id) on delete cascade,
  band_id uuid references bands(id) on delete cascade,
  date date not null,
  status text check (status in ('free', 'busy', 'tentative')),
  primary key (user_id, band_id, date)
);

-- ===== Subscriptions (Stripe-Spiegel) =====
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  band_id uuid unique not null references bands(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text default 'free' check (status in (
    'free', 'trialing', 'active', 'past_due', 'canceled', 'incomplete'
  )),
  plan text default 'free' check (plan in ('free', 'pro')),
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ===== Agent Action Log (Auditierung) =====
create table agent_actions (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references bands(id) on delete cascade,
  triggered_by uuid references profiles(id),
  action_type text not null,
  input jsonb,
  output jsonb,
  status text check (status in ('pending', 'success', 'failed')),
  error text,
  created_at timestamptz default now()
);

create index idx_agent_actions_band on agent_actions(band_id, created_at desc);
```

### RLS-Policies (Auszug, Vollständig im Code)

```sql
-- Hilfs-Funktion: Ist der User Mitglied der Band?
create or replace function is_band_member(_band_id uuid)
returns boolean language sql security definer as $$
  select exists(
    select 1 from band_members
    where band_id = _band_id and user_id = auth.uid()
  );
$$;

-- Bands: Nur sehen wenn Mitglied
alter table bands enable row level security;

create policy "Members can view their bands" on bands
  for select using (is_band_member(id));

create policy "Owners can update their bands" on bands
  for update using (owner_user_id = auth.uid());

-- Bookings: Nur Band-Mitglieder
alter table bookings enable row level security;

create policy "Members can manage bookings" on bookings
  for all using (is_band_member(band_id));

-- ... analog für alle anderen Tabellen
```

### Auth-Flow Web-App

| Schritt | Tech |
|---------|------|
| Magic-Link-Sign-in | `supabase.auth.signInWithOtp({ email })` |
| Email-Template (Magic-Link) | Resend via Supabase SMTP-Override |
| OAuth Google + Apple | Supabase Provider, redirect callback |
| Server-Side-Auth | `@supabase/ssr` mit Cookies |
| Profile-Sync | DB-Trigger: bei `auth.users` Insert → `profiles` Insert |
| Logout | `supabase.auth.signOut()` + Cookie-Clear |

### Konkrete Tasks v0.2

1. Alle Migrations als versionierte SQL-Files in `supabase/migrations/`
2. RLS-Policies komplett, getestet mit `supabase test db`
3. DB-Types generieren: `supabase gen types typescript`
4. `packages/db` exportiert Types und einen typed Supabase-Client
5. Auth-Pages in `apps/web`: `/auth/sign-in`, `/auth/callback`, `/auth/sign-out`
6. Middleware (`apps/web/middleware.ts`) für Auth-Refresh
7. Resend SMTP-Override in Supabase konfigurieren
8. Email-Templates (Magic-Link, Welcome) in `packages/email` als React Email
9. Profile-Trigger schreiben + testen
10. Layout `/app/*` ist auth-protected, Redirect zu `/auth/sign-in` wenn out

### Done-Kriterium v0.2
- [ ] User kann sich registrieren (Magic-Link kommt an)
- [ ] Logout funktioniert
- [ ] Auth-protected Routes zeigen sign-in wenn nicht angemeldet
- [ ] DB-Types in `packages/db` sind aktuell und werden in `apps/web` typsicher genutzt
- [ ] RLS verhindert Cross-Band-Datenzugriff (manuell verifiziert)

---

## 4. v0.3 — Onboarding-Wizard (Wochen 4–5)

### Scope
Der **künstlerische, mobile-first Onboarding-Wizard** von Sign-up bis erste Band angelegt + Mitglieder eingeladen. Bold typography, kinetic transitions, dark canvas — der Wizard fühlt sich an wie ein Editorial-Magazin, nicht wie ein Software-Setup. Volle Design-System-Anwendung (siehe `design-system.md`).

### Architektur-Entscheidung: State-Machine

Wizard ist ein State-Machine-Flow. **XState** oder **eigener React-Reducer**? Für 7 Schritte: eigener Reducer reicht, XState wäre overkill.

```typescript
type WizardState = {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  band: Partial<{
    name: string;
    logoUrl: string;
    genres: string[];
    country: 'CH' | 'DE' | 'AT';
    regions: string[];
    ambitionLevel: 'hobby' | 'semi_pro' | 'pro';
  }>;
  invitations: { email: string; instrument?: string }[];
  selectedVenueId?: string;
  draftedEmail?: { subject: string; body: string };
};
```

### Tech-Entscheidungen Onboarding

| Entscheidung | Wahl | Warum |
|--------------|------|-------|
| Routing | **Eine Route `/onboarding` mit clientseitigem State** | Smoothe Transitions, kein Page-Reload |
| Persistierung | **Lokal-State + auf "Next"-Click partial save in Supabase** | User kann mitten drin abbrechen und wiederkommen |
| Animations | **GSAP Timeline pro Step-Transition** | Konsistente Choreografie |
| Validation | **Zod Schemas pro Step** | Type-safe, gleiche Schemas Server-Side |
| Logo-Upload | **Supabase Storage Bucket `band-logos`** | Public Read, signed Upload-URL |
| Map (Schritt 3) | **MapLibre GL JS + OSM Tiles** | Kein Mapbox-Token nötig, kostenlos |

### Schritt-für-Schritt Spec

**Schritt 1 — Welcome (3 Sek Anim)**
- Vollbild, Hero-Animation, Continue-Button erscheint nach 1.2s
- GSAP: Logo fade-in, Wort-für-Wort-Reveal "Lass uns deine Band kennenlernen"

**Schritt 2 — Band-Basics**
- Bandname-Input mit Live-Preview (große Typografie)
- Logo-Drop-Zone (optional, später nachholbar)
- Genre-Multi-Select (max 3) — visuelle Cards mit Cover-Pattern
- Bandgröße-Stepper (3–8)
- Validation: Name min 2 chars, Genres min 1

**Schritt 3 — Geografie**
- Land-Picker (CH/DE/AT)
- MapLibre-Karte mit klickbaren Regionen / Städten
- User wählt 1–5 Städte/Regionen, in denen Band aktiv sein will
- Diese werden später für Venue-Matching genutzt

**Schritt 4 — Anspruch**
- Drei große Karten: Hobby / Semi-Pro / Pro
- Karten sind animiert (sanftes Float)
- One-Click, kein Submit-Button — Auswahl = Continue

**Schritt 5 — Mitglieder einladen**
- 1–4 Email-Eingaben + optional Instrument
- "Skip for now" prominent (nicht versteckt — Bandleader will eventuell allein starten)
- Bei Submit: `band_invitations` einträge + Resend-Mails

**Schritt 6 — WOW-Moment**
- Loading-Animation: 3 Sek "Suche passende Venues für [Bandname]..."
- Backend-Call (parallel beim Schritt-5-Submit gestartet, deshalb 3 Sek "fake"-Wait nicht nötig)
- 3 Venue-Karten mit Foto, Name, Stadt, Kapazität
- "Das passt zu uns" / "Andere zeigen"
- Wenn alle 3 declined → 3 neue zeigen
- Auswahl eines → weiter

**Schritt 7 — Erste Outreach**
- Backend draftet Mail (Claude via Vercel AI SDK)
- Streaming-Anzeige (Mail wird live geschrieben — fühlt sich magisch an)
- User editiert, klickt "An [Venue] senden"
- Resend sendet, Booking entry mit status='sent'
- Confetti-Animation (subtil), redirect zu Dashboard

### Konkrete Tasks v0.3

1. Wizard-Layout-Component mit Step-Indicator (oben, dezent)
2. Reducer + Context für Wizard-State
3. Schritte 1–7 als eigene Components
4. GSAP-Transitions zwischen Steps
5. Logo-Upload mit Supabase Storage signed URLs
6. MapLibre Setup mit DACH-Region-GeoJSON
7. Backend-Endpoint `POST /api/bands/create` (Validation, Insert, Owner-Member-Insert)
8. Backend-Endpoint `POST /api/bands/:id/invite` (Token generieren, Resend senden)
9. Backend-Endpoint `GET /api/bands/:id/venue-suggestions` (siehe Agent-Spec v0.5)
10. Backend-Endpoint `POST /api/bookings/draft-outreach` (siehe Agent-Spec v0.5)
11. Confetti-Lib (`canvas-confetti`)
12. End-to-End-Test mit Playwright: kompletter Wizard-Flow

### Done-Kriterium v0.3
- [ ] Neuer User kann von Sign-up bis "Erste Mail gesendet" durchlaufen ohne Bug
- [ ] Wizard ist mobile-responsive (375px+)
- [ ] Daten landen korrekt in Supabase
- [ ] Resend-Mails kommen an (Test mit echten Mailadressen)
- [ ] Designer hat visuelles QA durchgeführt

---

## 5. v0.4 — Dashboard & Booking-Pipeline (Wochen 6–7)

### Scope
Nach Onboarding: Dashboard mit Booking-Pipeline, Venue-Liste, Member-Liste. Status-Tracking für Bookings.

### UI-Sections

**Dashboard-Home (`/app`)**
- Greeting "Hi [Name], hier ist [Bandname]"
- Quick-Stats: aktive Outreaches, kommende Gigs, neue Replies
- Activity-Feed (letzte Agent-Actions)
- Quick-Actions: "Neue Venue ansprechen", "Probe planen"

**Bookings (`/app/bookings`)**
- Kanban-Style Pipeline: Drafted | Sent | Opened | Replied | Booked
- Karten mit Venue-Foto, Stadt, Status-Badge, letzte Aktion
- Klick auf Karte → Detail-View mit Mail-Thread, Status-Update-Optionen

**Booking-Detail (`/app/bookings/:id`)**
- Venue-Info, Booking-Status, Datum, Fee
- Email-Thread (chronologisch)
- Manueller Status-Override
- Follow-up-Trigger: "Jetzt nachhaken" (generiert Follow-up-Mail)
- Notizen-Feld

**Band-Settings (`/app/settings/band`)**
- Bandname, Logo, Genres, Region, Ambition
- Mitglieder-Liste mit Rollen, Invite-Status
- Re-Invite, Mitglied entfernen
- Subscription-Status + Upgrade-CTA

### Tech-Entscheidungen Dashboard

| Entscheidung | Wahl | Warum |
|--------------|------|-------|
| Daten-Fetching | **Server Components + Server Actions** | Kein Client-State-Management nötig für die meisten Views |
| Echtzeit-Updates | **Supabase Realtime** für Booking-Status, Email-Threads | Wenn Reply reinkommt, sofort sichtbar |
| Tabellen | **TanStack Table** | Sortier-/Filterbar |
| Date-Picker | **react-day-picker** (in shadcn enthalten) | DSGVO-safe, lokal |
| Toast-Notifications | **Sonner** | Sauber, in shadcn |
| Optimistic Updates | **`useOptimistic` (React 19)** | Schnelle UX bei Status-Änderungen |

### Konkrete Tasks v0.4

1. App-Layout mit Sidebar (Active-Band-Switcher, Nav)
2. Dashboard-Home mit Server-Component-Datenfetching
3. Bookings-Kanban (drag-and-drop optional, erst statisch)
4. Booking-Detail-Page mit Email-Thread-Display
5. Manueller Status-Override per Server-Action
6. Realtime-Subscription für Email-Threads (neue Replies)
7. Settings-Pages: Profile, Band, Members
8. Member-Management (Re-Invite, Remove)
9. Empty-States überall (mit klaren CTAs)
10. Dark-Mode-Toggle

### Done-Kriterium v0.4
- [ ] User kann komplette Booking-Pipeline managen
- [ ] Realtime: zweiter Browser zeigt Updates ohne Reload
- [ ] Dark-Mode poliert
- [ ] Dogfooding: PO + Founder nutzen es täglich für eigene "Test-Band"

---

## 6. v0.5 — AI-Agent (Wochen 7–8, parallel zu v0.4)

### Scope
Der Agent kann: Venues matchen, Outreach-Mails draften, Inbound-Replies klassifizieren, Follow-ups schedulen.

### Architektur

```
packages/agent/
├── src/
│   ├── tools/
│   │   ├── searchVenues.ts
│   │   ├── draftOutreachEmail.ts
│   │   ├── classifyInboundEmail.ts
│   │   ├── scheduleFollowUp.ts
│   │   └── proposeRehearsal.ts
│   ├── prompts/
│   │   ├── system.ts          # Master-System-Prompt
│   │   ├── outreach-de.ts
│   │   ├── outreach-en.ts
│   │   └── classify-reply.ts
│   ├── client.ts              # Vercel AI SDK Setup
│   └── runAgent.ts            # Main entry
├── package.json
└── tsconfig.json
```

### Tech-Entscheidungen Agent

| Entscheidung | Wahl | Warum |
|--------------|------|-------|
| LLM-Provider primär | **Anthropic Claude (Sonnet 4.7 oder Opus 4.7)** | Beste Quality für Tool-Calling, gute DE |
| LLM-Provider Fallback | **OpenAI GPT-4.1** | Bei Anthropic-Outage |
| SDK | **Vercel AI SDK** | Einheitliches Tool-Calling-Interface |
| Streaming | **Ja, für Mail-Drafting** | UX: Mail erscheint "magisch" beim Schreiben |
| Caching | **Prompt-Caching von Anthropic nutzen** | System-Prompt cachen, Kosten halbieren |
| Observability | **Helicone** oder **Langfuse** | Token-Tracking, Debug |
| Cost Cap pro Band/Monat | **Free: 0.50 USD, Pro: 5 USD** | Hard Limit, sonst Kosten-Drift |

### Tool-Spec: searchVenues

**Input:**
```typescript
{
  bandId: string;
  preferredRegions: string[];
  capacityRange?: [number, number];
  excludeVenueIds?: string[];
  limit?: number;  // default 5
}
```

**Logik:**
1. Lade `bands` row (Genres, Region, Ambition)
2. Postgres-Query: `venues` wo
   - `country` IN bands.country (oder configurable)
   - `region` overlaps preferredRegions
   - `genres` overlaps bands.genres (mindestens 1 Match)
   - capacity in range (Hobby: 50–200, Semi-Pro: 100–500, Pro: 200–2000)
3. Score per Venue: Genre-Match × 3 + Geo-Match × 2 + Capacity-Match × 1
4. Top N zurück

**Wichtig:** Das ist NICHT LLM-gestützt im MVP. Klassische SQL-Query mit Scoring. LLM wird erst in v0.6 für tieferes Matching genutzt (z.B. Bio-Match).

### Tool-Spec: draftOutreachEmail

**Input:**
```typescript
{
  bandId: string;
  venueId: string;
  intent: 'first_contact' | 'follow_up_1' | 'follow_up_2';
  customNote?: string;
}
```

**System-Prompt (Auszug, DE):**
```
Du bist der digitale Bandkollege für [BANDNAME]. Du schreibst eine
Outreach-Mail an [VENUE].

Stil:
- Direkt, freundlich, professionell — kein Bullshit
- Du-Form (wenn DE), nicht Sie
- Kurz: max 8 Sätze
- Ein klarer Call-to-Action am Ende
- Keine Floskeln wie "Wir hoffen, diese Mail erreicht Sie wohlauf"

Inhalt MUSS enthalten:
- Wer wir sind (Band, Genre, Region)
- Warum gerade dieses Venue (1 spezifischer Grund)
- Was wir vorschlagen (Gig-Vorschlag mit Zeitrahmen)
- Wie weiter (Soundsample-Link, Frage nach freien Daten)

Inhalt MUSS NICHT enthalten:
- Erfindungen über die Band, die nicht in den Daten stehen
- Garantien zu Zuschauerzahlen
- Rechtliche Aussagen
```

**Output:** `{ subject: string, body: string }` — beides streamed an Frontend.

### Tool-Spec: classifyInboundEmail

Wenn Resend-Inbound einen Reply liefert:

```typescript
input: { emailBody: string, threadContext: string };
output: {
  intent: 'positive' | 'negative' | 'question' | 'spam' | 'other';
  suggestedNextAction: 'wait' | 'reply' | 'archive';
  extractedDate?: string;  // wenn Venue Datum vorschlägt
  extractedFee?: number;
  summary: string;  // 1 Satz
}
```

→ Updated `bookings.status` automatisch + Notifiziert Bandleader im Dashboard.

### Tool-Spec: scheduleFollowUp

Nach `sent` Mail: Inngest-Job einplanen
- 7 Tage später: erste Follow-up generieren (`intent: 'follow_up_1'`), in Drafts legen, Bandleader benachrichtigen ("Soll ich nachhaken?")
- 14 Tage nach erster Mail (= 7 nach Follow-up): zweiter Follow-up
- Nach 21 Tagen ohne Reply: Status → `no_response`, archivieren

### Konkrete Tasks v0.5

1. `packages/agent` initialisieren mit Vercel AI SDK
2. System-Prompt (DE + EN) iterativ entwickeln + Test-Suite mit 20 Beispiel-Bands × 5 Venues = 100 generierte Mails
3. Quality-Gate: Manuelles Review der 100 Mails — wenn ≥80% "würde ich senden", LGTM
4. `searchVenues` als reine SQL-Query
5. `draftOutreachEmail` mit Streaming-Endpoint in Next
6. `classifyInboundEmail` als Edge Function (von Resend-Webhook getriggert)
7. Inngest-Setup, `scheduleFollowUp` als Inngest-Function
8. Cost-Tracking pro Band (jede Tool-Invocation in `agent_actions` loggen mit Token-Usage)
9. Helicone-Integration für Logs

### Done-Kriterium v0.5
- [ ] Outreach-Mail-Generation: 8/10 generierte Mails sind "send-würdig" laut Beta-Bands
- [ ] Inbound-Classification: 90% Accuracy auf Test-Set
- [ ] Follow-up-Scheduling triggert zur richtigen Zeit
- [ ] Cost pro durchschnittlicher Band <0.20 USD/Monat in Tests

---

## 7. v0.6 — Email-Pipeline End-to-End (Woche 8)

### Scope
Outbound (mit Tracking) und Inbound (mit Parsing) komplett wired.

### Setup Resend

**Outbound:**
- Domain `hello.klano.ai` für Outreach-Mails
- DNS: SPF, DKIM, DMARC (DMARC `p=quarantine` für Start)
- Reply-To: `band-{bandId}-booking-{bookingId}@inbound.klano.ai`
- Open-Tracking aktiv, Click-Tracking aus (Privacy)

**Inbound:**
- MX-Records für `inbound.klano.ai` zeigen auf Resend
- Webhook `POST /api/webhooks/resend-inbound`
- Parser extrahiert `bandId` + `bookingId` aus Reply-To-Adresse
- Body wird in `email_threads` als `direction='inbound'` gespeichert
- Trigger: `classifyInboundEmail` Tool

### Rate Limits & Compliance

- Pro Band: max 20 Outreach-Mails/Tag, 100/Woche
- Erst senden wenn User aktiv klickt — keine batch-Sends ohne Confirmation
- Unsubscribe-Link in jeder Mail (auch Outreach, weil B2B-Best-Practice)
- DMARC + SPF + DKIM korrekt — bei jedem PR auf Resend-Side prüfen

### Konkrete Tasks v0.6

1. Resend-Domain einrichten + DNS-Records
2. Email-Templates in `packages/email`:
   - `OutreachEmail` (Wrapper für AI-generated body)
   - `WelcomeEmail`
   - `BandInvitationEmail`
   - `FollowUpReminder` (intern an Bandleader: "Soll ich nachhaken?")
   - `WeeklyDigest` (geplant für v0.9)
3. Outbound-Send-Function in `packages/email`
4. Inbound-Webhook-Endpoint mit Signaturen-Verifikation
5. Email-Thread-Display in Booking-Detail
6. Open-Tracking → updates `email_threads.opened_at`

### Done-Kriterium v0.6
- [ ] Mail aus App gesendet, kommt auf Test-Mailbox an, nicht im Spam
- [ ] Reply auf Test-Mailbox kommt zurück, wird im Booking-Detail angezeigt
- [ ] Status-Update von `sent` → `opened` → `replied` automatisch

---

## 8. v0.7 — Stripe & Subscriptions (Woche 9)

### Scope
Stripe Live-Integration, Free-Tier-Limits, Pro-Tier-Upgrade, Customer-Portal.

### Stripe-Setup

**Products:**
- `Pro Plan`
  - Price 1: 19 CHF/Monat (Schweiz-Basis)
  - Price 2: 190 CHF/Jahr (≈17% Rabatt vs. 12 × monatlich)
  - Multi-Currency: EUR, USD analog (via Stripe Tax automatisch)

**Stripe Tax:** aktiviert. CH-MwSt 8.1%, EU-MwSt nach OSS-Schema, automatisch.

### Free-Tier-Limits

| Feature | Free | Pro |
|---------|------|-----|
| Anzahl Bandmitglieder | 4 | unlimited |
| Outreach-Mails/Monat | 10 | unlimited |
| AI-generierte Mails | 5 | unlimited |
| Venue-Suggestions/Monat | 20 | unlimited |
| Auto-Follow-ups | nein | ja |
| Email-Inbox-Parsing | manuell | AI-classified |
| Support | Community | Priority |

### Konkrete Tasks v0.7

1. Stripe Products + Prices anlegen (CH GmbH oder vorerst privat)
2. Stripe Tax aktivieren, Adressen-Validierung im Checkout
3. Webhook-Endpoint `/api/webhooks/stripe`:
   - `checkout.session.completed` → Subscription aktivieren
   - `customer.subscription.updated` → Status sync
   - `customer.subscription.deleted` → auf Free downgraden
   - `invoice.payment_failed` → Email senden, Grace Period 3d
4. Checkout-Flow: Button "Pro freischalten" → Stripe Checkout (gehostet)
5. Customer-Portal-Link in Settings
6. Limit-Enforcement: Server-side bei jedem AI-Call und Mail-Send
7. Upgrade-CTAs an Limit-Hit-Points (mit Wertversprechen, nicht aggressiv)

### Done-Kriterium v0.7
- [ ] Test-Checkout funktioniert (Stripe Test-Mode)
- [ ] Webhook-Events syncen Subscription-Status
- [ ] Limit-Hits triggern korrekt Upgrade-Prompts
- [ ] Customer-Portal funktional
- [ ] Stripe Tax zeigt korrekte MwSt für CH/DE/AT-Adressen

---

## 9. v0.8 — Closed Beta (Wochen 10–14)

### Scope
15 Beta-Bands, wöchentliches Feedback, Bug-Fixes, Polishing.

### Beta-Operations

- Eigener Slack-Workspace für Beta-User
- Wöchentliche 30-Min-Calls pro Band (PO führt)
- In-App-Feedback-Widget (z.B. simples Modal mit "Was nervt dich?")
- Bug-Tracking in Linear, Beta-Bugs haben P0/P1
- PostHog für Session-Recording (mit DSGVO-Consent)

### Polishing-Themen

- Empty-States überarbeiten (jeder mit klarem nächsten Schritt)
- Error-Handling: jeder API-Fehler hat User-freundliche Meldung
- Loading-States: nichts darf "white screen" sein
- Mobile: Wizard + Dashboard auf 375px polished
- A11y: keyboard navigation, screen-reader-friendly für Hauptflows

### Konkrete Tasks v0.8

1. Stripe LIVE-Mode aktivieren (Woche 12)
2. Onboarding für Beta-Bands: Personal-Email mit Loom-Video
3. PostHog-Setup mit Consent-Modus
4. In-App-Feedback-Modal
5. Polishing-Sprint: 30+ kleine UX-Verbesserungen aus Beta-Feedback
6. Performance: Web-App Lighthouse ≥90
7. Error-Monitoring: Sentry einbinden

### Done-Kriterium v0.8
- [ ] 10+ aktive Beta-Bands
- [ ] ≥3 Bands haben echtes Booking aus dem Tool gewonnen
- [ ] NPS ≥30
- [ ] ≥5 Pro-Subscriptions (Stripe Live)
- [ ] Sentry-Errors P0/P1 alle gefixt

---

## 10. v0.9 — Polish & Pre-Launch (Wochen 14–16)

### Scope
Marketing-Site final, Pricing-Page, Blog-Setup, Onboarding-Refinement.

- Blog in Astro mit Content-Collections
- 5 Launch-Artikel: "Wie buche ich Venues als Indie-Band", "5 Fehler beim Booking", "DIY-EPK", etc.
- Pricing-Page mit FAQ
- Vergleichstabelle Free vs Pro
- Testimonials von Beta-Bands (mit Erlaubnis)
- Affiliate/Referral-Programm (Beta-Version)
- Loom-Demo-Video auf Landing eingebettet

### Done-Kriterium v0.9
- [ ] Marketing-Site produktionsreif inkl. Blog
- [ ] Pricing-Page polished
- [ ] 5 Blog-Artikel publiziert
- [ ] 3 Testimonials
- [ ] Demo-Video <90 Sek

---

## 11. v1.0 — Public Launch (Woche 16)

### Launch-Plan

**Tag -7 bis -1:**
- Final QA-Sweep
- Lasttest (k6 oder ähnlich)
- Stripe-Backup-Plan (manueller Fallback bei Webhook-Down)
- Status-Page (cstat oder simple Vercel-Page)

**Launch-Tag:**
- Product Hunt Submission (US-Morgen, 03:00 CET)
- Hacker News Show HN
- LinkedIn-Posts
- Reddit r/IndieHackers, r/SideProject, r/SaaS
- Email an Wartelisten-Sign-ups (gestaffelt über 4 Stunden)
- Twitter/X-Thread

**Tag +1 bis +7:**
- Live-Support 12h/Tag in Slack-Channel
- Schnelle Bug-Fixes (P0/P1 < 4h Response)
- Tägliches Metric-Review: Sign-ups, Activation, Conversions

### Done-Kriterium v1.0
- [ ] Public Sign-up offen
- [ ] 50+ Sign-ups in Launch-Woche
- [ ] ≥10 neue Pro-Subscriptions in Launch-Woche
- [ ] Keine P0-Bugs offen

---

## 12. Cross-Cutting Concerns (gelten für alle Versionen)

### Testing-Strategie

| Layer | Tool | Coverage-Ziel |
|-------|------|---------------|
| Unit | Vitest | 60% für `packages/agent`, `packages/db` |
| Integration | Vitest + supabase-local | Kritische Flows: Auth, Bookings, Stripe |
| E2E | Playwright | Top-3-Flows: Onboarding, Outreach, Stripe-Checkout |
| Visual | Percy oder Chromatic | shadcn-Komponenten + Hauptseiten |

### Observability

- **Sentry:** Errors, Performance
- **Helicone:** AI-Costs und Quality-Logs
- **PostHog:** Product Analytics, Funnels, Session-Recordings (mit Consent)
- **Plausible:** Marketing-Site-Traffic
- **Vercel Analytics:** Web Vitals
- **Better Stack:** Uptime-Monitoring + Status-Page

### Security-Baseline

- Alle DB-Calls über RLS, niemals service-role-key im Client
- Stripe-Webhook-Signature-Check
- Resend-Webhook-Signature-Check
- Rate-Limits auf API-Routes (Upstash Redis)
- CSP-Header gesetzt
- HTTPS-only Cookies
- Secrets in Vercel Environment Vars, niemals in Repo
- Dependabot aktiviert
- 2FA Pflicht für Admin-Accounts (Stripe, Resend, Supabase, Vercel, GitHub)

### CI/CD

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  ci:
    steps:
      - checkout
      - pnpm install --frozen-lockfile
      - turbo run lint typecheck test build
      - turbo run e2e # nur auf main + manual
```

PR-Preview: Vercel automatisch.
Production-Deploy: nur auf merge to `main`, mit manuellem "Promote".

### Migration-Strategie (DB)

- Alle Migrations in `supabase/migrations/` versioniert
- Niemals Migrations in Production manuell editieren
- Breaking Changes: zuerst Feature-Flag, dann Migration, dann Code-Deploy, dann alte Spalten droppen
- Monatliches Backup-Restore-Test in Staging

### Internationalization-Praxis

- Jeder neue String → erst zu `messages/de.json` UND `messages/en.json`
- PR ist erst mergeable wenn beide Sprachen aktuell
- Plural-Forms via `next-intl` korrekt nutzen
- Datum/Zahlen via `Intl.DateTimeFormat` / `Intl.NumberFormat`

---

## 13. Tech-Decision-Log

Entscheidungen, die wir früh festnageln und dokumentieren — damit nicht jede Diskussion nochmal aufgemacht wird.

| # | Entscheidung | Stand |
|---|--------------|-------|
| 1 | Monorepo mit Turborepo | final |
| 2 | Next.js App Router (kein Pages Router) | final |
| 3 | Astro für Marketing | final |
| 4 | Tailwind v4 | final |
| 5 | shadcn/ui als Component-Basis | final |
| 6 | Supabase für DB + Auth + Storage | final |
| 7 | Resend für Mails | final |
| 8 | Stripe für Payments + Stripe Tax | final |
| 9 | Vercel für Hosting (FRA1) | final |
| 10 | Anthropic Claude als LLM-Primär | final |
| 11 | Vercel AI SDK für Tool-Calling | final |
| 12 | Inngest für Background Jobs | final |
| 13 | next-intl für i18n | final |
| 14 | MapLibre statt Mapbox | final |
| 15 | Plausible statt GA4 | final |
| 16 | Biome statt ESLint+Prettier | final |
| 17 | pnpm als Package Manager | final |
| 18 | XState verzichten, Reducer reicht | final |
| 19 | PostHog für Product Analytics | final |
| 20 | Sentry für Error-Monitoring | final |

Wenn du eine dieser Entscheidungen ändern willst: ADR (Architecture Decision Record) schreiben mit Begründung. Sonst bleibt's wie es ist.

---

## 14. Was ich am Montag morgen mache (Tag 1, konkret)

```bash
# 1. GitHub-Org + Repo
gh repo create klano-ai/klano --private

# 2. Lokal
git clone git@github.com:klano-ai/klano.git
cd klano

# 3. Monorepo
pnpm init
pnpm add -D turbo
pnpm add -D -w typescript @biomejs/biome
echo "node_modules\n.next\n.astro\n.env*\ndist" > .gitignore

# 4. Turborepo
mkdir -p apps packages
cat > pnpm-workspace.yaml <<EOF
packages:
  - "apps/*"
  - "packages/*"
EOF

# 5. Apps initialisieren
cd apps
pnpm create astro@latest marketing -- --template minimal --typescript strict
pnpm dlx create-next-app@latest web --app --typescript --tailwind --eslint=false --src-dir=false --import-alias="@/*"

# 6. Supabase
cd ../
pnpm add -D -w supabase
pnpm exec supabase init
pnpm exec supabase start

# 7. ersten Commit
git add .
git commit -m "chore: initial monorepo scaffolding"
git push -u origin main

# 8. Vercel-Projekte verbinden (Web-UI), Domain klano.ai routen
# 9. README mit Setup-Schritten schreiben
# 10. Erstes "Hello World" Deployment auf Vercel verifizieren
```

Ende Tag 1: Beide Apps deployable, leeres Postgres läuft lokal, Repo auf GitHub.

Ab Tag 2: v0.1 starten — Brand-Recherche und Marketing-Page-Skeleton.

---

## 15. Sequenz-Übersicht

```
Woche 1   v0     Foundation (Repo, Infra)
Woche 2   v0.1   Marketing-Site + Wartelisten
Woche 3   v0.2   Datenmodell + Auth
Woche 4-5 v0.3   Onboarding-Wizard
Woche 6-7 v0.4   Dashboard + Booking-Pipeline
Woche 7-8 v0.5   AI-Agent (parallel)
Woche 8   v0.6   Email-Pipeline E2E
Woche 9   v0.7   Stripe & Subscriptions
Woche 10-14 v0.8  Closed Beta
Woche 14-16 v0.9  Polish & Pre-Launch
Woche 16  v1.0   PUBLIC LAUNCH
```

---

> **Letztes Wort:**
> Disziplin > Cleverness. Jede Woche shipping. Niemals länger als 2 Wochen ohne Demo.
> Wir bauen geradeaus. Side-Quests sind verboten bis v1.0.
>
> Let's ship it. 🚀

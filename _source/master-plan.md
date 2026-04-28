# Master Plan – Klano

> **Status:** v1.0 · Stand: April 2026
> **Brand:** Klano · **Domain:** klano.ai · **App:** app.klano.ai
> **Hauptsitz:** Schweiz · **Erstmarkt:** DACH · **Sprachen:** DE / EN

---

## 1. Executive Summary

Ein KI-Agent, der den organisatorischen Kram für Hobby- und Semi-Pro-Bands erledigt — Booking, interne Koordination, Follow-ups — sodass Musiker wieder Musiker sein können.

**Differenzierung:** Während Wettbewerber (BandHelper, Bandinq, Bandop) "Datenbanken mit UI" bauen, ist unser Produkt ein **proaktiver Agent**: er sucht Venues, schreibt Outreach-Mails, erinnert die Band, treibt Booking-Pipelines autonom voran. Phase 2: Agent lebt zusätzlich im Telegram-Group-Chat der Band.

**Geschäftsmodell:** Freemium pro Band. Free-Tier permanent kostenlos. Pro-Tier per Stripe-Subscription.

---

## 2. Produktvision

**Vision-Statement:**
> "Make musicians be musicians again."

**Mission:** Wir nehmen Bands die Bürokratie ab, die sie ausbremst. Kein "Orga-Mensch" mehr nötig — die KI ist der digitale Bandkollege.

**Kernversprechen (für Marketing):**
1. **Spart Zeit** — viele Stunden pro Woche, die du sonst mit Mails und Excel verbringst
2. **Mehr & bessere Gigs** — aktive Booking-Pipeline statt passives Warten
3. **Professioneller Auftritt** — saubere Mails, EPK, Konsistenz
4. **Entlastet die ganze Band** — keiner muss mehr "der Manager" sein

---

## 3. Zielgruppe

**Primär:** Hobby-Bands mit semi-pro-Ambitionen
- 3–6 Mitglieder
- Proben regelmäßig, spielen 5–30 Gigs/Jahr
- Kein Label, kein Manager
- Bandleader ist der "Orga-Typ", oft ungewollt
- Genres: Rock, Indie, Singer-Songwriter, Cover-Bands, Jazz-Combos, Blasmusik etc.

**Sekundär:** Semi-Pro mit Tour-Ambition
- Spielen 30+ Gigs/Jahr
- Vielleicht erste Releases auf Spotify
- Brauchen mehr Pro-Features (Tour-Logistik, EPK, Pressearbeit)

**Käufer-Persona "Tobi, 32":**
Spielt seit 10 Jahren Gitarre in Indie-Band, hat einen Vollzeitjob, organisiert die Band aus Liebe, verbringt 5+ Stunden/Woche mit Mails, ist genervt davon. Würde 25€/Monat für seine Band ausgeben, wenn das Ding wirklich funktioniert.

---

## 4. Feature-Scope

### MVP (Phase 1 — 8–12 Wochen)

**A. Booking-Pipeline**
- Venue-Datenbank DACH (kuratiert, kategorisiert nach Genre, Kapazität, Region, Stadt)
- AI matcht passende Venues zur Band (basierend auf Genre, Größe, Region, Anspruch)
- AI draftet personalisierte Outreach-Mails (DE oder EN je nach Venue)
- Bandleader bestätigt → Mail geht raus via Resend
- Status-Tracking: Sent → Opened → Replied → Booked / Declined
- Autonome Follow-ups (nach 7, 14 Tagen wenn keine Antwort)
- Erinnerungen vor Gigs (Tech-Specs, Riders, Anreise)

**B. Interne Koordination**
- Band-Setup mit allen Mitgliedern (Einladung per Mail-Link)
- Verfügbarkeits-Sammlung (jeder pflegt seinen Kalender bzw. blockt Termine)
- AI schlägt Probe-Termine vor basierend auf Verfügbarkeit
- Reminders vor Probe & Gig (per Mail, später Push)
- Setlist-Management (simpel: Songs anlegen, Reihenfolge, Notizen)

**C. Onboarding-Wizard (Editorial, Affinity-inspired)**
- Schritt 1: Bandname, Logo-Upload, Genre, Bandgröße
- Schritt 2: Wo seid ihr aktiv? (Region, Städte)
- Schritt 3: Welcher Anspruch? (Hobby, Semi-Pro, ...)
- Schritt 4: Bandmitglieder einladen (Mail)
- Schritt 5: Erste Venue-Vorschläge präsentieren ("Wow-Moment")

### Phase 2 (3–6 Monate nach Launch)

- Telegram-Bot-Integration (Agent im Group-Chat)
- EPK-Generator (Electronic Press Kit als Web-Page mit eigener URL)
- Setlist-Builder mit Lyrics/Chords (Live-Mode für Gigs)
- Finanz-/Splits-Tracking
- Social-Posts-Vorschläge (Instagram, Facebook)

### Phase 3 (später)

- WhatsApp-Integration
- Venue-Marktplatz (Venues können sich selbst listen, finden Bands)
- Tour-Planning (Multi-Stop, Routing)
- Spotify-/Apple-Music-Distribution-Anbindung
- Pressearbeit-Modul (Journalisten-CRM)

---

## 5. Tech-Stack

### Frontend
| Layer | Tech | Zweck |
|-------|------|-------|
| Marketing-Site | **Astro** (latest) | Landing, Pricing, Blog, SEO |
| Web-App | **Next.js** (App Router, latest) | Dashboard, Auth-Bereich |
| Styling | **Tailwind CSS v4** | beide Apps |
| UI-Library | **shadcn/ui** | Next-App, custom Editorial-Theming |
| Animation | **GSAP** (latest) | Onboarding-Wizard, Hero-Sektionen |
| Icons | **Lucide** | konsistent, sauber |

### Backend
| Layer | Tech | Zweck |
|-------|------|-------|
| Auth + DB | **Supabase** (latest) | Postgres, Auth, RLS, Storage, Realtime |
| Mail | **Resend** | Transaktional + Outreach |
| Payments | **Stripe** + **Stripe Tax** | Subscriptions, MwSt |
| AI / LLM | **Vercel AI SDK** + Claude/OpenAI | Tool-Calling, Streaming |
| Background Jobs | **Inngest** | Follow-ups, Reminders, Cron |
| Hosting | **Vercel** (Next.js + Astro) | Edge Network, gut für DACH |
| File Storage | **Supabase Storage** | Logos, Press Photos, Riders |

### Repo-Struktur (Monorepo mit Turborepo)
```
/apps
  /web         → Next.js App (app.klano.ai)
  /marketing   → Astro Site (klano.ai)
/packages
  /ui          → shared shadcn components
  /db          → Supabase types & migrations
  /agent       → AI Agent logic (tools, prompts)
  /email       → Resend templates (React Email)
  /config      → tsconfig, eslint, tailwind shared
```

---

## 6. Datenmodell (Supabase Postgres)

**Kerntabellen:**

```sql
-- Bands sind die Tenants
bands (
  id, name, logo_url, genre, region, country,
  preferred_language ('de'|'en'),
  ambition_level ('hobby'|'semi_pro'|'pro'),
  created_at, owner_user_id
)

users (
  id, email, full_name, avatar_url
  -- managed by Supabase auth
)

band_members (
  band_id, user_id, role ('leader'|'member'),
  instrument, joined_at
)

-- Venues kuratiert (DACH-Datenbank)
venues (
  id, name, city, country, region, lat, lng,
  capacity, genres[], primary_language ('de'|'en'),
  contact_email, contact_form_url,
  notes, source, last_verified_at
)

-- Booking-Pipeline
bookings (
  id, band_id, venue_id,
  status ('drafted'|'sent'|'opened'|'replied'|'booked'|'declined'|'archived'),
  desired_date, agreed_date,
  outreach_email_id, last_followup_at,
  created_at
)

email_threads (
  id, booking_id, resend_id,
  direction ('outbound'|'inbound'),
  subject, body, sent_at, opened_at, replied_at
)

-- Interne Koordination
events (
  id, band_id, type ('rehearsal'|'gig'|'meeting'),
  title, location, starts_at, ends_at, notes
)

availabilities (
  user_id, band_id, date, status ('free'|'busy'|'tentative')
)

-- Subscriptions (Stripe-Spiegel)
subscriptions (
  id, band_id, stripe_customer_id, stripe_subscription_id,
  status, plan ('free'|'pro'),
  current_period_end, cancel_at_period_end
)
```

**Row Level Security:** Aggressiv. User darf nur Daten von Bands sehen, in denen er Mitglied ist. Über `band_members` joinen.

---

## 7. Auth & Multi-Tenancy

- Supabase Auth mit Email-Magic-Link (passwordless, sexy für UX)
- OAuth-Optional: Google, Apple (für seamless Mobile-Sign-up)
- Multi-Band-Support: Ein User kann in mehreren Bands sein
- Active-Band-Switcher im UI (Top-Left, ähnlich wie Notion)
- Subscription-Scope: pro Band, nicht pro User

---

## 8. Stripe-Integration (Schweiz-Hauptsitz)

**Wichtig:** Schweizer Hauptsitz heißt:
- Stripe-Account in der Schweiz registrieren
- **Schweizer MwSt. (8.1% Standard)** für CH-Kunden
- **EU-MwSt.** für EU-Kunden via OSS-Registrierung (One-Stop-Shop) oder via Stripe Tax automatisch
- Für UK + Drittländer: separate Logik (Stripe Tax handhabt das)

**Stripe-Setup:**

1. **Stripe Tax aktivieren** — Pflicht. Bestimmt automatisch korrekte MwSt. pro Kundenland.
2. **Products & Prices**
   - Product "Pro Plan"
   - Prices: monatlich (z.B. 19 CHF / 19 EUR / 19 USD), jährlich (z.B. 190 CHF, ca. 17% Rabatt)
3. **Checkout Flow**
   - User klickt "Pro freischalten" → Stripe Checkout (gehosted)
   - Bei Success: Webhook → Supabase `subscriptions` updaten
4. **Customer Portal**
   - Stripe-hosted, fertig, spart Wochen Entwicklung
   - User: Plan ändern, kündigen, Rechnungen runterladen, Zahlungsmethode ändern
5. **Webhook-Events handeln**
   - `checkout.session.completed` → Subscription anlegen, Band auf Pro-Tier setzen
   - `customer.subscription.updated` → Status synchronisieren
   - `customer.subscription.deleted` → Band auf Free-Tier zurücksetzen
   - `invoice.payment_failed` → Email + Grace Period (3 Tage)

**Trial-Strategie:**
- Free-Tier ohne Trial (permanent kostenlos, limitierter Funktionsumfang)
- Pro-Tier: 14 Tage kostenlos testen, ohne Kreditkarte nötig
- Nach Trial: Stripe-Checkout, sonst Auto-Downgrade auf Free

**Subscription-Ownership:**
Subscription gehört der Band (über `band_id`). Bandleader macht Checkout. Wenn er die Band verlässt, kann ein anderes Mitglied die Subscription übernehmen (manueller Stripe-Customer-Transfer via Support oder Self-Service-Flow später).

---

## 9. i18n (DE / EN)

### Astro Marketing-Site
- Native i18n-Routing (`/de/...`, `/en/...`)
- Deutsche URL als Default für DACH-Visitors (Geo-Detection)
- Inhalte als Markdown pro Sprache
- Sprachwechsler im Header

### Next.js Web-App
- **next-intl** als Library
- Übersetzungen in `messages/de.json`, `messages/en.json`
- Server Components + Client Components beide unterstützt
- User-Sprache in `users.preferred_language`, persistiert

### Agent-Sprache (wichtig!)
- Pro Band: `bands.preferred_language` (Default)
- Pro Venue: `venues.primary_language`
- **Logik im Agent-Prompt:** "Schreibe die Outreach in der Sprache, die das Venue bevorzugt. Wenn unbekannt → Deutsch für DACH-Venues, Englisch sonst."

### Übersetzungs-Workflow
- Phase 1: JSON-Files manuell pflegen
- Phase 2: **Tolgee** (Open Source, günstig) anbinden, sobald Volumen wächst

---

## 10. Design-System (Editorial / Affinity-inspired)

**Direction:** Bold, dark, künstlerisch. Direktes Vorbild: affinity.studio (Canva). Nicht Apple-clean, sondern **Editorial-Magazin für Musiker** — Print-Magazin trifft Late-Night-Studio. Detail-Spec siehe `design-system.md`.

**Designprinzipien:**
1. **Dark by default** — Dark Mode ist Identity, nicht Option
2. **Mixed Type** — Serif (Fraunces) für Editorial-Statements, Sans (Geist) für strukturelle Headlines. Genau wie Affinity "Gestaltet in Affinity" in Serif, "Windows" in Sans setzt
3. **Card-System** statt Vertikal-Lines — dunkle Cards mit feinen Borders, generöses Padding
4. **Cream-Pause-Sections** — eine helle Editorial-Section bricht die schwarze Konsistenz für emotionale Moments
5. **Motion mit Charakter** — kinetic Typography, scroll-driven Reveals, keine generischen Fade-Ins

**Konkrete Tokens:**

| Token | Wert |
|-------|------|
| Display Font | **Fraunces** Variable (`opsz 144, SOFT 0–100, WONK 0–1`) — emotionale Headlines |
| UI/Sans Font | **Geist** Variable (400–800) — strukturelle Headlines, Body |
| Mono Font | **Geist Mono** — Zahlen, Code, Eyebrows |
| Base Radius | Buttons 14px · Cards 16–24px · Pills 8px |
| Base Spacing | 4px-Grid, generös (24, 32, 48, 64px) |
| Animation | `cubic-bezier(0.25, 1, 0.5, 1)`, 250–900ms |

**Farbpalette:**
- Canvas: Klano Void `#0A0A0B`, Stage `#131215`, Card `#16151A`, Edge `#2A2730`
- Cream-Pause: `#F2EEE6` mit Edge `#E0DBD0`
- Text: Pearl `#FFFFFF`, Bone `#E8E4DC`, Sand `#BBB5AA`, Fog `#87817A`
- **Primary Accent: Acid `#C5F25C`** (CTAs, Brand-Moments — wie Affinity's Lime-Buttons)
- **Secondary Accent: Coral `#FF5C39`** (Italics, Logo-Punkt, emotionale Highlights)
- Atmospheric: Plum `#3D1F4A` (nur in Gradients)

**Dark Mode:** First-Class und Default. Light Mode kommt nicht in v1.

**Komponenten:** shadcn/ui als Basis mit komplettem Custom-Theming für Editorial-Look (Card-Container statt Border-only, generöses Padding, Acid-Buttons).

---

## 11. Onboarding-Wizard (Editorial)

**Format:** Vollbild, ein Schritt pro Screen, große Typografie, GSAP-Übergänge.

**Schritte:**

1. **Welcome** — Animierter Hero, "Lass uns deine Band kennenlernen." → Fader Continue-Button
2. **Band-Basics** — Bandname (live-Preview als großer Schriftzug), Logo-Drop, Genre-Picker (visuell, mit Cover-Pattern)
3. **Geografie** — Karte (Mapbox/MapLibre), User wählt Region/Städte, in denen die Band aktiv sein will
4. **Anspruch** — drei Karten: "Wir machen das aus Spaß" / "Wir wollen mehr Gigs" / "Wir wollen profi werden". Bestimmt Tone-of-Voice des Agents.
5. **Bandmitglieder einladen** — Mail-Eingabe, max. 5 auf einmal, "Diese senden eine Mail mit Link"
6. **WOW-Moment** — Loading-Animation: "Suche passende Venues für deine Band..." (3–5 Sek). Dann: 3 echte Venue-Vorschläge mit Foto, Kapazität, "Klingt das nach euch?" → User klickt eines an → "Boom. Lass uns die anschreiben."
7. **Erste Outreach** — Agent zeigt vorgefertigte Mail, User editiert, sendet. Ende des Wizards.

**Kritisch:** Der WOW-Moment in Schritt 6 muss echt sein. Die ersten Vorschläge müssen wirklich passen. Sonst verlieren wir den User in Schritt 7.

**Animation:** Jeder Übergang mit GSAP fade + slight slide. Kein abruptes "Next". Subtile Background-Gradients die sich bewegen.

---

## 12. AI-Agent-Architektur

**Stack:** Vercel AI SDK + Claude (Anthropic) als primäres Modell, OpenAI als Fallback.

**Agent-Tools (Tool-Calling):**

```typescript
tools = {
  searchVenues({ genre, region, capacity }),       // Postgres Query auf venues
  draftOutreachEmail({ bandId, venueId, intent }), // LLM generiert Mail
  sendEmail({ to, subject, body, threadId }),      // Resend API
  scheduleFollowUp({ bookingId, days }),           // Inngest Job
  proposeRehearsal({ bandId, dateRange }),         // checkt availabilities
  notifyBand({ bandId, message, channels[] }),     // Email / später Telegram
  updateBookingStatus({ bookingId, status }),
}
```

**Prompts:** Eigenes Modul `/packages/agent/prompts/`. Versioniert. System-Prompt definiert Rolle ("Du bist der digitale Bandkollege..."), Sprach-Logik, Ton (locker aber professionell, Du-Form auf Deutsch).

**Inbox-Parsing:** Antworten von Venues kommen via Resend-Webhook → AI klassifiziert (Zusage / Absage / Nachfrage / Spam) → updated `bookings.status` → notifiziert Band.

---

## 13. Email-Pipeline (Resend)

**Outbound:**
- Transactional: Welcome, Invite, Reminder, Receipt → React Email Templates
- Outreach an Venues: Custom-Generated von Agent, Reply-To = `band-{bandId}-booking-{bookingId}@inbound.klano.ai`

**Inbound:**
- Resend Inbound (MX → Resend) → Webhook
- Parser ordnet Mail dem `email_thread` zu via Reply-To-Adresse
- Agent klassifiziert + agiert

**Deliverability:**
- Outreach von zentraler Domain `hello.klano.ai`, Reply-To `inbound.klano.ai`
- SPF, DKIM, DMARC korrekt aufsetzen
- Phase 1: zentral via Resend. Per-User-Mail-OAuth (Gmail/Outlook) ist Phase 2 nach Public Launch (siehe `_admin/decisions.md` D6).

**Kritisch:** Mass-Outreach-Mails dürfen nicht als Spam landen. Per-Band rate limit: max. 20 Outreach-Mails/Tag. Personalisierung ist Pflicht.

---

## 14. Background Jobs (Inngest)

- **Daily:** Booking-Status checken, Follow-ups schedulen
- **Hourly:** Email-Threads polling für Replies
- **On-Event:** Booking erstellt → 7 Tage später Follow-up-Job; Gig in 7 Tagen → Reminder
- **Weekly:** Venue-Datenbank-Refresh (URLs prüfen, neue Venues kuratieren)

---

## 15. Schweiz-spezifische Themen

**Datenschutz:**
- Schweizer DSG (revidiertes Datenschutzgesetz, gültig seit 1.9.2023)
- DSGVO-konform fahren (gilt eh für EU-Kunden) — beides erfüllen
- Datenschutzerklärung in DE und EN
- Auftragsverarbeitungsverträge mit allen Sub-Auftragnehmern (Supabase, Stripe, Resend, Vercel, Inngest)

**MwSt:**
- Schweizer Umsatzsteuer ab 100k CHF Umsatz/Jahr Pflicht (Anmeldung bei ESTV)
- Stripe Tax automatisiert das, aber Buchhaltung muss laufen
- Steuerberater von Tag 1 dazuholen — nicht selbst basteln

**Recht:**
- AGB, Impressum, Datenschutz von Schweizer Anwalt prüfen lassen
- Bei B2C-Kunden in EU: Widerrufsrecht (14 Tage) ggf. relevant

**Hosting & Datenhaltung:**
- Supabase EU-Region (Frankfurt) wählen — wichtig für DSGVO-Argumentation
- Vercel Edge Network ist global, App rendering primär EU-Edge

---

## 16. Roadmap (grob)

### Q2 2026 — Foundation (8 Wochen)
- Repo-Setup (Turborepo, beide Apps, Packages)
- Astro-Marketing-Site mit Landing, Pricing, Wartelisten-Sign-up
- Supabase-Setup, Auth, Datenmodell
- Design-System & Komponenten-Library
- Stripe-Setup mit Test-Mode

### Q3 2026 — MVP (6 Wochen)
- Onboarding-Wizard
- Band-Setup, Member-Invitation
- Venue-Datenbank Seeding (manuell kuratiert, ~500 DACH-Venues)
- AI-Agent: searchVenues + draftOutreachEmail
- Email-Pipeline (Resend Outbound + Inbound)
- Booking-Pipeline-UI
- Verfügbarkeits-Modul

### Q3 2026 — Closed Beta
- 10–20 Bands aus Netzwerk
- Wöchentliche Feedback-Runden
- Stripe Live, erste Pro-Subscriptions

### Q4 2026 — Public Launch
- Marketing-Site live
- Product Hunt Launch
- Telegram-Bot-Integration
- DACH-Ad-Campaigns (Meta, Google)

### 2027 — Scale
- EPK, Setlist Live-Mode
- WhatsApp-Integration
- Venue-Marktplatz

---

## 17. Risiken & offene Fragen

**Technisch:**
- Email-Deliverability bei Outreach (großes Risiko, früh testen)
- Venue-Datenbank-Pflege ist Handarbeit — wer macht das? (Initial: du / wir manuell, später: Crowdsourcing oder Scraping)

**Markt:**
- Bandinq + BandHelper sind etabliert. Wir müssen den Agent-Wedge sauber kommunizieren.
- Bands sind notorisch schlecht im Bezahlen für Tools. Free-Tier muss großzügig sein, Pro-Conversion realistisch ~5–10%.

**Recht:**
- Schweizer + EU-Compliance früh klären (Anwalt!)
- Email-Outreach-Compliance (CAN-SPAM, DSGVO Opt-In bei Kalt-Outreach an Venues — Venues sind B2B, daher meistens unproblematisch, aber sauber dokumentieren)

**Naming:** ✅ Entschieden: **Klano** · Domain `klano.ai`
- Markenrecherche (DPMA Deutschland, EUIPO, IGE Schweiz) noch durch Anwalt zu bestätigen
- Bekannte Konflikt-Lage: Klano Wheelchairs (USA, Mobility — andere Nizza-Klasse, keine Überschneidung)
- Backup-Namen falls Anwalt rote Karte zeigt: Kapella, Akkord, Sonara

---

## 18. Nächste Schritte (konkret)

1. ✅ **Name + Domain entschieden** — Klano, klano.ai sichern
2. **Anwalt für CH/EU-Compliance briefen** (Datenschutz, AGB, Steuerberater) inkl. Markenrecherche Klano
3. **Repo aufsetzen** (Turborepo + Astro + Next + shadcn + Supabase init)
4. **Design-System v0** (Figma + Tailwind-Tokens)
5. **Marketing-Landing live** mit Wartelisten-Form, Resend-Integration für Bestätigung
6. **Venue-Datenbank Seeding** starten (ich kann dir DACH-Venue-Listen zusammenstellen via Web-Research)
7. **AI-Agent Prototyp** in einem Sandbox-Repo (Tool-Calling, Prompts iterieren)

---

> **Endzustand dieses Dokuments:** lebendiger Master-Plan. Wird mit jeder Erkenntnis aus User-Feedback, Beta-Tests und Implementierung aktualisiert.

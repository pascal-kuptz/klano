# Canonical Decisions

> **Single Source of Truth.** Bei Widerspruch zu `_source/`: dieses Dokument gewinnt.
> Stand: 2026-04-28

## D1 — Brand & Domains

| Item | Wert |
|------|------|
| Brand | **Klano** |
| Marketing-Domain | `klano.ai` |
| App-Domain | `app.klano.ai` |
| Outreach-Mail-Domain | `hello.klano.ai` (From-Adresse) |
| Inbound-Mail-Domain | `inbound.klano.ai` (Reply-To, MX → Resend Inbound) |
| Reply-To Format | `band-{bandId}-booking-{bookingId}@inbound.klano.ai` |

**Supersedes:** _source/master-plan.md Refs zu `banddings.com` (Altname-Leak, bereinigt 2026-04-28).

## D2 — Tech-Stack (locked)

Siehe `_source/build-plan-v0.md` Sektion 13 "Tech-Decision-Log" (#1–#20). Alle dort als "final" markierten Punkte gelten. Änderungen brauchen ADR.

**Pin-Detail (über _source hinaus):**
- LLM Primär: **Claude Sonnet 4.6** (Default, Kosten/Qualität-Balance) — Opus 4.7 nur für `draftOutreachEmail` falls Quality-Gate (≥80% "send-würdig") mit Sonnet nicht erreicht wird. _source/build-plan-v0.md sagt "Sonnet 4.7 oder Opus 4.7" — hier konkretisiert.
- Node: **22 LTS** (siehe build-plan-v0 §1)
- pnpm Version: **9.x** (latest stable)

## D3 — Pricing

| Item | Wert |
|------|------|
| Pro Monatlich | **19 CHF / 19 EUR / 19 USD** |
| Pro Jährlich | **190 CHF/EUR/USD (≈17% Rabatt vs. 12×19)** |
| Trial | **14 Tage Pro-Trial, ohne Kreditkarte** |
| Free-Tier | permanent, mit harten Limits (siehe build-plan-v0 §8) |

**Supersedes:** build-plan-v0.md §8 "12% Rabatt" — korrekt sind ~17% (190 / (12×19) ≈ 0.833 → 16.7%).

## D4 — Band-Mitglieder-Modell

- `bands.owner_user_id` = single owner (DB-Constraint).
- `band_members.role` ∈ {`leader`, `member`}: **mehrere `leader` pro Band erlaubt**, exakt **1 `owner`** (DB).
- **Owner ist immer auch `leader`** (Trigger erzwingt).
- Owner-Transfer: nur durch aktuellen Owner via Settings → "Owner übertragen". Wenn Owner Band verlässt ohne Transfer: ältester `leader` wird automatisch Owner.
- Subscription gehört der Band (`subscriptions.band_id`), nicht dem User.

**Supersedes:** _source-Lücke zur Owner/Leader-Beziehung.

## D5 — Onboarding-Wizard: Bandgröße & Invites

- Schritt 2 "Band-Basics" enthält Bandgröße-Stepper **3–8** (build-plan-v0).
- Schritt 5 Invite-Eingabefeld: **bis zu 7 Invites** (max Bandgröße – 1, da Owner schon drin).
- Free-Tier-Limit Mitglieder: **6** (war 4 in build-plan-v0 §8 — angehoben, weil Bandgröße bis 8). Pro = unlimited.

**Supersedes:** master-plan.md §11.5 "max. 5 auf einmal", build-plan-v0 §4.5 "1–4 Email-Eingaben", build-plan-v0 §8 Free-Limit 4.

## D6 — Email-Pipeline

- **Inbound:** Resend Inbound (kein Cloudflare Email Routing). MX-Records für `inbound.klano.ai` zeigen auf Resend.
- **Outbound-Strategie Phase 1:** Zentral via Resend von `hello.klano.ai` mit Reply-To auf `inbound.klano.ai`. Per-User-OAuth (Gmail/Outlook) **erst Phase 2** (verschoben aus master-plan §13 "anfangs vom User").

**Supersedes:** master-plan.md §13 "Resend Inbound (oder Cloudflare Email Routing)" + "Anfangs vom User-Konto".

## D7 — Telegram-Bot Timing

- **NICHT in v1.0 Public Launch.** Telegram-Integration ist **Phase 2 nach Launch** (frühestens 3 Monate post v1.0).

**Supersedes:** master-plan.md §16 Q4 2026 listet Telegram unter Public Launch — widerspricht day-1-plan §7 "kein Telegram in Phase 1" und build-plan-v0 v1.0-Scope. Telegram ist explizit out-of-scope für v1.0.

## D8 — Confetti / Success-Moments

- Onboarding Schritt 7 Success: **subtile Single-Burst-Confetti** (canvas-confetti, ~40 particles, 1 Sekunde, dezent). Kein Spam, kein Loop.
- Andere Success-States: keine Confetti — stattdessen Acid-Pulse + Toast.

**Supersedes:** Spannung zwischen design-system.md §12 "❌ Confetti-Spam" und build-plan-v0 §4.7 "Confetti-Animation".

## D9 — Roadmap-Datierung

- Build-Plan ist 16-Wochen-Sequenz (v0 → v1.0).
- Kalender-Anker: **Wochen-Nummern relativ zu Tag 1** (= Mo nach Setup-Bestätigung). KW-Daten erst eintragen, wenn Tag 1 fix ist.
- master-plan §16 Quartals-Roadmap (Q2/Q3/Q4 2026) gilt als grobe Außenkommunikation, nicht als interne Sprintsteuerung.

## D10 — Repo / Source-of-Truth Layout

- `_source/` = ursprüngliche Vision-Docs, eingefroren bis auf gezielte Bereinigungen.
- `_admin/` = lebende Arbeitsdokumente (siehe `README.md`).
- Code & Docs leben **gemeinsam** im selben Repo (`klano/` Desktop-Ordner). Späterer Push auf GitHub-Org `klano-ai/klano`.

## D11 — SEO / AI-Crawler-Strategie (Marketing)

**Ziel:** Maximale Sichtbarkeit in klassischer Search **und** AI-Search (ChatGPT, Perplexity, Google AI Overviews, Apple Intelligence).

- **Marketing-Site (`klano.ai`):** komplett indexierbar. Allow für GPTBot, ChatGPT-User, OAI-SearchBot, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, Applebot-Extended, Amazonbot.
- **Block:** CCBot, Bytespider (training-only crawlers ohne Traffic-Return).
- **App-Domain (`app.klano.ai`):** komplett `noindex,nofollow` — Auth-Bereich gehört nicht in Search-Index.
- **Schema.org JSON-LD** auf jeder Marketing-Page automatisch:
  - `Organization` (immer)
  - `WebSite` (immer)
  - `SoftwareApplication` mit Offers (immer)
  - Page-spezifisch: `FAQPage`, `Article`, `BreadcrumbList`, `Product` je nach Kontext
- **Meta-Tags:** OG (de_CH/en_US), Twitter, hreflang (de + en + x-default), `theme-color`, canonical.
- **Files:** `/robots.txt`, `/llms.txt` (AI-Übersicht), `/.well-known/ai.txt` (Spawning-Standard).

**Implementiert:** `apps/marketing/src/components/SeoHead.astro` + `apps/marketing/src/lib/seo.ts`.

---

## Änderungs-Historie

| Datum | Was | Trigger |
|-------|-----|---------|
| 2026-04-28 | Initial-Set D1–D10 | Aufsetzen `_admin/`, Bereinigung _source-Unklarheiten |
| 2026-04-28 | D11 SEO/AI-Crawler-Strategie | User-Anforderung "schemaorg ai und seo optimized" beim Marketing-Scaffold |

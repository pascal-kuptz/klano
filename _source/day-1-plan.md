# Day-1 Product Plan
## Klano — Senior PO Brief

> **Author:** Senior Product Owner
> **Brand:** Klano · **Domain:** klano.ai
> **Stand:** Tag 1, April 2026
> **Companion-Doc:** `master-plan.md` (Vision & Tech-Architektur)
> **Dieses Doc:** Was wir tun, in welcher Reihenfolge, mit welchen Zielen.

---

## 0. Mein Mandat als PO

Ich bin verantwortlich für:
- **Was** wir bauen (Scope, Priorisierung)
- **Warum** wir es bauen (Hypothesen, Metrics, User-Outcomes)
- **Wann** wir was launchen (Roadmap, Phasen-Gates)
- **Wie wir lernen** (Discovery, Beta, Iteration)

Ich bin **nicht** verantwortlich für:
- Tech-Architektur-Entscheidungen (Lead Engineer)
- Visuelles Design (Lead Designer / extern)
- Business-Strategie und Funding (Founder)

**Mein Glaubenssatz:** Wir bauen kein Produkt, wir bauen ein Lerngerät. Jede Woche müssen wir mehr wissen als die Woche davor — über User, Markt, Lösung.

---

## 1. Produkt-Hypothesen (was wir glauben, aber noch nicht wissen)

Das ist kritisch. Bevor wir bauen, müssen wir explizit machen, was wir annehmen. Jede Annahme ist ein Risiko.

### H1 — Pain ist real und wertschöpfend
> Hobby-Bands verbringen 3–8 Stunden/Woche mit Orga-Aufgaben, die der Bandleader allein trägt, und das nervt ihn so sehr, dass er **bereit ist, dafür zu zahlen**.

**Risiko:** Bands sind preissensibel. Das könnte ein Pain sein, den man kostenlos lösen will, nicht für 19 CHF/Monat.

**Validierung:** Diskussionen mit 15–20 Bandleadern. Frage nicht "Würdest du zahlen?" sondern "Was zahlst du heute schon für die Band, und wofür?"

### H2 — Der Agent-Wedge gewinnt
> Bands wechseln NICHT zu uns, weil wir bessere Datenbank-UI haben — sondern weil wir aktiv Arbeit für sie machen, die sie nicht selbst erledigt bekommen.

**Risiko:** "Agent" als Buzzword zieht erst, wenn der WOW-Moment echt ist. Wenn die Outreach-Mails generisch klingen, sind wir nur ein weiteres Tool.

**Validierung:** Erster Prototyp generiert echte Outreach-Mails. Wir zeigen sie 10 Bands → "Würdest du das senden?" → Ja/Nein-Quote messen.

### H3 — Bandleader bringen die Band mit
> Wenn der Bandleader sich registriert, lädt er die anderen Mitglieder ein und sie nutzen es passiv mit (Verfügbarkeiten, Erinnerungen, später Telegram).

**Risiko:** Andere Mitglieder ignorieren die Einladung, der Bandleader frustriert sich, churned.

**Validierung:** In Closed Beta tracken: Invite-Acceptance-Rate. Ziel: >60%.

### H4 — Venue-Datenbank ist der Burggraben
> Eine kuratierte DACH-Venue-Datenbank mit ~2000 Locations, die US-Konkurrenz nicht hat, ist unser nachhaltiger Vorteil im DACH-Markt.

**Risiko:** Pflege ist teuer. Daten veralten schnell. Konkurrenten könnten uns kopieren.

**Validierung:** Initial-Seed von 200 Venues kosten X Stunden manuelle Arbeit. Daraus extrapolieren.

### H5 — DACH-First lohnt sich
> Wir gewinnen einen kleinen, spitzen Markt schneller als einen großen, breiten — und expandieren später.

**Risiko:** DACH ist klein. Wenn TAM zu klein, lohnt es sich nicht. Schätzung: 50.000–80.000 aktive Hobby-/Semi-Pro-Bands in DACH.

**Validierung:** Marktrecherche, Branchenverbände kontaktieren (Deutscher Rockmusiker-Verband etc.).

---

## 2. Erfolgsmetriken (Was definiert Erfolg?)

### North Star Metric
**"Aktive Bands mit ≥1 versendeter Outreach-Mail in den letzten 14 Tagen"**

Warum: Misst echten Wert (nicht nur Sign-ups), echte Aktivität (nicht nur Login), und unser Kern-Versprechen (proaktives Booking).

### Phase 1 — Discovery & Validation (Wochen 1–4)
| KPI | Ziel |
|-----|------|
| Bandleader-Interviews durchgeführt | ≥15 |
| Verifizierte Pain-Points (Top 3 mit Zitaten) | 3 |
| Wartelisten-Sign-ups | ≥100 |
| Domain + Name finalisiert | ✅ Klano · klano.ai |

### Phase 2 — Closed Beta (Wochen 8–14)
| KPI | Ziel |
|-----|------|
| Aktive Beta-Bands | 15 |
| Bandleader → Mitglieder Invite-Rate | ≥60% |
| Erste Outreach-Mail innerhalb 24h nach Sign-up | ≥70% |
| Bands mit ≥1 echtem Booking aus Tool | ≥3 |
| NPS unter Beta-Bands | ≥30 |

### Phase 3 — Public Launch (ab Woche 16)
| KPI | Ziel |
|-----|------|
| Sign-ups/Woche | 50 |
| Free → Pro Conversion | ≥5% |
| Monthly Recurring Revenue (MRR) nach 3 Monaten | 2.500 CHF |
| Churn (monthly) | <8% |
| Aktive Bands (NSM) | 100 |

---

## 3. Phased Roadmap

### Phase 1: Discovery & Foundation (Wochen 1–4)
**Ziel:** Pain-Points verifizieren, Markenidentität, Marketing-Setup, Engineering-Foundation.

**Wir bauen:** Marketing-Landing mit Wartelisten-Form, Repo-Setup, Design-System-v0.
**Wir bauen NICHT:** Die App. Erst muss der Pain bestätigt sein.

**Owner-Zuteilung:**
- PO: Interviews, Wartelisten-Strategie, Hypothesen-Validierung
- Eng: Repo, Astro-Site, Resend-Setup, Supabase-Init
- Design: Brand-Identity, Landing-Page, erstes Design-System

### Phase 2: MVP Build (Wochen 5–10)
**Ziel:** Funktionsfähige App für Closed Beta.

**Wir bauen:**
- Onboarding-Wizard (sexy)
- Band-Setup + Member-Invite
- Verfügbarkeits-Modul
- Booking-Pipeline-UI (Status-Tracking)
- AI-Agent: Venue-Suche + Mail-Drafting
- Email-Pipeline (Outbound + Inbound)
- Stripe Test-Mode integriert (noch keine Live-Käufe)

**Wir bauen NICHT:**
- Telegram-Bot
- EPK-Generator
- Setlist-Builder
- Tour-Logistik
- Marktplatz-Features

### Phase 3: Closed Beta (Wochen 10–14)
**Ziel:** Mit echten Bands lernen, Bugs fixen, Pricing finalisieren.

**Was passiert:**
- 15 handverlesene Bands aus Netzwerk
- Wöchentliches 30-Min-Interview pro Band
- Slack-Channel für Beta-User
- Wir messen: Activation, Retention, Outreach-Erfolgsquote, NPS
- Stripe schalten wir LIVE in Woche 12 → erste echte Pro-Subscriptions

### Phase 4: Public Launch (Woche 16+)
**Ziel:** Skalieren auf 500+ Bands in 6 Monaten.

**Was passiert:**
- Product Hunt Launch
- Performance-Marketing (Meta, Google) DACH
- Content: Blog-Artikel "Wie buche ich als Indie-Band Venues" etc.
- Partnerships: Musikschulen, Proberaum-Anbieter, Equipment-Verleiher
- Referral-Programm (3 Monate gratis pro geworbene Band)

---

## 4. Wochen-für-Wochen-Plan (Wochen 1–4 detailliert)

### Woche 1 — "Talk to Humans"

**PO:**
- 15 Interview-Slots mit Bandleadern blocken (Netzwerk, Reddit r/Bands, Facebook-Gruppen, Bandcamp)
- Interview-Guide schreiben (siehe Anhang A)
- Wartelisten-Funnel definieren

**Eng:**
- GitHub-Org + Monorepo (Turborepo) aufsetzen
- Vercel-Account, Supabase-Projekt, Resend-Account, Stripe-Account erstellen
- **Domain klano.ai sofort registrieren** + klano.app/.io als Defensiv-Käufe

**Design:**
- Mood-Board: affinity.studio referenzieren plus Editorial-Magazine-Vibes (NYT, Pitchfork, Resident Advisor)
- Erste Brand-Richtungen entlang der finalen Direction (siehe `design-system.md`)

**Founder:**
- Schweizer Anwalt für DSG/AGB anfragen
- Steuerberater finden (CH-MwSt, EU-OSS)

**Output Woche 1:**
- Interview-Plan steht
- Repo + Infrastructure-Accounts da
- Marken-Richtung getestet

---

### Woche 2 — "Land the Brand"

**PO:**
- 5–7 Interviews durchgeführt + dokumentiert
- Top-Pain-Points clustern
- Landing-Page-Copy schreiben (DE + EN)

**Eng:**
- Astro-Marketing-Site Skeleton steht
- Resend für Wartelisten-Bestätigungs-Mails integriert
- Supabase-Schema v0 (users, bands, members, venues, bookings)

**Design:**
- Klano-Brand visualisieren: Logo, Typografie, Farben final
- Landing-Page-Design fertig (Hero, Pain-Section, Solution, Pricing-Preview, Wartelisten-Form)

**Founder:**
- Anwalt-Briefing inkl. Markenrecherche Klano
- Domain klano.ai bereits registriert

**Output Woche 2:**
- Brand steht
- Landing-Page kurz vor Launch

---

### Woche 3 — "Launch the Waitlist"

**PO:**
- Restliche 8–10 Interviews
- Synthesis: User-Personas, Pain-Map, Feature-Priorisierung
- Reddit-Posts vorbereiten (r/Bands, r/WeAreTheMusicMakers, deutsche Subreddits)
- Outreach an Musik-Newsletter (z.B. Backstage Pro, Musotalk) für PR

**Eng:**
- Landing-Page deployed
- Wartelisten-Form mit Resend-Integration live
- Supabase-RLS-Policies geschrieben
- Stripe-Tax + Products in Test-Mode konfiguriert

**Design:**
- Design-System-v0 in Tailwind-Tokens
- shadcn-Theming für Editorial-Look fertig (Fraunces + Geist, Acid-Buttons, Card-System)
- Erste App-Screens (Wireframes für Onboarding-Wizard)

**Founder:**
- Datenschutzerklärung + Impressum live
- AGB-Entwurf vom Anwalt

**Output Woche 3:**
- **MARKETING-SITE LIVE** mit Wartelisten-Form
- Erste Sign-ups kommen rein

---

### Woche 4 — "Validate or Pivot"

**PO:**
- Interview-Synthese fertig
- Hypothesen-Check: Welche bestätigt, welche kassiert?
- Sprint-Planning für Phase 2 (MVP-Build)
- **Phase Gate:** Wenn Wartelisten-Sign-ups <30 nach 2 Wochen Marketing → wir machen STOP und überdenken Positioning. Nicht weiterbauen.

**Eng:**
- Onboarding-Wizard Skelett (Routes, State-Machine)
- Auth-Flow (Magic Link via Supabase)
- AI-Agent-Sandbox-Repo: erster Prompt für Outreach-Generation, qualitatives Testing

**Design:**
- Onboarding-Wizard fertig designt (alle 7 Schritte)
- Dashboard-v0 designt (Booking-Pipeline, Empty-States)

**Founder:**
- Beta-User-Akquise: 15 Bands aus Netzwerk anschreiben
- Erstes Pricing-Modell mit Steuerberater verifizieren

**Output Woche 4:**
- Pain validiert oder Strategie justiert
- Beta-User-Pool definiert
- MVP-Build kann Woche 5 starten

---

## 5. Phase-Gates (kritische Entscheidungspunkte)

Ein Phase-Gate ist eine Stelle, an der wir entscheiden: **weitermachen, anpassen oder stoppen.**

### Gate 1: Ende Woche 4 — "Pain Validated?"
**Kriterium:**
- Mind. 12 von 15 Interviewten bestätigen die Top-3-Pains
- Mind. 50 Wartelisten-Sign-ups
- Mind. 5 Bands sagen explizit "Ja, dafür würde ich zahlen"

**Wenn JA:** Volle Kraft Richtung MVP-Build.
**Wenn NEIN:** Stop. Pivot zur Pain-Re-Discovery (anderer Markt? andere Persona? anderes Problem?).

### Gate 2: Ende Woche 10 — "MVP Demo-Ready?"
**Kriterium:**
- Onboarding-Wizard funktioniert end-to-end
- AI generiert Outreach-Mails, die Beta-Bands tatsächlich senden würden (≥7/10 sagen "ja")
- Email-Pipeline läuft (Outbound + Inbound testbar)

**Wenn JA:** Closed Beta starten.
**Wenn NEIN:** 2 Wochen Verlängerung, kein Feature-Creep.

### Gate 3: Ende Woche 14 — "Beta Successful?"
**Kriterium:**
- ≥3 Bands haben echte Bookings durch das Tool gewonnen
- NPS ≥30
- Mind. 5 Pro-Subscriptions (Stripe Live)
- Activation-Rate ≥70% (Sign-up → erste Outreach in <24h)

**Wenn JA:** Public Launch in Woche 16.
**Wenn NEIN:** Beta verlängern, Probleme fixen, Re-Test.

---

## 6. Rituale & Cadence

### Daily
- 15-Min Standup (Eng + PO + Design)
- Async Update in Slack/Linear

### Wöchentlich
- **Mo:** Sprint-Planning (1h, 2-Wochen-Sprints)
- **Mi:** PO Office Hours für Stakeholder
- **Fr:** Demo + Retro (1h, was funktioniert, was nicht)

### Zweiwöchentlich
- Beta-User-Interviews (ab Phase 3)
- Metrics-Review

### Monatlich
- Roadmap-Review mit Founder
- Hypothesen-Update (was haben wir gelernt?)

---

## 7. Was wir bewusst NICHT tun

Das ist genauso wichtig wie das, was wir tun.

- ❌ **Wir bauen kein Telegram-Bot in Phase 1.** Auch wenn es das geile Feature ist. Erst Web, dann Messenger. Sonst zerfasern wir.
- ❌ **Wir launchen nicht international.** DACH first, voll und ganz. EN-Sprach-Support nur für DACH-Bands mit englischen Outreach-Bedarfen.
- ❌ **Wir bauen keinen Marktplatz.** Phase 3+. Erst Bands begeistern, dann Venues onboarden.
- ❌ **Wir machen keine Cold-Outreach-Spam-Tools.** Outreach ist personalisiert, limitiert, bandseitig kontrolliert. Wir wollen kein Email-Reputation-Schaden.
- ❌ **Wir bauen keine Mobile-App.** Web-First, Mobile-Web responsive. Native App frühestens in 12 Monaten.
- ❌ **Wir bauen keinen eigenen Kalender / Setlist-Editor.** Wenn nötig, integrieren wir Google Cal. Eigene Komplexität nur wo unique value.
- ❌ **Wir bauen keine "AI Music Composer" oder "AI Lyric Generator" Features.** Nicht unser Job. Stick to organisational pain.

---

## 8. Team & Owner für Phase 1

| Rolle | Verantwortung | Min-Allokation |
|-------|---------------|----------------|
| Founder | Vision, Funding, Anwalt/Steuer, Beta-User-Akquise | 100% |
| Product Owner | Roadmap, Discovery, Specs, Metrics | 100% |
| Lead Engineer | Architektur, Coding-Lead, Code-Reviews | 100% |
| Designer | Brand, Design-System, UX | 60–80% |
| AI-Engineer (kann Lead Eng sein in Phase 1) | Agent-Logik, Prompts, Tool-Calling | 40% |

**Externe / Phase-spezifisch:**
- Schweizer Anwalt (Datenschutz, AGB) — Wochen 1–4
- Steuerberater (CH-MwSt, EU-OSS) — Wochen 1–4
- Texter DE/EN für Marketing-Copy — Wochen 2–3

---

## 9. Tech-Owner-Zuteilung (Phase 1+2)

| Bereich | Owner |
|---------|-------|
| Marketing-Site (Astro) | Eng + Designer |
| Web-App (Next.js) | Lead Eng |
| AI-Agent | AI-Eng / Lead Eng |
| Supabase Schema + RLS | Lead Eng |
| Stripe-Integration | Lead Eng |
| Email-Pipeline (Resend in/out) | Lead Eng |
| Onboarding-Wizard | Designer + Eng |
| Venue-Datenbank (Seeding) | PO + Founder (manuell) |
| Übersetzungen DE/EN | PO + externer Texter |

---

## 10. Definition of Done

Ein Feature ist "done", wenn:
1. Code merged in `main`
2. Tests grün (Unit + relevante E2E)
3. Stage-Deployment getestet
4. Designer hat visuelles QA durchgeführt
5. PO hat es selbst durchgespielt
6. Doku im internen Notion aktualisiert
7. Falls nutzer-sichtbar: Übersetzung DE+EN vorhanden

---

## 11. Risiken & Mitigation (PO-Sicht)

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Pain ist nicht groß genug zum Bezahlen | M | H | Phase-Gate 1 mit harten Kriterien |
| Email-Deliverability-Probleme | M | H | Früh testen, eigene Domain, langsam ramping |
| Venue-DB-Pflege wird zu teuer | M | M | Crowdsourcing Phase 3, evtl. Scraping mit Verifikation |
| Konkurrenz (Bandinq) zieht nach | H | M | Wedge sauber kommunizieren, Geschwindigkeit |
| Bands canceln nach 1–2 Monaten (Saisonalität) | H | M | Jahresplan-Rabatt, Pausierungs-Option |
| Schweizer Compliance-Fallstricke | M | H | Anwalt + Steuerberater von Tag 1 |
| Designer/Eng-Bandbreite | H | H | Klare Scope-Gates, NEIN-sagen-Kultur |

---

## 12. Open Questions für Founder

Diese Punkte müssen wir früh klären, bevor sie uns blocken:

1. **Funding-Runway:** Wie viele Monate können wir bauen, bevor erste Pro-Subscriptions Geld bringen müssen?
2. **Founder-Team:** Wer macht was? Sind wir CTO + CEO + ggf. Co-Founder?
3. ~~**Brand-Name:** Wann finalisieren wir?~~ ✅ Klano · klano.ai
4. **Gründungs-Vehikel:** GmbH Schweiz? Wann gegründet? (vor oder nach Beta?)
5. **Beta-Pool:** Hast du 15 Bands im Netzwerk? Wenn nicht, wie akquirieren wir?
6. **Buy-in für "weniger ist mehr":** Halten wir die Disziplin durch, in Phase 1 keine Side-Features zu bauen?

---

## Anhang A — Interview-Guide (Wochen 1–3)

**Setting:** 30 Min, Video-Call, Aufzeichnung mit Einwilligung.

**Don't ask:** "Würdest du dafür zahlen?" → führt zu Lügen aus Höflichkeit
**Do ask:** Erinnerungen an konkrete Vergangenheit

### Aufbau:

**Warmup (3 Min)**
- Erzähl mir von deiner Band. Wie lange? Wie viele? Was für Musik?

**Status Quo (10 Min)**
- Wer macht in eurer Band die Orga? Buchungen, Termine, Kommunikation mit Venues?
- Beschreib mir die letzte Woche, in der du Band-Orga gemacht hast. Was genau?
- Wie viele Stunden waren das?
- Was war der nervigste Moment?

**Tools (5 Min)**
- Welche Tools nutzt ihr aktuell? (WhatsApp, Excel, Google Calendar, ...)
- Habt ihr schon mal was anderes probiert? Warum gewechselt?
- Wofür gebt ihr als Band heute Geld aus? (Proberaum, Equipment, Marketing, Tools, ...)

**Booking konkret (8 Min)**
- Wie habt ihr eure letzten 3 Gigs gebucht?
- Wie viele Mails habt ihr für einen Gig geschrieben?
- Was ist der größte Frust dabei?

**Solution-Test (3 Min)**
- (Kurz Idee skizzieren — 2 Sätze maximal)
- Erste Reaktion?
- Was würde dich davon abhalten, das zu nutzen?

**Wrap (1 Min)**
- Wer in deinem Umfeld hätte das gleiche Problem? (Snowball-Sampling)
- Darf ich dich in 4 Wochen nochmal kontaktieren für einen Demo-Test?

---

## Anhang B — Erste 100 Wartelisten-Sign-ups: Akquisitionsplan

1. **Persönliches Netzwerk:** 20 Sign-ups (LinkedIn, Telefon, direkte Mail)
2. **Reddit:** r/WeAreTheMusicMakers, r/Bands, r/IndieMusicFeedback — jeweils 1 Post mit Story (nicht promo). Ziel: 30 Sign-ups
3. **Facebook-Gruppen DACH:** "Musiker gesucht Berlin/München/Hamburg/Wien/Zürich" — jeweils 1 Post. Ziel: 25 Sign-ups
4. **Bandcamp/Spotify Indie-Bands:** 50 manuelle DMs an aktive DACH-Indie-Bands. Ziel: 10 Sign-ups
5. **Musik-Newsletter:** 3 PR-Mails an Backstage Pro, Musotalk, Rocknet → 1 Erwähnung. Ziel: 15 Sign-ups

**Gesamt-Ziel:** 100 in Wochen 3–4.

---

## Anhang C — Erste Sprint-Plan-Vorlage (Woche 5)

```
SPRINT 1 — MVP Build Start
Dauer: 2 Wochen (Wochen 5-6)
Ziel: Onboarding-Wizard + Auth + Band-Setup funktional

Stories:
[ENG] Magic-Link-Auth via Supabase (S, 2d)
[ENG] Onboarding-Wizard Schritte 1-3 (M, 4d)
[ENG] Onboarding-Wizard Schritte 4-7 (M, 4d)
[ENG] Band-Member-Invitation-Flow (S, 2d)
[ENG] Empty-State-Dashboard (S, 2d)
[DESIGN] Onboarding visuelle QA + Polish (3d)
[PO] Beta-User-Onboarding-Doc (1d)
[PO] Sprint-Demo + Retro vorbereiten (1d)

Risk: AI-Tool-Calling-Komplexität → buffer 20%
```

---

> **Schlusswort vom PO:**
> Wir bauen ein lebendiges Produkt für lebendige Menschen. Diszipliniert, aber nicht steif. Ambitioniert, aber nicht naiv. Jede Woche müssen wir mehr wissen — über Bands, über uns, über das Problem. Wenn wir das schaffen, entsteht etwas, das echten Wert schafft.
>
> *Let's go build it.*

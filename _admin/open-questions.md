# Open Questions

Offene Punkte, die wir nicht selbst entscheiden können oder die externes Input brauchen. Nach Auflösung in `decisions.md` übertragen und hier archivieren.

## Founder

### Q-F1 — Funding-Runway
Wie viele Monate können wir bauen, bevor erste Pro-Subscriptions Geld bringen müssen?
- **Status:** offen
- **Quelle:** day-1-plan.md §12.1
- **Blockiert:** Pricing-Aggressivität, Beta-Length-Entscheidung

### Q-F2 — Gründungs-Vehikel
GmbH Schweiz? Wann gegründet? (vor oder nach Beta?)
- **Status:** offen
- **Quelle:** day-1-plan.md §12.4
- **Blockiert:** Stripe-Account-Eröffnung (privat vs. juristisch), MwSt-Anmeldung

### Q-F3 — Beta-Pool
15 Bands aus Netzwerk vorhanden? Falls nein, Akquise-Plan?
- **Status:** offen
- **Quelle:** day-1-plan.md §12.5
- **Blockiert:** Wochen-10-Closed-Beta-Start

### Q-F4 — Team-Setup
Lead Engineer = wer? Designer = intern oder extern? AI-Eng = Lead Eng oder separat?
- **Status:** offen
- **Quelle:** day-1-plan.md §8
- **Blockiert:** Allokationsplanung Phase 1

## Legal / Steuern

### Q-L1 — Schweizer Anwalt für DSG/AGB
Beauftragen + Markenrecherche Klano (DPMA, EUIPO, IGE).
- **Status:** offen
- **Quelle:** master-plan.md §17 Naming, day-1-plan.md Wochen-1
- **Blockiert:** AGB live, Datenschutzerklärung-Final, Markenname-Final

### Q-L2 — Steuerberater CH-MwSt + EU-OSS
Wer? Wann erstes Briefing?
- **Status:** offen
- **Quelle:** master-plan.md §15, day-1-plan.md Wochen-1
- **Blockiert:** Stripe-Tax-Konfiguration produktiv

### Q-L3 — Konflikt Klano Wheelchairs (USA)
master-plan §17 sagt "andere Nizza-Klasse, keine Überschneidung". Anwalt-Verifikation steht aus.
- **Status:** offen
- **Blockiert:** Domain-Investitionen über `klano.ai` hinaus, Markenanmeldung

## Engineering / Design

### Q-E1 — Storybook ab wann?
design-system.md fordert Storybook in `packages/ui` ab Tag 1, build-plan-v0 erwähnt es nicht.
- **Status:** offen — Vorschlag: ab v0.4 (Komponenten-Reuse-Schwelle)
- **Quelle:** clarifications.md C12
- **Blockiert:** nichts kritisch, nur Tooling-Decision

### Q-E2 — MapLibre-Region-GeoJSON DACH
Woher die GeoJSON-Daten für CH/DE/AT-Regionen? OpenStreetMap-Boundaries selbst extrahieren oder fertige Quelle?
- **Status:** offen
- **Quelle:** build-plan-v0.md §4 Onboarding Schritt 3
- **Blockiert:** v0.3 Onboarding Schritt 3

### Q-E3 — Helicone vs. Langfuse
build-plan-v0 §6 nennt beide als Optionen. Welches Tool?
- **Status:** offen — Vorschlag: **Langfuse** (Open-Source, self-hostable, DSG-freundlicher)
- **Quelle:** build-plan-v0.md §6 Tech-Tabelle
- **Blockiert:** v0.5 AI-Agent-Setup

## Marketing / Content

### Q-M1 — Wartelisten-Akquise: wer treibt?
day-1-plan.md Anhang B listet 5 Kanäle (Reddit, Facebook, Bandcamp DMs, PR). Wer macht was?
- **Status:** offen
- **Blockiert:** Wochen 3–4 Wartelisten-Ziel 100

### Q-M2 — DACH-Venue-Datenbank Initial-Seed
~500 Venues manuell. Wer kuratiert? Daten-Quellen?
- **Status:** offen — Vorschlag: AI-assistiert via Web-Research + manueller Verifikation
- **Quelle:** master-plan.md §18.6, build-plan-v0.md §6 Q3-Roadmap

---

## Archiv (gelöste Fragen)

_Noch leer._

# Next Steps

Aktuell anstehende, konkrete Tasks. Nach Erledigung → `progress-log.md` und hier streichen.

> **Reihenfolge:** Top-down = Priorität.

## Sofort (diese Woche)

1. **Greenlight für Tag-1-Repo-Scaffolding** (Pascal entscheiden)
   - Optionen: (a) jetzt lokal starten ohne GitHub-Remote, (b) erst GitHub-Org `klano-ai` + Repo anlegen, dann scaffolden
   - Blockiert: alles Engineering

2. **Domain `klano.ai` registrieren** + defensiv `klano.app`, `klano.io`
   - Blocker: keine — sofort machbar
   - Verantwortlich: Founder

3. **Anwalt-Briefing Markenrecherche Klano** (Q-L1, Q-L3)
   - Verantwortlich: Founder
   - Output: schriftliche Marken-Clearance-Bestätigung

4. **Bandleader-Interviews terminieren** (Ziel: 15 Slots in 2 Wochen)
   - Verantwortlich: PO (oder Founder bis PO bestätigt)
   - Quelle: day-1-plan.md Anhang A Interview-Guide

## Kurzfristig (Wochen 2–3)

5. **Supabase-Projekt anlegen** (EU-Frankfurt)
6. **Resend-Account** + Domain-Verifikation `hello.klano.ai` (DNS-Records SPF/DKIM/DMARC)
7. **Vercel-Projekte** anlegen (`klano-marketing`, `klano-web`)
8. **Stripe-Account** (Test-Mode, später Live nach Q-F2)
9. **Marketing-Site v0.1** Skeleton + Wartelisten-Form (Astro)

## Open Questions auflösen

Siehe [open-questions.md](open-questions.md). Für Engineering-Velocity besonders dringend:
- Q-F4 (Team-Setup)
- Q-E2 (DACH-GeoJSON)
- Q-E3 (Helicone vs. Langfuse — Vorschlag Langfuse)

---

## Definition of "Done" für Tag-1-Foundation (v0)

Aus build-plan-v0.md §1.5, hier verkürzt als Checkliste:

- [ ] Monorepo-Skelett (`pnpm-workspace.yaml`, `turbo.json`)
- [ ] `apps/marketing` (Astro) startet lokal
- [ ] `apps/web` (Next.js) startet lokal
- [ ] `packages/{ui,db,agent,email,i18n,config}` Stubs
- [ ] Biome konfiguriert, Tailwind v4 in beiden Apps
- [ ] shadcn/ui in `packages/ui` initialisiert
- [ ] Supabase lokal via Docker erreichbar
- [ ] Vercel Preview-Deploy beider Apps grün
- [ ] CI Workflow (lint+typecheck+build) grün
- [ ] README mit Setup-Anleitung

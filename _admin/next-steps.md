# Next Steps

Aktuell anstehende, konkrete Tasks. Nach Erledigung → `progress-log.md` und hier streichen.

> **Reihenfolge:** Top-down = Priorität.

## Sofort — Auth lokal aufschalten

Schema + Auth-Pipeline sind aufgesetzt aber noch nicht connected. Damit Sign-in real funktioniert:

1. **Supabase CLI lokal starten** (Docker muss laufen)
   ```bash
   pnpm dlx supabase --version          # prüft installation
   pnpm dlx supabase start              # spinnt Postgres + GoTrue + Studio + Inbucket auf
   ```
   Gibt dir `API URL`, `anon key`, `service_role key`.

2. **`apps/web/.env.local` anlegen** (von `.env.example` kopieren), mit den Werten aus Schritt 1 füllen:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<aus supabase status>
   ```

3. **Migrations + Seed anwenden**
   ```bash
   pnpm dlx supabase db reset           # läuft 0001/0002/0003 + seed.sql
   ```

4. **TS-Types regenerieren** (überschreibt Placeholder)
   ```bash
   pnpm --filter @klano/db gen-types
   ```

5. **Sign-in testen:** http://localhost:3000/sign-in eintragen → Inbucket UI auf http://localhost:54324 → Magic-Link klicken → landet auf `/dashboard`.

## Kurzfristig

6. **Domain `klano.ai` registrieren** + defensiv `klano.app`, `klano.io`
7. **Cloud-Supabase-Projekt** unter [supabase.com](https://supabase.com), EU-Frankfurt — production
8. **Resend-Account** + Domain-Verifikation `hello.klano.ai` (DNS: SPF, DKIM, DMARC)
9. **Vercel-Projekte** (`klano-marketing`, `klano-web`) — Preview-Deployments
10. **Anwalt-Briefing** Markenrecherche Klano + DSG/AGB (Q-L1, Q-L3)

## Mittelfristig — v0.3 Onboarding-Wizard

Nach Auth läuft, kommt der 7-Schritt-Onboarding-Wizard (siehe build-plan-v0 §4):
- Schritt 1 Welcome
- Schritt 2 Band-Basics (Name, Logo-Upload, Genre, Bandgröße 3–8)
- Schritt 3 Geografie (MapLibre-Karte CH/DE/AT)
- Schritt 4 Anspruch (Hobby/Semi-Pro/Pro)
- Schritt 5 Mitglieder einladen (1–7 Emails — D5)
- Schritt 6 WOW-Moment (3 echte Venue-Vorschläge)
- Schritt 7 Erste Outreach (Mail-Draft via Claude)

Das wird der nächste größere Sprint nach Auth-Verification.

## Open Questions

Siehe [open-questions.md](open-questions.md). Für die nächsten zwei Wochen kritisch:
- Q-F2 (Gründungs-Vehikel — blockiert Stripe-Live)
- Q-L1 (Anwalt — Marken-Clearance + AGB)
- Q-E2 (DACH-GeoJSON — für Onboarding Step 3)
- Q-E3 (Helicone vs. Langfuse — Vorschlag Langfuse)

---

## Definition of "Done" für v0.2 Auth (Schema + Wiring)

- [x] Supabase Migrations 0001/0002/0003 geschrieben
- [x] RLS-Policies komplett, Helper-Funktionen für `is_band_*`
- [x] Triggers: `updated_at`, `handle_new_user`, owner-as-leader-Invariante, owner-removal-Schutz
- [x] `packages/db` mit typed Server- und Browser-Clients
- [x] `apps/web` Middleware + Callback + Sign-out
- [x] SignInForm wired an echtes `signInWithOtp`
- [x] Sidebar zeigt eingeloggten User
- [x] Build grün
- [ ] **Mit echtem Supabase getestet** (Schritt 1–5 oben)
- [ ] DB-Types via `gen-types` regeneriert

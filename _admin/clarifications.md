# Clarifications — _source/

Liste der gefundenen Unklarheiten/Inkonsistenzen in `_source/` und ihre Auflösung. Jede Resolution verweist auf eine Decision in [decisions.md](decisions.md), wo eine getroffen wurde.

## C1 — `banddings.com` Altname-Leak

**Fund:** master-plan.md:124, 125, 359, 367 referenzieren noch die alte Domain `banddings.com`.

**Auflösung:** Decision **D1**. Direkt in master-plan.md gefixt am 2026-04-28.

## C2 — Jährlicher Pricing-Rabatt: 12% vs. 17%

**Fund:**
- master-plan.md:227 → "190 CHF, ca. 17% Rabatt"
- build-plan-v0.md:772 → "190 CHF/Jahr (12% Rabatt)"

**Auflösung:** Decision **D3**. Korrekt ist ~17% (Rechnung: 190 / (12 × 19) ≈ 0.833). build-plan-v0.md:772 gefixt.

## C3 — LLM-Modell-Auswahl unscharf

**Fund:**
- master-plan.md:116 → "Vercel AI SDK + Claude/OpenAI"
- build-plan-v0.md:599 → "Anthropic Claude (Sonnet 4.7 oder Opus 4.7)"
- day-1-plan.md → keine Angabe

**Auflösung:** Decision **D2**. Default Sonnet 4.6, Eskalation zu Opus 4.7 nur wenn Quality-Gate scheitert.

## C4 — Owner vs. Leader Rolle unklar

**Fund:**
- master-plan.md schema: `bands.owner_user_id` (single)
- build-plan-v0.md schema: `band_members.role ∈ {leader, member}` (multi)
- Keine Angabe was passiert, wenn Owner Band verlässt; ob mehrere `leader` erlaubt sind.

**Auflösung:** Decision **D4**. Owner=1 (DB-Constraint), Leader=multi, Owner immer auch Leader, Auto-Promotion bei Owner-Verlassen.

## C5 — Bandgröße & Member-Limit-Konflikt

**Fund:**
- master-plan.md §11 Schritt 5: "max. 5 auf einmal"
- build-plan-v0.md §4.5: "1–4 Email-Eingaben"
- build-plan-v0.md §1 Bandgröße-Stepper: "3–8"
- build-plan-v0.md §8 Free-Limit: "4 Bandmitglieder"

→ Wenn Band 8 hat, blockt Free-Tier ab Mitglied 5? Inkonsistent.

**Auflösung:** Decision **D5**. Stepper 3–8, Invites bis zu 7 in einem Rutsch, Free-Limit 6 Mitglieder.

## C6 — Inbound-Mail-Provider: Resend vs. Cloudflare

**Fund:**
- master-plan.md:362 → "Resend Inbound (oder Cloudflare Email Routing)"
- build-plan-v0.md:728 → "MX-Records für `inbound.klano.ai` zeigen auf Resend"

**Auflösung:** Decision **D6**. Resend Inbound. master-plan.md "oder Cloudflare" gestrichen.

## C7 — Outbound-Mail von User-Konto vs. zentral

**Fund:**
- master-plan.md:369 → "Anfangs: Mail wird vom User gesendet (über sein Mail-Konto via Gmail/Outlook OAuth), erst später zentral"
- build-plan-v0.md §7 → komplett zentrale Resend-Pipeline ab v0.6

**Auflösung:** Decision **D6**. Phase 1 = zentral via Resend (`hello.klano.ai`). Per-User-OAuth verschoben auf Phase 2 nach Public Launch.

## C8 — Telegram-Bot in v1.0 oder Phase 2?

**Fund:**
- master-plan.md §16 Q4 2026 "Public Launch" listet "Telegram-Bot-Integration"
- day-1-plan.md §7: "Wir bauen kein Telegram-Bot in Phase 1"
- build-plan-v0.md v1.0-Scope: kein Telegram

**Auflösung:** Decision **D7**. Telegram explizit OUT für v1.0, frühestens 3 Monate nach Public Launch.

## C9 — Confetti: NICHT vs. JA

**Fund:**
- design-system.md:796 → "❌ Confetti-Spam. Erfolgs-Moments sind selten und gewichtig."
- build-plan-v0.md:479 → "Confetti-Animation (subtil)"

**Auflösung:** Decision **D8**. Genau **eine** subtile Single-Burst-Confetti am Ende des Onboarding-Wizards. Sonst nirgends.

## C10 — Roadmap-Quartale vs. Wochen

**Fund:**
- master-plan.md §16 → "Q2 2026 — Foundation (8 Wochen)" / "Q3 2026 — MVP (6 Wochen)" / "Q3 2026 — Closed Beta"
- build-plan-v0.md → Wochen 1–16
- day-1-plan.md → Phasen 1–4 mit eigener Wochenzählung

→ Q3 2026 enthält im master-plan zwei sich überlappende Phasen.

**Auflösung:** Decision **D9**. Build-Plan-Wochen sind die operative Wahrheit. Quartals-Aussagen im master-plan dienen nur für externe Kommunikation und sind grob.

## C11 — `--src-dir=false` mit `@/*` Path-Alias

**Fund:** build-plan-v0.md §14 Tag-1-Befehl:
```
pnpm dlx create-next-app@latest web --app --typescript --tailwind --eslint=false --src-dir=false --import-alias="@/*"
```
→ Ohne `src/`-Ordner wirkt Alias `@/*` direkt auf Repo-Root des Apps. Konvention.

**Auflösung:** Beibehalten, dokumentiert. Kein Konflikt, nur Erinnerung.

## C12 — Storybook nicht in Tech-Stack

**Fund:** design-system.md §15 Punkt 5 fordert Storybook in `packages/ui`, build-plan-v0.md erwähnt Storybook nicht.

**Auflösung:** **Pending Decision**. Eintrag in [open-questions.md](open-questions.md). Vorschlag: Storybook ab v0.4 wenn Komponenten-Library wächst, vor v0.4 nicht nötig.

---

## Änderungs-Historie

| Datum | Was |
|-------|-----|
| 2026-04-28 | Initial-Set C1–C12 erstellt; C1, C2, C6 direkt in `_source/` gefixt. |

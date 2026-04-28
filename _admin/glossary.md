# Glossary

Klano-spezifische Begriffe und ihre exakte Bedeutung. Bei Unsicherheit hier nachschlagen.

| Begriff | Bedeutung |
|---------|-----------|
| **Band** | Tenant. Ein User kann in mehreren Bands sein. Subscription hängt an der Band. |
| **Owner** | Genau **eine** Person pro Band, hat Stripe-Subscription-Hoheit. DB-Constraint via `bands.owner_user_id`. |
| **Leader** | `band_members.role = 'leader'`. Mehrere möglich. Owner ist immer Leader. Leader können Outreach senden, Members einladen. |
| **Member** | `band_members.role = 'member'`. Lesen + Verfügbarkeiten pflegen, kein Outreach-Senden in v1.0. |
| **Booking** | Anbahnungs-Datensatz Band ↔ Venue. Lebenszyklus: `drafted → sent → opened → replied → negotiating → booked / declined / no_response / archived`. |
| **Outreach** | Erste Kontakt-Mail Band → Venue, vom AI-Agent gedraftet. |
| **Follow-up** | Automatisierte Nachhak-Mail nach 7d (`follow_up_1`) und 14d (`follow_up_2`). Nach 21d ohne Reply → Status `no_response`. |
| **Agent** | Der KI-Bandkollege. Vercel AI SDK + Claude Sonnet 4.6 (Default). Tool-Calling über `packages/agent`. |
| **Wizard** | Editorial-Onboarding, 7 Schritte, Vollbild, mobile-first. Ende = erste Outreach gesendet. |
| **Wow-Moment** | Wizard Schritt 6: 3 echte Venue-Vorschläge nach 3-Sek-Loading. Aktivierungs-Trigger. |
| **Cream-Pause** | Helle (`#F2EEE6`) Editorial-Section, max. 1–2 pro Page, bricht Dark-Canvas für Quote/Manifest. |
| **Acid** | Primär-Akzent `#C5F25C`. CTAs, Brand-Heart-Beat. |
| **Coral** | Sekundär-Akzent `#FF5C39`. Logo-Pulse, Italic-Highlights. |
| **k-Mark** | Single-Letter-Logo "k" in Fraunces Italic, WONK 1, SOFT 100. |
| **Wordmark** | Volles "klano" — nur als Mega-Footer-Statement. |
| **DACH** | Deutschland + Österreich + Schweiz. Erstmarkt. `bands.country ∈ {CH, DE, AT}`. |
| **Free-Tier** | Permanent kostenlos, 6 Members, 10 Outreach/Monat, 5 AI-Mails, 20 Venue-Suggestions, keine Auto-Follow-ups. |
| **Pro-Tier** | 19 CHF/EUR/USD pro Monat oder 190/Jahr, alle Limits aufgehoben. 14d Trial ohne Karte. |
| **NSM** | North Star Metric: "Aktive Bands mit ≥1 versendeter Outreach-Mail in den letzten 14 Tagen". |
| **Phase-Gate** | Harte Entscheidungsstelle (Wochen 4, 10, 14): weiter / anpassen / stoppen. |

# _admin — Living Project Docs

Hier liegen die **lebenden** Dokumente für Klano. `_source/` ist die ursprüngliche Vision (Master-Plan, Day-1, Build-Plan, Design-System, Demo). `_admin/` ist die laufend aktualisierte Arbeitsschicht darüber.

## Konvention

- `_source/` = Strategie & Spec, wird selten editiert (nur Bereinigungen mit Eintrag in `clarifications.md`).
- `_admin/` = Tagesgeschäft. Hier wird laufend gepflegt.
- Bei Konflikt: **`_admin/decisions.md` schlägt `_source/`.**

## Inhalt

| Datei | Zweck | Update-Frequenz |
|-------|-------|-----------------|
| [decisions.md](decisions.md) | Kanonische Entscheidungen — Single Source of Truth, überschreibt _source bei Widersprüchen | bei jeder Entscheidung |
| [clarifications.md](clarifications.md) | Liste der gefundenen Unklarheiten in `_source/` + getroffene Auflösungen | initial befüllt, bei neuen Funden ergänzt |
| [open-questions.md](open-questions.md) | Offene Fragen (Founder, Anwalt, Steuerberater, Beta-User) | wöchentlich |
| [progress-log.md](progress-log.md) | Chronologisches Logbuch — was wurde wann gemacht | nach jeder Session |
| [next-steps.md](next-steps.md) | Aktuell anstehende Tasks (kurzfristig, konkret) | nach jeder Session |
| [glossary.md](glossary.md) | Klano-Terminologie (Band, Booking, Outreach etc.) | bei neuen Begriffen |

## Workflow

1. Neue Session → `progress-log.md` Eintrag anlegen
2. Entscheidungen → in `decisions.md` aufnehmen, ggf. Cross-Ref zu `_source/`
3. Unklarheiten gefunden → `clarifications.md` ergänzen
4. Blocker/Frage an Founder → `open-questions.md`
5. Konkrete Tasks → `next-steps.md`

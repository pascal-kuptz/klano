# Klano — Design System v1.0
## Neutral · Studio · Sans-only

> **Status:** v1.0 — neuer Reset (2026-04-28). Ersetzt v0.3 (Editorial/Affinity-Direction).
> **Brand:** Klano · **Domain:** klano.ai
> **Reference:** [suno.com](https://suno.com) — clean, neutral, modern AI/tool aesthetic.
> **Companion:** `master-plan.md`, `build-plan-v0.md`

---

## 1. Direction

Klano ist ein **Werkzeug**, kein Magazin. Kein Editorial-Vibe, kein Mixed-Type, keine Italic-Display, keine dunklen Cream-Pause-Sections. Die Site sieht aus wie eine moderne, ruhige AI/Tooling-Site (Suno, Linear, Cursor, Vercel) — **hell, neutral, single-sans, viel Weißraum**.

**Designprinzipien:**
1. **Hell by default.** Light Theme als Primärerlebnis. Dark Mode optional, später, dezent invertiert (kein eigenes Statement).
2. **Single Typeface.** Geist Variable für alles — Headlines, Body, UI, Numbers. Geist Mono nur für Code/Codes.
3. **Schwarz/Weiß-Disziplin.** Primary Action ist schwarz auf weiß. Accent-Farben gibt es nicht. Status-Farben (success/warning/danger/info) sind Utility, kein Brand-Element.
4. **Generöser Weißraum.** Sections atmen 96–160px vertikal. Cards haben großzügiges Padding.
5. **Pill-Buttons.** Vollständig abgerundet (border-radius: 9999px). Suno-Standard.
6. **Cards sind sanft.** Weiß auf Canvas, 1px-Border in #E4E4E7, Radius 20px. Kein Schatten at-rest, leichter Hover-Schatten.
7. **Keine Editorial-Moves.** Kein Marquee, keine Cream-Pause-Sections, keine Italic-em im Display, keine Mixed-Type, kein Wordmark-XL, kein Track-Marker-Gimmick.
8. **Mobile-first.** 375px zuerst designen.

---

## 2. Color Tokens

### Surfaces

```css
--klano-canvas:       #FAFAFA;  /* Page background */
--klano-surface:      #FFFFFF;  /* Cards, elevated surfaces */
--klano-surface-2:    #F4F4F5;  /* Section alt bg, hover states */
--klano-border:       #E4E4E7;  /* Default 1px border */
--klano-border-strong:#D4D4D8;  /* Hover/focus border */
```

### Text

```css
--klano-text:         #0A0A0A;  /* Primary text, headlines */
--klano-text-2:       #52525B;  /* Secondary, body sub */
--klano-text-3:       #A1A1AA;  /* Tertiary, captions, meta */
```

### Action

```css
--klano-action:       #0A0A0A;  /* Primary CTA bg */
--klano-action-fg:    #FFFFFF;  /* Primary CTA text */
--klano-action-hover: #18181B;  /* Hover state */
```

### State (utility — small badges, dots, never section bg)

```css
--klano-success: #10B981;
--klano-warning: #F59E0B;
--klano-danger:  #EF4444;
--klano-info:    #3B82F6;
```

### Dark Mode (Phase 2 — invertiert, keine neuen Akzente)

```css
[data-theme='dark'] {
  --klano-canvas:    #0A0A0A;
  --klano-surface:   #18181B;
  --klano-surface-2: #27272A;
  --klano-border:    #27272A;
  --klano-border-strong: #3F3F46;
  --klano-text:      #FAFAFA;
  --klano-text-2:    #A1A1AA;
  --klano-text-3:    #71717A;
  --klano-action:    #FAFAFA;
  --klano-action-fg: #0A0A0A;
}
```

---

## 3. Typography

### Stack

| Rolle | Font | Anwendung |
|-------|------|-----------|
| Display | **Instrument Serif** (400 + 400 italic) | **Nur** Hero-Display + h1 |
| Sans | **Inter Variable** (300–800) | h2 abwärts, Body, UI, Buttons, alles UI-Text |
| Mono | **Geist Mono Variable** (400–500) | Code, Klano-IDs, technische Meta-Labels |

**Disziplin (kritisch — sonst rutschen wir zurück Richtung Editorial):**
- Instrument Serif **ausschließlich für Display + h1**. Niemals h2 oder darunter.
- **Keine `<em>`-Italic-Emphasis innerhalb von Display-Headlines.** Display ist eine Stimme, nicht zwei.
- **Keine Mixed-Type innerhalb eines Headings.** Eine Schrift pro Element.
- Tagline darf Instrument Serif Italic verwenden — als eigenständiges Element, nicht eingestreut.

### Scale

```css
--text-display: clamp(2.75rem, 7vw, 5rem);    /* 44–80px — Hero only */
--text-h1:      clamp(2rem, 4vw, 3rem);       /* 32–48px — Section heading */
--text-h2:      clamp(1.5rem, 2.5vw, 2rem);   /* 24–32px — Subsection */
--text-h3:      1.25rem;                       /* 20px — Card title */
--text-body-lg: 1.125rem;                      /* 18px — Hero subtitle, lede */
--text-body:    1rem;                          /* 16px — Default */
--text-sm:      0.875rem;                      /* 14px — Meta */
--text-xs:      0.75rem;                       /* 12px — Caption, mono labels */
```

### Weights & Tracking

- Headlines: weight **700**, letter-spacing **-0.03em** bis **-0.04em** (tight)
- Body: weight **400**, letter-spacing **-0.005em**
- Buttons: weight **500–600**, letter-spacing **-0.01em**
- Mono: weight **500**, letter-spacing **0.04em**, lowercase oder uppercase je nach Kontext

### Line-Height

- Display: **1.05**
- Headlines: **1.1**
- Body: **1.55**
- Compact UI: **1.4**

---

## 4. Spacing

4px-Grid. Skala identisch zu Tailwind-Defaults (1=4px, 2=8px, 4=16px, 6=24px, 8=32px, 12=48px, 16=64px, 20=80px, 24=96px, 32=128px).

**Section-Padding (vertical):**
- Mobile: 80–96px
- Desktop: 128–160px

**Container:**
- max-width 1200px (etwas schmaler als v0.3)
- Padding horizontal: 16px mobile, 32px tablet, 48px desktop

---

## 5. Radius

```css
--radius-sm:   6px;     /* Inputs sm, badges */
--radius-md:   10px;    /* Inputs */
--radius-lg:   14px;    /* Small buttons, hover-cards */
--radius-xl:   20px;    /* Cards (default) */
--radius-2xl:  28px;    /* Large feature cards */
--radius-full: 9999px;  /* Pill buttons */
```

**Buttons sind Pills** (full radius). Cards sind 20px. Inputs 10px.

---

## 6. Components

### Button — Primary (Pill)

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  h-12 px-6
  bg-klano-action text-klano-action-fg
  rounded-full
  font-medium text-sm tracking-tight
  transition-colors duration-150
  hover:bg-klano-action-hover
">
  Get early access
</button>
```

### Button — Secondary (Pill, transparent)

```tsx
<button className="
  inline-flex items-center justify-center gap-2
  h-12 px-6
  bg-transparent text-klano-text
  border border-klano-border
  rounded-full
  font-medium text-sm
  transition-colors duration-150
  hover:bg-klano-surface-2 hover:border-klano-border-strong
">
  How it works
</button>
```

### Card

```tsx
<article className="
  bg-klano-surface
  border border-klano-border
  rounded-[20px]
  p-8
  transition-all duration-200
  hover:border-klano-border-strong
">
  ...
</article>
```

### Input

```tsx
<input className="
  h-12 px-4
  bg-klano-surface
  border border-klano-border
  rounded-[10px]
  text-klano-text placeholder:text-klano-text-3
  font-sans text-base
  outline-none
  transition-colors
  focus:border-klano-action
" />
```

### Logo / Wordmark

Reines Sans-Wordmark **klano** in Geist Bold, schwarz auf weiß. Kein Single-Letter-Mark, kein Italic, kein Coral-Pulse-Dot. Bei Bedarf zusätzlich ein kleines Symbol — derzeit nur das Wordmark.

```tsx
<a href="/" className="font-sans font-bold text-xl tracking-tight text-klano-text">
  klano
</a>
```

---

## 7. Motion

Sparsam. Kein GSAP-Hero-Choreografie, keine Word-by-Word-Rises, keine Variable-Font-Morphs.

- **Durations:** 120–250ms für Micro-Interactions (Hover, Active)
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out, neutral)
- **Reveal-on-Scroll:** sanftes Fade-Up (opacity 0→1, translateY 8px → 0), 400ms
- **Reduced-Motion:** alles deaktivieren

---

## 8. Iconography & Imagery

- **Lucide React** als Icon-Library
- **Stroke-Width 1.5** (default)
- Icons sind `--klano-text-2` (sekundär), niemals farbig
- **Imagery:** Werkzeug-Mockups (App-Screens), keine Stockfotos, keine Bandfotos in v1
- **Mockups in Cards:** echte UI-Snapshots oder pixel-genaue Mocks, light-theme-konsistent

---

## 9. Tailwind Theme Tokens

```css
@theme {
  --color-klano-canvas:        #FAFAFA;
  --color-klano-surface:       #FFFFFF;
  --color-klano-surface-2:     #F4F4F5;
  --color-klano-border:        #E4E4E7;
  --color-klano-border-strong: #D4D4D8;
  --color-klano-text:          #0A0A0A;
  --color-klano-text-2:        #52525B;
  --color-klano-text-3:        #A1A1AA;
  --color-klano-action:        #0A0A0A;
  --color-klano-action-fg:     #FFFFFF;
  --color-klano-action-hover:  #18181B;

  --color-klano-success: #10B981;
  --color-klano-warning: #F59E0B;
  --color-klano-danger:  #EF4444;
  --color-klano-info:    #3B82F6;

  --font-display: 'Instrument Serif', Georgia, serif;
  --font-sans: 'Inter Variable', system-ui, sans-serif;
  --font-mono: 'Geist Mono Variable', ui-monospace, monospace;

  --radius-xl:  20px;
  --radius-2xl: 28px;
}
```

---

## 10. Was wir NICHT tun

- ❌ **Fraunces.** Verwendet wir nicht mehr. Display-Serif ist Instrument Serif, klar disziplinierter Einsatz (siehe §3).
- ❌ **Mixed Typography innerhalb eines Headings.** Display = Instrument Serif. h2+ = Inter. Kein Wechsel im selben Element.
- ❌ **Editorial-Moves:** Cream-Pause-Sections, Massive-Wordmarks, Track-Marker-Gimmicks, Marquee-Tickers, Coral-Pulse-Dots.
- ❌ **Dark by default.** Dark Mode kommt später als Option.
- ❌ **Bold Acid/Coral-Brand-Akzente.** Keine Brand-Akzentfarben überhaupt — Action = Schwarz.
- ❌ **GSAP-Choreografien.** Sanfte Fade-Ups reichen.
- ❌ **Kunst/Studio-Vibes.** Klano sieht aus wie Software, nicht wie Magazin.

---

## 11. Voice & Tone (Microcopy)

**Direktheit, keine Aspiration. Suno-Vibe: kurz, klar, technisch sauber.**

- ✅ "Klano sucht Venues, schreibt Outreach, hakt nach."
- ✅ "Get early access"
- ✅ "Free during beta. 19 CHF/month after."
- ❌ "make musicians be musicians" (zu pathetisch für die neue Direction)
- ❌ "Du machst Musik. Klano macht den Rest." (zu emotional)

Tagline-Optionen für v1:
- "The booking agent for bands."
- "Your band's autonomous booker."
- "Outreach, sync, follow-ups — handled."

Master-Plan-Tagline „make musicians be musicians" bleibt im internen Vision-Doc (`master-plan.md`), wird aber **nicht** auf der Marketing-Site verwendet.

---

## 12. Engineering-Handoff

1. ✅ Repo-Setup steht (siehe `build-plan-v0.md`)
2. **Tailwind-Tokens** in `apps/{web,marketing}/.../globals.css` setzen — siehe Sektion 9
3. **Fonts**: `@fontsource/instrument-serif`, `@fontsource-variable/inter`, `@fontsource-variable/geist-mono`. Fraunces + Geist Sans entfernen.
4. **shadcn/ui** mit Light-Theme-Defaults (Variables auf unsere Tokens mappen)
5. **Tag-1-Komponenten:** Button (primary/secondary), Card, Input, Logo, Nav
6. **Visual Spike:** Hero + ein Feature-Card als Reality-Check vor dem Rest

---

> **Schluss:**
> Wir bauen ein Werkzeug. Werkzeuge sehen aus wie Werkzeuge — ruhig, klar, nicht laut.
> Hell. Neutral. **Instrument Serif** (Display) + **Inter** (alles andere). Pill-Buttons. Cards. Weiß-Raum.
> Vom Suno/v0-Schema lernen — und dann Klano-Substanz reinpacken (echte Mockups, klare Copy).

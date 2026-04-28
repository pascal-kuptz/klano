# Klano — Design System v0.3
## Editorial · Bold · Mixed-Type · Mobile-First

> **Inspiration:** affinity.studio (Canva) — editorial magazine layout, mixed serif/sans typography, dark canvas with cream-pause moments, single-letter logo mark, card-based content.
> **Brand:** Klano · **Domain:** klano.ai · **App:** app.klano.ai
> **Begleit-Docs:** `master-plan.md`, `day-1-plan.md`, `build-plan-v0.md`, `klano-demo.html`
> **Status:** v0.3 — Engineering-handoff ready.

---

## 1. Vision

Klano ist kein corporate SaaS-Tool. Klano sieht aus, fühlt sich an und bewegt sich wie ein **Editorial-Magazin für Musiker** — Print-Magazin trifft Late-Night-Studio. Die Brand atmet die Welt der Bands selbst: dunkle Probenräume, Spotlight-beleuchtete Venues, der Adrenalin-Moment vor dem ersten Takt.

Wir bauen kein "minimales", "cleanes" Apple-Produkt. Wir bauen ein **mutiges, expressives, künstlerisches** Produkt, das sich auf den ersten Blick von jedem Band-Management-Tool da draußen unterscheidet.

**Direction-Switch:** Affinity-bold, nicht Apple-clean.

---

## 2. Design-Prinzipien

1. **Dark by default** — Dark Mode ist Identity, nicht Option. Light Mode kommt nicht in v1. Bands proben abends, gigen nachts. Unser Canvas spiegelt das.

2. **Mixed Typography** — **Fraunces (Serif)** für emotionale Statements und Editorial-Moments. **Geist (Sans)** für strukturelle Headlines, UI-Text und Buttons. Genau wie Affinity "Gestaltet in Affinity" in Serif setzt, aber "Windows" und "iPad" in Sans. Niemals nur eine Schrift — der Mix ist das Signature.

3. **Card-System statt Vertikal-Lines** — Content lebt in dunklen Card-Containern mit feinen Borders und generösem Padding. Affinity baut so: drei in sich abgeschlossene Module pro Section, jedes mit eigenem Visual-Mockup.

4. **Cream-Pause-Sections** — eine helle Editorial-Section bricht die schwarze Konsistenz für emotionale Moments (Quote, Testimonial, Manifest). Wie ein Magazine-Spread, der die Seitenfarbe wechselt.

5. **Saturated Accents, mit klarer Hierarchie** — **Acid-Lime ist Primary** (CTAs, Brand-Moments). **Coral** ist Sekundär-Akzent (Italics, Logo-Punkt, emotionale Highlights). 80% des Screens bleibt Void/Stage.

6. **Single-Letter-Logo** — wie Affinity's "a" nutzen wir nur **"k"** als Mark in Italic-Fraunces mit `WONK 1`. Distinkt, einprägsam, charakterstark. Das volle "klano"-Wordmark erscheint nur als Mega-Footer-Statement.

7. **Motion mit Charakter** — Type, das gestaffelt aufsteigt. Scroll-Choreografie. Keine generischen Fade-Ins.

8. **Mobile First, immer** — wir designen 375px zuerst. Bandleader nutzen das Tool unterwegs, nicht am Schreibtisch.

---

## 3. Mobile-First Philosophie

### Mobile-spezifische Patterns

- **Bottom-Sheets statt Modals** für Aktionen
- **Sticky CTA-Bars** unten bei langen Flows
- **Min. Touch-Target: 48px**, ideal 56px für Hauptaktionen
- **No-Hover-Logic** — alles funktioniert ohne Hover
- **Thumb-Zone-First** — wichtige Aktionen unten/in der Mitte
- **Generöses Padding** auf 375px nicht reduzieren — lieber Content kürzen

### Breakpoints (Tailwind)

```js
screens: {
  'sm': '480px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
}
```

Default = mobile (kein Prefix). Alles mit Prefix ist progressive enhancement.

---

## 4. Color System

### Brand-Palette

```css
/* === CANVAS — Dark Stage === */
--klano-void:        #0A0A0B;  /* Tiefstes Schwarz, Ground State */
--klano-stage:       #131215;  /* Surface elevation 1 */
--klano-card:        #16151A;  /* Card-Background — slightly lifted */
--klano-spotlight:   #1E1C22;  /* Hover/Active Surface */
--klano-edge:        #2A2730;  /* Borders, Dividers */
--klano-edge-soft:   #221F27;  /* Subtle internal dividers */
--klano-mist:        #46414B;  /* Muted Borders */

/* === CREAM PAUSE — Light Editorial Moments === */
--klano-cream:       #F2EEE6;  /* Cream Background für Quote/Manifest sections */
--klano-cream-edge:  #E0DBD0;  /* Borders auf Cream */
--klano-ink:         #0A0A0B;  /* Text auf Cream — pure black */

/* === TEXT — White-on-Void === */
--klano-pearl:       #FFFFFF;  /* Primary text — pure white für maximum contrast */
--klano-bone:        #E8E4DC;  /* Body text — slight warmth */
--klano-sand:        #BBB5AA;  /* Secondary text */
--klano-fog:         #87817A;  /* Tertiary, eyebrows, captions */

/* === ACCENTS === */
/* PRIMARY — Acid Lime (wie Affinity) */
--klano-acid:        #C5F25C;  /* CTAs, Brand-Moments, primary buttons */
--klano-acid-soft:   #D8F88C;  /* Hover-State */
--klano-acid-deep:   #8FB832;  /* Pressed-State */

/* SECONDARY — Coral (Italics, Logo-Pulse, emotional accents) */
--klano-coral:       #FF5C39;
--klano-coral-soft:  #FF8466;
--klano-coral-deep:  #C8350F;

/* ATMOSPHERIC — Plum (nur in Gradients, nie solid) */
--klano-plum:        #3D1F4A;
--klano-plum-deep:   #1F0E27;

/* === SEMANTIK === */
--klano-success:     #5DD4A0;
--klano-warning:     #F4B942;
--klano-danger:      #E84855;
--klano-info:        #6BAED6;
```

### Anwendungsregeln

- **Acid ist der visuelle Heart-Beat.** Jede Page hat einen prominenten Acid-Moment — der Primary-CTA, der Pricing-Hero, der Success-State. Nicht spamen.
- **Coral ist der emotionale Akzent.** Für Italics in Editorial-Headlines, den pulsierenden Logo-Punkt, "match%"-Indikatoren in Mockups, italic Subtitle-Elemente. Niemals als großflächiger Background.
- **Cream-Sections sind selten und wirkungsvoll.** Maximal 1–2 Cream-Sections pro Page, immer als Editorial-Pause (Quote, Testimonial, Manifesto).
- **Plum ist atmosphärisch.** Niemals als Solid-Fill, nur in Hero-Gradients und Glow-Layern.
- **Kontrast ist crisp.** White-on-Void ist `#FFFFFF` (nicht muted off-white). Bone und Sand für sekundäre Hierarchien.

### Gradients

```css
--gradient-stage: radial-gradient(ellipse 70% 60% at 90% 5%, rgba(61, 31, 74, 0.5) 0%, transparent 60%);
--gradient-acid: radial-gradient(ellipse 50% 40% at 5% 100%, rgba(197, 242, 92, 0.05) 0%, transparent 70%);
```

---

## 5. Typography — Mixed System

### Font-Stack

| Rolle | Font | Anwendung |
|-------|------|-----------|
| **Editorial Serif** | **Fraunces** (variable: opsz 9–144, wght 300–900, SOFT 0–100, WONK 0–1) | Hero-Statements, Quotes, Mega-Wordmark, Card-Titles bei emotionalen Features |
| **UI Sans** | **Geist** (variable: 400–800) | Strukturelle Headlines (Section-Titles, Feature-Card-Titles), Body-Text, Buttons, Forms |
| **Mono** | **Geist Mono** (400, 500) | Eyebrows, Numbers, Track-References, Code, Pills, Status-Labels |

### Warum dieser Mix?

- **Fraunces** ist nicht generisch. Mit `WONK 1` und `SOFT 100` werden Buchstaben weicher und individueller — perfekt für Italics. Mit `SOFT 0, WONK 0` wird sie kantig-bold für Display-Statements. Eine Schrift, viele Stimmen.
- **Geist** ist die moderne Grotesk-Wahl. Saubere Linien, kräftige Bold-Weights, neutral genug für Body-Text aber distinkt genug für Headlines. Free, von Vercel.
- **Der Mix** ist exakt das Affinity-Pattern: Sans für funktionale Strukturen ("Windows", "iPad", "Bookings"), Serif für emotionale Statements ("Gestaltet in Affinity", "make musicians be musicians").

### Hierarchie — Wann Serif, wann Sans?

**Fraunces (Serif) für:**
- Hero-Headlines (immer)
- Editorial-Quotes
- Cream-Pause-Section-Headlines
- Mega-Wordmark im Footer und Sektionen
- Italic-Akzente innerhalb Sans-Headlines (das *italic em*)
- Editorial-Card-Titles (z.B. "A bandmate, *not a database*")

**Geist (Sans) für:**
- Section-Titles in funktionalen Sections (Features-Headers, "Bookings", "Sync")
- Feature-Card-Titles ("Outreach that lands.")
- Body-Text durchgängig
- Buttons (alle Styles)
- Forms, Inputs, Labels

**Geist Mono für:**
- Eyebrows (`The agent · 002`)
- Numbers in Stats (`5h`, `3×`, `94%`)
- Track-References (`01:47 / 03:21`, `BPM 124`)
- Pill-Labels (`Active`, `Beta`, `DACH only`)
- Footer-Meta-Info

### Type-Scale (Mobile-First, fluid)

```css
/* Display — Hero only */
--text-display:    clamp(4rem, 16vw, 10rem);     /* 64–160px */
--text-display-sm: clamp(3rem, 11vw, 7.5rem);    /* 48–120px — CTA */

/* Headlines */
--text-h1:         clamp(2.5rem, 7vw, 4.5rem);   /* 40–72px */
--text-h2:         clamp(2rem, 5vw, 3rem);       /* 32–48px */
--text-h3:         clamp(1.5rem, 3vw, 2rem);     /* 24–32px */
--text-h4:         1.125rem;                      /* 18px */

/* Body */
--text-body-lg:    clamp(1.0625rem, 1.6vw, 1.1875rem);  /* 17–19px — primary lede */
--text-body:       1rem;                                  /* 16px */
--text-sm:         0.875rem;                              /* 14px */
--text-xs:         0.75rem;                               /* 12px */

/* Eyebrow & Mono */
--text-eyebrow:    0.6875rem;                             /* 11px — uppercased mono */
```

### Variable-Font-Settings (Fraunces)

```css
/* Display Bold — kantig, dramatisch */
.fraunces-display {
  font-variation-settings: "opsz" 144, "SOFT" 30, "WONK" 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 0.92;
}

/* Editorial Italic — weich, organisch */
.fraunces-italic {
  font-variation-settings: "opsz" 144, "SOFT" 100, "WONK" 1;
  font-style: italic;
  font-weight: 400;
}

/* Mega-Wordmark — maximaler Charakter */
.fraunces-mark {
  font-variation-settings: "opsz" 144, "SOFT" 30, "WONK" 1;
  font-weight: 900;
  letter-spacing: -0.075em;
}

/* Single-Letter Logo "k" */
.fraunces-logo {
  font-variation-settings: "opsz" 144, "SOFT" 100, "WONK" 1;
  font-style: italic;
  font-weight: 400;
  letter-spacing: -0.06em;
}
```

### Signature Move — der Editorial-Mix

Das ist die Brand-Erkennung:

```html
<!-- Hero -->
<h1 class="display-serif">
  <span>make</span>
  <span><em>musicians</em></span>
  <span>be musicians<span class="stop">.</span></span>
</h1>

<!-- Result:
   make           ← Fraunces 800, kantig
   musicians      ← Fraunces 400 italic, weich
   be musicians.  ← Fraunces 800, mit Acid-Punkt
-->
```

Innerhalb einer Schrift wechseln wir zwischen `WONK 0` und `WONK 1`, zwischen `SOFT 0` und `SOFT 100`. Das macht Fraunces magisch.

---

## 6. Spacing & Sizing

### Spacing Scale (4px-Grid)

```css
--space-1:  0.25rem;   /*  4px */
--space-2:  0.5rem;    /*  8px */
--space-3:  0.75rem;   /* 12px */
--space-4:  1rem;      /* 16px */
--space-5:  1.25rem;   /* 20px */
--space-6:  1.5rem;    /* 24px */
--space-8:  2rem;      /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-14: 3.5rem;    /* 56px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
--space-32: 8rem;      /* 128px */
--space-36: 9rem;      /* 144px */
```

### Typische Anwendungen

- **Touch-Target Min:** 48px · **Ideal:** 56px (`space-14`)
- **Card-Padding Mobile:** 24–28px · **Desktop:** 40–48px (`space-12`)
- **Section-Vertical Mobile:** 80–96px · **Desktop:** 128–144px (`space-32` bis `space-36`)
- **Button-Padding:** 14px / 26px vertikal/horizontal
- **Input-Height:** 56px (`space-14`)

### Border-Radius

```css
--radius-xs:   2px;     /* Unused — too sharp */
--radius-sm:   6px;     /* Pills, Tags, kleine Status-Indicators */
--radius-md:   8px;     /* Inputs, kleine Buttons */
--radius-lg:   12px;    /* Hover-Cards, kleine Container */
--radius-xl:   14px;    /* Buttons (primary, ghost, dark) */
--radius-2xl:  16px;    /* Mid-size Cards (Mockups, Mini-Containers) */
--radius-3xl:  24px;    /* Feature-Cards, Hero-Cards */
--radius-full: 9999px;  /* Avatars, Round-Buttons (Pause-Arrows) */
```

**Wichtig:** Buttons sind 14px. **Nicht pill-shaped.** Affinity nutzt medium-Radius, nicht 999px. Pill-Shape sieht heute fast-food-igen aus, medium-Radius wirkt souverän.

---

## 7. Layout — Magazine-Grid

### Container

```jsx
// Standard
<div className="mx-auto px-4 md:px-8 xl:px-12 max-w-screen-xl">

// Narrow Reading
<div className="mx-auto px-4 max-w-2xl">

// Full-Bleed (Hero, CTA, Background-Sections)
<section className="w-full">
```

### Mobile (default, 375–767px)
- Single Column durchgehend
- Padding: 16px horizontal
- Card-Padding intern: 24–28px

### Tablet (768–1023px)
- Padding: 32px horizontal
- 2-Spalten in Features möglich, sonst Single-Column

### Desktop (1024px+)
- 12-Spalten Grid, max-width 1280px
- Padding: 48px horizontal
- Asymmetrische Layouts (7+5, 6+6, 5+4+3)
- Wide-Cards spannen über mehrere Spalten

---

## 8. Components — Pattern Library

### Logo-Mark (Single Letter)

```tsx
<a href="/" className="
  font-fraunces italic font-normal
  text-[44px] leading-[0.7] tracking-[-0.06em]
  text-klano-pearl
  inline-block relative
  transition-transform duration-300 hover:rotate-[-3deg] hover:scale-105
">
  k
  {/* Coral Pulse Dot */}
  <span className="
    absolute bottom-1.5 -right-2.5 w-1.5 h-1.5 rounded-full
    bg-klano-coral shadow-[0_0_10px_var(--klano-coral)]
    animate-pulse
  " />
</a>
```

Settings: `font-variation-settings: "opsz" 144, "SOFT" 100, "WONK" 1`

### Buttons

**Primary (Acid CTA)**
```tsx
<button className="
  inline-flex items-center justify-center gap-2.5
  min-h-[56px] px-7 py-3.5
  bg-klano-acid hover:bg-klano-acid-soft
  text-klano-ink
  font-geist font-semibold text-base tracking-tight
  rounded-[14px]
  transition-all duration-250
  hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]
">
  Join the waitlist <span>→</span>
</button>
```

**Ghost**
```tsx
<button className="
  inline-flex items-center justify-center gap-2.5
  min-h-[56px] px-7 py-3.5
  bg-transparent text-klano-pearl
  border border-klano-edge hover:border-klano-pearl
  hover:bg-klano-card
  font-geist font-semibold text-base
  rounded-[14px]
  transition-all duration-250
">
  How it works
</button>
```

**Dark (auf Acid-Backgrounds)**
```tsx
<button className="
  bg-klano-ink text-klano-acid
  /* sonst wie Primary */
">
  Get early access →
</button>
```

### Pills / Status-Badges

```tsx
<span className="
  inline-flex items-center gap-2
  px-3 py-1.5 rounded-md
  bg-klano-spotlight border border-klano-edge
  font-mono text-[11px] tracking-[0.12em] uppercase
  text-klano-bone
  before:content-[''] before:w-1.5 before:h-1.5 before:rounded-full before:bg-current
">
  Beta
</span>

{/* Acid Variant für Active-State */}
<span className="bg-acid/12 border-acid/30 text-acid">
  Active
</span>
```

### Inputs

```tsx
<input
  className="
    w-full min-h-[56px]
    bg-klano-stage border border-klano-edge
    focus:border-klano-pearl focus:bg-klano-spotlight
    text-klano-pearl placeholder:text-klano-fog
    px-5 py-3.5 rounded-[14px]
    font-geist text-base
    outline-none transition-all duration-150
  "
  placeholder="band@yourdomain.com"
/>
```

### Feature Card (Affinity-Style)

```tsx
<div className="
  bg-klano-card border border-klano-edge
  rounded-3xl p-7 md:p-10 lg:p-11
  min-h-[420px] md:min-h-[480px]
  flex flex-col
  hover:border-klano-mist hover:-translate-y-1
  transition-all duration-300
">
  <span className="
    font-mono text-[11px] tracking-[0.22em] uppercase
    text-klano-coral mb-6
  ">
    → Booking · live now
  </span>
  <h3 className="
    font-geist font-bold text-[1.75rem] md:text-[2.25rem]
    leading-[1.05] tracking-tight
    text-klano-pearl mb-4
  ">
    Outreach that lands.
  </h3>
  <p className="
    font-geist text-base text-klano-sand
    leading-relaxed mb-8 max-w-[460px]
  ">
    Klano matches you with venues that fit your sound and size...
  </p>
  <div className="flex items-center gap-3 mt-auto">
    <Pill variant="acid">Active</Pill>
    <Pill>DACH only</Pill>
  </div>
  <div className="mt-6 flex-1 flex items-end">
    <MiniMockup /> {/* Visual des Features */}
  </div>
</div>
```

**Wide-Card-Variant** spannt über zwei Spalten: `className="lg:col-span-2"`.

### Cream-Pause-Section

```tsx
<section className="
  bg-klano-cream text-klano-ink
  py-24 lg:py-36
  border-y border-klano-edge
  relative overflow-hidden
">
  <div className="container">
    <span className="eyebrow eyebrow-dark mb-12">Field research · 001</span>
    <p className="
      font-fraunces font-medium italic
      text-[2rem] md:text-[4.5rem]
      leading-[1.05] tracking-tight
      text-klano-ink mb-14
    ">
      "Klano takes the parts of being in a band that nobody signed up for —
      and just <em>handles them</em>."
    </p>
    {/* Attribution + Pagination Arrows */}
  </div>
</section>
```

### Pagination Round Arrows (für Cream-Sections)

```tsx
<button className="
  w-14 h-14 rounded-full
  border border-black/20
  flex items-center justify-center
  text-klano-ink
  hover:bg-klano-ink hover:text-klano-cream hover:border-klano-ink
  transition-all duration-200
">
  <ArrowRight size={20} strokeWidth={1.5} />
</button>
```

### Bottom Sheet (Mobile)

```tsx
<div className="
  fixed inset-x-0 bottom-0 z-50
  bg-klano-card border-t border-klano-edge
  rounded-t-3xl p-6
  pb-[calc(env(safe-area-inset-bottom)+1.5rem)]
  shadow-[0_-12px_40px_rgba(0,0,0,0.6)]
">
  <div className="w-12 h-1 bg-klano-mist rounded-full mx-auto mb-6" />
  {/* Content */}
</div>
```

### Sticky Bottom CTA (Mobile)

```tsx
<div className="
  sticky bottom-0 inset-x-0
  bg-klano-void/90 backdrop-blur-lg
  border-t border-klano-edge
  px-4 py-4
  pb-[calc(env(safe-area-inset-bottom)+1rem)]
">
  <button className="w-full /* Primary Button */">
    Continue
  </button>
</div>
```

---

## 9. Motion & Animation

### Bibliothek

- **Lenis** — smooth scroll global (Marketing + App)
- **GSAP** + **ScrollTrigger** — komplexe Choreografien (Hero, Onboarding-Steps, Pin-Sections)
- **Motion (Framer Motion)** — React-Components-Animationen
- **View Transitions API** — Page-Transitions in der App

### Easing-Functions

```css
--ease-quart-out: cubic-bezier(0.25, 1, 0.5, 1);     /* Standard Reveals */
--ease-back-out:  cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful Bounce — Success */
--ease-expo-in:   cubic-bezier(0.7, 0, 0.84, 0);     /* Schnelles Verschwinden */
```

### Durations

- Micro-Interactions (Hover, Active): **150–250ms**
- UI-Transitions (Modal, Drawer): **300ms**
- Hero-Reveals, Page-Loads: **600–1100ms** (mit staggered children)
- Background-Loops (Pulse, Atmung): **2–12s**

### Signature-Motions

**1. Word-by-Word Hero Rise**
Hero-Headline: jede Zeile in einem Overflow-Container, Text steigt von unten herein, gestaffelt mit 130ms Delay. Animation 1.1s mit `quart-out`.

**2. Coral Pulse Dot**
Logo-Punkt pulsiert subtil (Opacity 0.7 → 1, Scale 1 → 1.4) in 2.4s-Loop. Brand-Heartbeat.

**3. Magnetic Buttons** (Desktop)
Auf Hover zieht Primary-Button leicht zum Cursor (max 6px Offset). Mobile: skip.

**4. Logo-Mark Tilt**
Hover am Single-Letter-Logo "k": rotate(-3deg) scale(1.05). Spielerisch.

**5. Card Lift**
Feature-Cards heben sich auf Hover um 4px, Border wird heller (`mist` statt `edge`).

**6. Variable-Font Morph**
Auf Scroll: Hero-Italic-Word morpht langsam von `WONK 0` zu `WONK 1`. Subtle aber wahnsinnig elegant.

### Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Pulse, Word-Rise, Magnetic-Buttons und Variable-Font-Morph werden komplett deaktiviert.

---

## 10. Iconography & Imagery

### Icons

- **Lucide** als Basis-Library
- **Stroke-Width 1.5** (default 2 wirkt zu fett auf dunklem Canvas)
- **Größen:** 16px (inline), 20px (default UI), 24px (Buttons), 32px+ (Feature-Sections)
- Icons sind Pearl/Bone/Sand. Acid-Icons nur in seltenen Brand-Moments.

### Imagery & Photography

- **Mood:** dunkel, körnig, atmosphärisch
- **Subjekte:** Hände an Saiten, Pedalboards, Backstage-Kabel, leere Bühnen vor Soundcheck
- **Treatment:** Slight Grain (Noise-Overlay 5% opacity), warm-shifted (orange Boost)
- **Niemals:** Lachende Stockfoto-Musiker mit weißen Zähnen

### Texture / Noise-Overlay (global)

```css
body::before {
  content: '';
  position: fixed; inset: 0;
  pointer-events: none; z-index: 100;
  opacity: 0.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,...");
}
```

### Music-Visual Vocabulary (Klano-Specific)

- **Waveform-Decorations** durchziehen Mega-Wordmarks (siehe Demo)
- **Track-References:** `01:47 / 03:21 · BPM 124 · GMaj` als Eyebrow-Style-Captions
- **File-naming-Codes:** `made_in_zürich.wav` als atmosphärische Labels
- **Match-Percentages:** `94% Match` Pills bei Venue-Cards
- **Audio-Spectrum-Hints** in Hero-Backgrounds (subtle, animated)

Das ist Klano's Äquivalent zu Affinity's sichtbaren Bezier-Vektor-Punkten — **die Brand zeigt die Welt, in der ihre User leben.**

---

## 11. Tailwind Config (drop-in)

```ts
// packages/config/tailwind.base.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    screens: {
      sm: '480px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px',
    },
    extend: {
      colors: {
        klano: {
          void:       '#0A0A0B',
          stage:      '#131215',
          card:       '#16151A',
          spotlight:  '#1E1C22',
          edge:       '#2A2730',
          'edge-soft': '#221F27',
          mist:       '#46414B',
          cream:      '#F2EEE6',
          'cream-edge': '#E0DBD0',
          ink:        '#0A0A0B',
          pearl:      '#FFFFFF',
          bone:       '#E8E4DC',
          sand:       '#BBB5AA',
          fog:        '#87817A',
          acid: {
            DEFAULT: '#C5F25C',
            soft:    '#D8F88C',
            deep:    '#8FB832',
          },
          coral: {
            DEFAULT: '#FF5C39',
            soft:    '#FF8466',
            deep:    '#C8350F',
          },
          plum: {
            DEFAULT: '#3D1F4A',
            deep:    '#1F0E27',
          },
          success: '#5DD4A0',
          warning: '#F4B942',
          danger:  '#E84855',
        },
      },
      fontFamily: {
        fraunces: ['"Fraunces Variable"', 'Georgia', 'serif'],
        geist:    ['"Geist Variable"', 'system-ui', 'sans-serif'],
        mono:     ['"Geist Mono Variable"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display':    ['clamp(4rem, 16vw, 10rem)',     { lineHeight: '0.92', letterSpacing: '-0.04em' }],
        'display-sm': ['clamp(3rem, 11vw, 7.5rem)',    { lineHeight: '0.86', letterSpacing: '-0.04em' }],
        'h1':         ['clamp(2.5rem, 7vw, 4.5rem)',   { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'h2':         ['clamp(2rem, 5vw, 3rem)',       { lineHeight: '1.0',  letterSpacing: '-0.025em' }],
        'h3':         ['clamp(1.5rem, 3vw, 2rem)',     { lineHeight: '1.1' }],
        'h4':         ['1.125rem',                      { lineHeight: '1.3' }],
        'body-lg':    ['clamp(1.0625rem, 1.6vw, 1.1875rem)', { lineHeight: '1.55' }],
        'body':       ['1rem',                          { lineHeight: '1.55' }],
        'eyebrow':    ['0.6875rem',                     { lineHeight: '1.2', letterSpacing: '0.22em' }],
      },
      borderRadius: {
        sm: '6px', md: '8px', lg: '12px', xl: '14px',
        '2xl': '16px', '3xl': '24px',
      },
      transitionTimingFunction: {
        'quart-out': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'back-out':  'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'expo-in':   'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      backgroundImage: {
        'gradient-stage': 'radial-gradient(ellipse 70% 60% at 90% 5%, rgba(61, 31, 74, 0.5) 0%, transparent 60%)',
      },
      boxShadow: {
        'sheet': '0 -12px 40px rgba(0, 0, 0, 0.6)',
        'lift':  '0 24px 60px rgba(0, 0, 0, 0.6)',
        'glow':  '0 0 12px rgba(255, 92, 57, 0.5)',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%':      { opacity: '1', transform: 'scale(1.4)' },
        },
        rise: {
          'from': { transform: 'translateY(110%)' },
          'to':   { transform: 'translateY(0)' },
        },
      },
      animation: {
        pulse: 'pulse 2.4s ease-in-out infinite',
        rise:  'rise 1.1s cubic-bezier(0.25, 1, 0.5, 1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

### Globale CSS

```css
/* apps/web/src/app/globals.css */
@import 'tailwindcss';
@import '@fontsource-variable/fraunces';
@import '@fontsource-variable/geist';
@import '@fontsource-variable/geist-mono';

@layer base {
  html {
    background: theme('colors.klano.void');
    color: theme('colors.klano.pearl');
    font-family: theme('fontFamily.geist');
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background: theme('colors.klano.acid');
    color: theme('colors.klano.ink');
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 12. Was wir NICHT tun

- ❌ **Inter, Roboto, oder System-Default-Fonts.** Fraunces + Geist, keine Ausnahmen.
- ❌ **Pill-Shaped Buttons** (border-radius 999px). Wir nutzen 14px für Buttons.
- ❌ **Vertikal-Lines als Layout-Trick.** Wir nutzen Card-Container.
- ❌ **Purple-Pink-Gradients.** AI-Slop-Signature.
- ❌ **Generische Lucide-Icons in Acid.** Icons sind Pearl/Sand.
- ❌ **Glassmorphism mit Blur-Backdrop.** Tot, wirkt 2021.
- ❌ **Light-Mode in v1.** Dark only.
- ❌ **Stockfoto-Musiker.** Echte Photos oder gar keine.
- ❌ **4+ Akzentfarben pro Screen.** Acid + Coral, das war's.
- ❌ **Confetti-Spam.** Erfolgs-Moments sind selten und gewichtig.

---

## 13. Voice & Tone

**DE — Du-Form, direkt, manchmal frech, nie corporate**
- ✅ "Lass uns deine Band kennenlernen."
- ✅ "Boom. Lass uns die anschreiben."
- ✅ "Drei Venues. Echt passend. Wähl eines."
- ❌ "Bitte vervollständigen Sie Ihr Profil, um fortzufahren."

**EN — direct, casual, slightly editorial**
- ✅ "Let's meet your band."
- ✅ "Three venues. Worth a shot."
- ✅ "We'll handle the back-and-forth."
- ❌ "Please complete your profile to continue."

**Microcopy-Prinzipien:**
- Active voice immer
- Kurz vor schön (5 Wörter > 10)
- Kein "Bitte", "leider", "möglicherweise"
- Lieber Statement als Frage
- Editorial-Italic-Moments für emotionale Anker: *"for musicians who play."*

---

## 14. Design-Inspirations & Refs

**Direktes Vorbild:**
- [affinity.studio](https://affinity.studio) — bold canvas, mixed type, single-letter mark, card-system, cream-pause sections

**Editorial-Vibes:**
- [readymag.com](https://readymag.com)
- [it-s-nice-that.com](https://www.itsnicethat.com)
- The New York Times Sunday Magazine

**Music-Brand-Vibes:**
- Pitchfork (Type-driven Reviews)
- The Quietus
- Resident Advisor (electronic music, dark/saturated)

**Tech-Polish-Refs:**
- [linear.app](https://linear.app) — dark mode polish, motion craft
- [vercel.com](https://vercel.com) — typographic confidence

**Mood:** "Late-night studio, 4am, the take just landed."

---

## 15. Engineering-Handoff Checklist

Tag 1 für Engineer/Designer:

1. ✅ Repo-Setup (siehe `build-plan-v0.md` Sektion 1)
2. **Design-Tokens** als CSS-Custom-Properties in `packages/ui/src/styles/tokens.css`
3. **Tailwind-Config** in `packages/config/tailwind.base.ts` (siehe Sektion 11 oben)
4. **Font-Loading**: `@fontsource-variable/fraunces`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono` installieren, in Root-Layout einbinden
5. **Storybook** in `packages/ui` mit ersten Komponenten: LogoMark, Button (3 variants), Pill (2 variants), Input, FeatureCard, BottomSheet
6. **Visual Spike Hero** als erstes Reality-Check-Build in Astro — wenn Hero das `klano-demo.html`-Vibe hat, ist das System validiert

---

> **Schluss:**
> Disziplin schlägt Kreativität nicht. Ein Design-System ist eine Verfassung, kein Vorschlag.
>
> Editorial. Bold. Mixed-Type. Card-System. Acid-Primary. Coral-Accent. Single-Letter-Mark. Cream-Pause-Moments.
>
> Klano sieht aus wie ein Magazin, nicht wie eine SaaS-Landing.

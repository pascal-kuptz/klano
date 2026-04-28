import type { Locale } from './seo';

type PillVariant = 'default' | 'acid';
type Pill = { variant: PillVariant; label: string };

export const copy: Record<Locale, {
  nav: { waitlist: string; menu: string };
  hero: {
    eyebrow: string;
    lines: readonly [string, string, string];
    ctaPrimary: string;
    ctaSecondary: string;
    stats: readonly { num: string; em: string; label: string }[];
  };
  pause: { eyebrow: string; quote: string; attribution: { name: string; role: string } };
  wordmark: { labelTop: string; labelSub: string; caption: string };
  features: {
    eyebrow: string;
    heading: readonly [string, string];
    lede: string;
    cards: readonly { eyebrow: string; title: string; body: string; pills: Pill[] }[];
  };
  venues: {
    eyebrow: string;
    heading: readonly [string, string];
    lede: string;
    cards: readonly {
      rank: string; match: string; region: string; name: string; city: string;
      cap: string; genre: string; verdict: string;
    }[];
  };
  waitlist: {
    eyebrow: string;
    heading: readonly [string, string];
    placeholder: string;
    submit: string;
    success: string;
    successPlaceholder: string;
    meta: string;
  };
  footer: {
    tag: readonly string[];
    cols: readonly { heading: string; links: { label: string; href: string }[] }[];
    from: string;
    legalLeft: string;
    legalRight: string;
  };
}> = {
  de: {
    nav: {
      waitlist: 'Wartelisten-Plätze',
      menu: 'Menü',
    },
    hero: {
      eyebrow: 'Für Musiker, die spielen · Closed Beta · Frühjahr 2026',
      lines: ['make', 'musicians', 'be musicians.'] as const,
      ctaPrimary: 'Wartelisten-Platz sichern',
      ctaSecondary: 'Wie es funktioniert',
      stats: [
        { num: '5', em: 'h', label: 'pro Woche gespart' },
        { num: '3', em: '×', label: 'mehr Antworten von Venues' },
      ],
    },
    pause: {
      eyebrow: 'Field Research · 001',
      quote:
        '"Klano übernimmt all die Band-Aufgaben, die niemand wirklich machen will — und löst sie einfach. Es ist das erste Tool, das sich anfühlt, als wäre es auf unserer Seite."',
      attribution: { name: 'Léa Sommer', role: 'Sängerin, Halbnacht — Zürich' },
    },
    wordmark: {
      labelTop: 'Track 01 · made_in_zürich.wav',
      labelSub: 'Dein Bandkollege, aufgenommen.',
      caption:
        'Klano lebt da, wo Bands leben — späte Nächte, Gruppenchats, halbfertige Setlisten. Hört zu, schreibt, hakt nach. Leise. Wie der Bandkollege, den du dir wünschst.',
    },
    features: {
      eyebrow: 'Was Klano macht · 002',
      heading: ['Ein Bandkollege,', 'keine Datenbank.'] as const,
      lede: 'Andere Tools wollen, dass du Tabellen ausfüllst. Klano handelt — sucht, schreibt, hakt nach. Leise, autonom, bis du Stopp sagst.',
      cards: [
        {
          eyebrow: '→ Booking · live',
          title: 'Outreach, das ankommt.',
          body: 'Klano matcht euch mit Venues, die zu eurem Sound und eurer Größe passen. Schreibt persönliche Mails. Hakt automatisch nach — wochenlang, falls nötig.',
          pills: [{ variant: 'acid', label: 'Aktiv' }, { variant: 'default', label: 'DACH only' }],
        },
        {
          eyebrow: '→ Sync · live',
          title: 'Proben, ohne Hinterherrennen.',
          body: 'Jedes Mitglied trägt Verfügbarkeit einmal ein. Klano schlägt den Slot vor, der für alle passt — und erinnert am Vortag.',
          pills: [{ variant: 'acid', label: 'Aktiv' }],
        },
        {
          eyebrow: '→ Inbox AI · Beta',
          title: 'Antworten, verstanden.',
          body: 'Wenn ein Venue antwortet, liest Klano die Mail, extrahiert Datum, Gage, Tech-Specs — und sagt dir, was zu entscheiden ist. Keine verlorenen Threads in drei Postfächern.',
          pills: [{ variant: 'default', label: 'Beta' }, { variant: 'default', label: 'DE / EN' }],
        },
      ],
    },
    venues: {
      eyebrow: 'Der Agent in Aktion · 003',
      heading: ['Drei Venues.', 'Lohnt sich.'] as const,
      lede: 'Du fragst einmal. Klano matcht euren Sound, eure Größe, eure Region. Schreibt die Outreach. Sendet. Hakt nach. Du gibst frei.',
      cards: [
        { rank: '01', match: '94%', region: 'ZRH', name: 'Bogen F', city: 'Zürich', cap: '180', genre: 'Indie', verdict: '★ Top fit' },
        { rank: '02', match: '89%', region: 'ZRH', name: 'Mascotte', city: 'Zürich', cap: '220', genre: 'Alle', verdict: 'Stark' },
        { rank: '03', match: '87%', region: 'WIN', name: 'Sender', city: 'Winterthur', cap: '140', genre: 'Folk', verdict: 'Solide' },
      ],
    },
    waitlist: {
      eyebrow: 'Closed Beta · Frühjahr 2026 · DACH zuerst',
      heading: ['Hör auf, die Band zu managen.', 'Fang an, sie zu spielen.'] as const,
      placeholder: 'band@deinedomain.com',
      submit: 'Frühen Zugang sichern →',
      success: 'Du bist drin.',
      successPlaceholder: 'Wir sehen uns im Frühjahr 2026.',
      meta: 'Keine Kreditkarte · DSG- und DSGVO-konform · Made in Zürich',
    },
    footer: {
      tag: ['Klano. ', 'Ein digitaler Bandkollege', '\nfür die Leute, die immer wieder auftauchen.'],
      cols: [
        {
          heading: 'Produkt',
          links: [
            { label: 'Booking', href: '#features' },
            { label: 'Sync', href: '#features' },
            { label: 'Inbox AI', href: '#features' },
            { label: 'Pricing', href: '/pricing' },
          ],
        },
        {
          heading: 'Klano',
          links: [
            { label: 'Manifest', href: '/manifest' },
            { label: 'Press', href: '/press' },
            { label: 'Kontakt', href: 'mailto:hello@klano.ai' },
          ],
        },
        {
          heading: 'Rechtliches',
          links: [
            { label: 'Datenschutz', href: '/datenschutz' },
            { label: 'Impressum', href: '/impressum' },
            { label: 'AGB', href: '/agb' },
          ],
        },
      ],
      from: 'aus Zürich',
      legalLeft: 'klano.ai · v0 · Zürich',
      legalRight: '© 2026 · Datenschutz · Impressum',
    },
  },
  en: {
    nav: { waitlist: 'Join waitlist', menu: 'Menu' },
    hero: {
      eyebrow: 'For musicians who play · Closed beta · Spring 2026',
      lines: ['make', 'musicians', 'be musicians.'] as const,
      ctaPrimary: 'Join the waitlist',
      ctaSecondary: 'How it works',
      stats: [
        { num: '5', em: 'h', label: 'Saved every week' },
        { num: '3', em: '×', label: 'More gig replies' },
      ],
    },
    pause: {
      eyebrow: 'Field research · 001',
      quote:
        '"Klano takes the parts of being in a band that nobody signed up for — and just handles them. It\'s the first tool that feels like it\'s actually on our side."',
      attribution: { name: 'Léa Sommer', role: 'Singer, Halbnacht — Zürich' },
    },
    wordmark: {
      labelTop: 'Track 01 · made_in_zürich.wav',
      labelSub: 'Your bandmate, recorded.',
      caption:
        'Klano lives where bands live — late nights, group chats, half-finished setlists. It listens, drafts, follows up. Quietly. Like the bandmate you wish you had.',
    },
    features: {
      eyebrow: 'What Klano does · 002',
      heading: ['A bandmate,', 'not a database.'] as const,
      lede: 'Other tools ask you to fill in spreadsheets. Klano takes action — searches, drafts, follows up. Quietly, autonomously, until you say no.',
      cards: [
        {
          eyebrow: '→ Booking · live',
          title: 'Outreach that lands.',
          body: 'Klano matches you with venues that fit your sound and size. Drafts personal emails. Follows up automatically — for weeks if needed.',
          pills: [{ variant: 'acid', label: 'Active' }, { variant: 'default', label: 'DACH only' }],
        },
        {
          eyebrow: '→ Sync · live',
          title: 'Rehearsals, without the chase.',
          body: 'Each member drops their availability once. Klano proposes the slot that works for everyone — and reminds you the day before.',
          pills: [{ variant: 'acid', label: 'Active' }],
        },
        {
          eyebrow: '→ Inbox AI · beta',
          title: 'Replies, understood.',
          body: 'When a venue replies, Klano reads the message, extracts dates, fees, technical specs — and tells you what to decide. No more lost threads in three different inboxes.',
          pills: [{ variant: 'default', label: 'Beta' }, { variant: 'default', label: 'DE / EN' }],
        },
      ],
    },
    venues: {
      eyebrow: 'The agent in action · 003',
      heading: ['Three venues.', 'Worth a shot.'] as const,
      lede: 'You ask once. Klano matches your sound, your size, your region. Drafts the outreach. Sends. Follows up. You sign off.',
      cards: [
        { rank: '01', match: '94%', region: 'ZRH', name: 'Bogen F', city: 'Zürich', cap: '180', genre: 'Indie', verdict: '★ Top fit' },
        { rank: '02', match: '89%', region: 'ZRH', name: 'Mascotte', city: 'Zürich', cap: '220', genre: 'All', verdict: 'Strong' },
        { rank: '03', match: '87%', region: 'WIN', name: 'Sender', city: 'Winterthur', cap: '140', genre: 'Folk', verdict: 'Solid' },
      ],
    },
    waitlist: {
      eyebrow: 'Closed beta · Spring 2026 · DACH first',
      heading: ['Stop running the band.', 'Start playing it.'] as const,
      placeholder: 'band@yourdomain.com',
      submit: 'Get early access →',
      success: 'You are in.',
      successPlaceholder: 'See you in Spring 2026.',
      meta: 'No credit card · GDPR-compliant · Made in Zürich',
    },
    footer: {
      tag: ['Klano. ', 'A digital bandmate', '\nfor the people who keep showing up.'],
      cols: [
        {
          heading: 'Product',
          links: [
            { label: 'Booking', href: '/en#features' },
            { label: 'Sync', href: '/en#features' },
            { label: 'Inbox AI', href: '/en#features' },
            { label: 'Pricing', href: '/en/pricing' },
          ],
        },
        {
          heading: 'Klano',
          links: [
            { label: 'Manifesto', href: '/en/manifesto' },
            { label: 'Press', href: '/en/press' },
            { label: 'Contact', href: 'mailto:hello@klano.ai' },
          ],
        },
        {
          heading: 'Legal',
          links: [
            { label: 'Privacy', href: '/en/privacy' },
            { label: 'Imprint', href: '/en/imprint' },
            { label: 'Terms', href: '/en/terms' },
          ],
        },
      ],
      from: 'from Zürich',
      legalLeft: 'klano.ai · v0 · Zürich',
      legalRight: '© 2026 · Privacy · Imprint',
    },
  },
};

export type CopyFor<L extends Locale> = (typeof copy)[L];

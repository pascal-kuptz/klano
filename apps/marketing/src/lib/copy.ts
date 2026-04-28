import type { Locale } from './seo';

type PillVariant = 'default' | 'acid';
type Pill = { variant: PillVariant; label: string };

type AgentLogEntry = { time: string; verb: string; object: string; tone?: 'acid' | 'default' };

export const copy: Record<
  Locale,
  {
    nav: { waitlist: string; menu: string; how: string };
    hero: {
      observed: string;
      lines: readonly [string, string, string];
      tagline: string;
      ctaPrimary: string;
      ctaSecondary: string;
      meta: string;
    };
    agentLog: {
      track: string;
      heading: string;
      sub: string;
      timestamp: string;
      band: string;
      entries: readonly AgentLogEntry[];
      footnote: string;
    };
    pause: {
      track: string;
      eyebrow: string;
      quote: string;
      attribution: { name: string; role: string };
    };
    wordmark: {
      track: string;
      labelTop: string;
      labelSub: string;
      caption: string;
    };
    features: {
      track: string;
      eyebrow: string;
      heading: readonly [string, string];
      lede: string;
      cards: readonly { eyebrow: string; title: string; body: string; pills: Pill[] }[];
    };
    venues: {
      track: string;
      eyebrow: string;
      heading: readonly [string, string];
      lede: string;
      cards: readonly {
        rank: string;
        match: string;
        region: string;
        name: string;
        city: string;
        cap: string;
        genre: string;
        verdict: string;
      }[];
    };
    trust: {
      lines: readonly string[];
    };
    plans: {
      track: string;
      eyebrow: string;
      heading: readonly [string, string];
      lede: string;
      cards: readonly {
        name: string;
        price: string;
        priceMeta: string;
        description: string;
        features: string[];
        cta: string;
        ctaHref: string;
        highlight?: boolean;
      }[];
    };
    marquee: { items: readonly string[] };
    waitlist: {
      track: string;
      eyebrow: string;
      heading: readonly [string, string];
      lede: string;
      placeholder: string;
      submit: string;
      success: string;
      successPlaceholder: string;
      meta: string;
      timing: { label: string; options: { value: string; label: string }[] };
    };
    footer: {
      manifest: string;
      cols: readonly { heading: string; links: { label: string; href: string }[] }[];
      legalLeft: string;
      legalRight: string;
    };
  }
> = {
  de: {
    nav: { waitlist: 'Frühen Zugang', menu: 'Menü', how: 'Wie es funktioniert' },
    hero: {
      observed: 'Mi · 23:14 · noch immer am Schreiben.',
      lines: ['make', 'musicians', 'be musicians.'] as const,
      tagline: 'Du machst Musik. Klano macht den Rest.',
      ctaPrimary: 'Frühen Zugang sichern',
      ctaSecondary: 'Wie es funktioniert',
      meta: 'Closed Beta · Frühjahr 2026 · DACH zuerst',
    },
    agentLog: {
      track: '01',
      heading: 'Was Klano heute Morgen erledigt hat.',
      sub: 'Während ihr geprobt habt.',
      timestamp: 'Mittwoch · 06:00–11:42',
      band: 'für Halbnacht · Indie · Zürich',
      entries: [
        { time: '06:14', verb: 'gefunden', object: '3 passende Venues — Bogen F · Mascotte · Sender', tone: 'acid' },
        { time: '06:21', verb: 'geschrieben', object: 'Outreach an Bogen F (94% Match)' },
        { time: '08:03', verb: 'erkannt', object: 'Reply von Mascotte: positiv, 17. Mai vorgeschlagen', tone: 'acid' },
        { time: '09:47', verb: 'erinnert', object: 'Léa & David: Probe morgen 19:30, Setlist offen' },
        { time: '11:42', verb: 'nachgehakt', object: 'Sender (7 Tage ohne Antwort) — sanft, persönlich' },
      ],
      footnote: 'Du musstest dafür nichts tun. Bestätigt nur, was rausgehen darf.',
    },
    pause: {
      track: '02',
      eyebrow: 'Field Research · Zürich · Februar 2026',
      quote:
        '"Klano übernimmt all die Band-Aufgaben, die niemand wirklich machen will — und löst sie einfach. Es ist das erste Tool, das sich anfühlt, als wäre es auf unserer Seite."',
      attribution: { name: 'Léa Sommer', role: 'Sängerin · Halbnacht — Zürich' },
    },
    wordmark: {
      track: '03',
      labelTop: 'Track 03 · made_in_zürich.wav',
      labelSub: 'Geschrieben zwischen Gigs.',
      caption:
        'Klano lebt da, wo Bands leben — späte Nächte, Gruppenchats, halbfertige Setlisten. Hört zu, schreibt, hakt nach. Leise. Wie der Bandkollege, den du dir wünschst.',
    },
    features: {
      track: '04',
      eyebrow: 'Was Klano übernimmt',
      heading: ['Ein Bandkollege,', 'keine Datenbank.'] as const,
      lede:
        'Andere Tools wollen, dass du Tabellen ausfüllst. Klano handelt — sucht, schreibt, hakt nach. Leise, autonom, bis du Stopp sagst.',
      cards: [
        {
          eyebrow: '→ Booking',
          title: 'Outreach, das ankommt.',
          body:
            'Klano matcht euch mit Venues, die zu eurem Sound und eurer Größe passen. Schreibt persönliche Mails. Hakt automatisch nach — wochenlang, falls nötig.',
          pills: [
            { variant: 'acid', label: 'Aktiv' },
            { variant: 'default', label: 'DACH only' },
          ],
        },
        {
          eyebrow: '→ Sync',
          title: 'Proben, ohne Hinterherrennen.',
          body:
            'Jedes Mitglied trägt Verfügbarkeit einmal ein. Klano schlägt den Slot vor, der für alle passt — und erinnert am Vortag.',
          pills: [{ variant: 'acid', label: 'Aktiv' }],
        },
        {
          eyebrow: '→ Inbox AI',
          title: 'Antworten, verstanden.',
          body:
            'Wenn ein Venue antwortet, liest Klano die Mail, extrahiert Datum, Gage, Tech-Specs — und sagt dir, was zu entscheiden ist. Keine verlorenen Threads in drei Postfächern.',
          pills: [
            { variant: 'default', label: 'Beta' },
            { variant: 'default', label: 'DE / EN' },
          ],
        },
      ],
    },
    venues: {
      track: '05',
      eyebrow: 'Der Agent in Aktion',
      heading: ['Drei Venues.', 'Lohnt sich.'] as const,
      lede:
        'Du fragst einmal. Klano matcht euren Sound, eure Größe, eure Region. Schreibt die Outreach. Sendet. Hakt nach. Du gibst frei.',
      cards: [
        { rank: '01', match: '94%', region: 'ZRH', name: 'Bogen F', city: 'Zürich', cap: '180', genre: 'Indie', verdict: '★ Top-Fit' },
        { rank: '02', match: '89%', region: 'ZRH', name: 'Mascotte', city: 'Zürich', cap: '220', genre: 'Alle', verdict: 'Stark' },
        { rank: '03', match: '87%', region: 'WIN', name: 'Sender', city: 'Winterthur', cap: '140', genre: 'Folk', verdict: 'Solide' },
      ],
    },
    trust: {
      lines: ['Aus Zürich. Zwei Leute.', 'Kein VC. Kein Tracking.', 'Wir antworten auf jede Mail.'],
    },
    plans: {
      track: '07',
      eyebrow: 'Was du bekommst',
      heading: ['Frei beim Spielen.', 'Pro beim Buchen.'] as const,
      lede:
        'Die Beta ist frei für die ersten 50 Bands. Danach bleibt Free permanent — Pro nimmt euch die Arbeit ab.',
      cards: [
        {
          name: 'Beta',
          price: 'gratis',
          priceMeta: 'Frühjahr 2026 · 50 Plätze',
          description: 'Volle Funktionalität für die ersten 50 Bands. Kein Limit, kein Catch.',
          features: [
            'Alles aus Pro',
            'Wöchentliche Calls mit dem Team',
            'Du formst das Produkt mit',
            'Nach Beta: 6 Monate Pro gratis',
          ],
          cta: 'Beta-Platz sichern',
          ctaHref: '#waitlist',
          highlight: true,
        },
        {
          name: 'Free',
          price: '0 CHF',
          priceMeta: 'für immer',
          description: 'Wenn ihr Klano leichtgewichtig nutzen wollt — für die Band, die nur 4–6 Gigs im Jahr spielt.',
          features: [
            'Bis 6 Bandmitglieder',
            '10 Outreach-Mails / Monat',
            'Manuelles Inbox-Sortieren',
            'Probetermin-Vorschläge',
            'Community Support',
          ],
          cta: 'Mit Free starten',
          ctaHref: '#waitlist',
        },
        {
          name: 'Pro',
          price: '19 CHF',
          priceMeta: 'pro Monat · 14 Tage gratis',
          description: 'Wenn ihr aktiv bookt und der Agent für euch arbeiten soll.',
          features: [
            'Unlimitierte Outreach-Mails',
            'Auto-Follow-ups',
            'AI-Inbox-Klassifizierung',
            'Unlimitierte Mitglieder',
            'Priority Support',
            '190 CHF/Jahr — 17% Rabatt',
          ],
          cta: 'Pro testen',
          ctaHref: '#waitlist',
        },
      ],
    },
    marquee: {
      items: [
        'Made in Zürich',
        'For musicians who play',
        'Closed Beta · Frühjahr 2026',
        'DACH first',
        'Stop running the band',
      ],
    },
    waitlist: {
      track: '06',
      eyebrow: 'Closed Beta · Frühjahr 2026',
      heading: ['Hör auf, die Band zu managen.', 'Fang an, sie zu spielen.'] as const,
      lede: 'Wir nehmen 50 Bands in die Beta. Erst dann öffnen wir.',
      placeholder: 'band@deinedomain.com',
      submit: 'Frühen Zugang sichern',
      success: 'Du bist drin.',
      successPlaceholder: 'Wir melden uns im Frühjahr.',
      meta: 'Keine Kreditkarte · DSG/DSGVO · Made in Zürich',
      timing: {
        label: 'Wann brauchst du das?',
        options: [
          { value: 'now', label: 'Jetzt sofort' },
          { value: 'soon', label: 'In 3 Monaten' },
          { value: 'curious', label: 'Nur neugierig' },
        ],
      },
    },
    footer: {
      manifest: 'Für die Leute, die immer wieder auftauchen — und nicht den Orga-Job wollen.',
      cols: [
        {
          heading: 'Produkt',
          links: [
            { label: 'Booking', href: '/#features' },
            { label: 'Sync', href: '/#features' },
            { label: 'Inbox AI', href: '/#features' },
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
          ],
        },
      ],
      legalLeft: 'klano.ai · v0 · aus Zürich',
      legalRight: '© 2026',
    },
  },
  en: {
    nav: { waitlist: 'Get early access', menu: 'Menu', how: 'How it works' },
    hero: {
      observed: 'Wed · 23:14 · still writing emails.',
      lines: ['make', 'musicians', 'be musicians.'] as const,
      tagline: 'You make music. Klano takes the rest.',
      ctaPrimary: 'Get early access',
      ctaSecondary: 'How it works',
      meta: 'Closed beta · Spring 2026 · DACH first',
    },
    agentLog: {
      track: '01',
      heading: 'What Klano did this morning.',
      sub: 'While you were rehearsing.',
      timestamp: 'Wednesday · 06:00–11:42',
      band: 'for Halbnacht · indie · Zürich',
      entries: [
        { time: '06:14', verb: 'found', object: '3 venues — Bogen F · Mascotte · Sender', tone: 'acid' },
        { time: '06:21', verb: 'wrote', object: 'outreach to Bogen F (94% match)' },
        { time: '08:03', verb: 'detected', object: 'reply from Mascotte: positive, May 17 proposed', tone: 'acid' },
        { time: '09:47', verb: 'reminded', object: 'Léa & David: rehearsal tomorrow 19:30, setlist open' },
        { time: '11:42', verb: 'followed up', object: 'Sender (7 days, no reply) — gentle, personal' },
      ],
      footnote: 'You did nothing. Just confirm what goes out.',
    },
    pause: {
      track: '02',
      eyebrow: 'Field research · Zürich · Feb 2026',
      quote:
        '"Klano takes the parts of being in a band that nobody signed up for — and just handles them. It\'s the first tool that feels like it\'s actually on our side."',
      attribution: { name: 'Léa Sommer', role: 'Singer · Halbnacht — Zürich' },
    },
    wordmark: {
      track: '03',
      labelTop: 'Track 03 · made_in_zürich.wav',
      labelSub: 'Written between gigs.',
      caption:
        'Klano lives where bands live — late nights, group chats, half-finished setlists. It listens, drafts, follows up. Quietly. Like the bandmate you wish you had.',
    },
    features: {
      track: '04',
      eyebrow: 'What Klano takes off your plate',
      heading: ['A bandmate,', 'not a database.'] as const,
      lede:
        'Other tools ask you to fill in spreadsheets. Klano takes action — searches, drafts, follows up. Quietly, autonomously, until you say no.',
      cards: [
        {
          eyebrow: '→ Booking',
          title: 'Outreach that lands.',
          body:
            'Klano matches you with venues that fit your sound and size. Drafts personal emails. Follows up automatically — for weeks if needed.',
          pills: [
            { variant: 'acid', label: 'Active' },
            { variant: 'default', label: 'DACH only' },
          ],
        },
        {
          eyebrow: '→ Sync',
          title: 'Rehearsals, without the chase.',
          body:
            'Each member drops their availability once. Klano proposes the slot that works for everyone — and reminds you the day before.',
          pills: [{ variant: 'acid', label: 'Active' }],
        },
        {
          eyebrow: '→ Inbox AI',
          title: 'Replies, understood.',
          body:
            'When a venue replies, Klano reads the message, extracts dates, fees, technical specs — and tells you what to decide. No more lost threads in three different inboxes.',
          pills: [
            { variant: 'default', label: 'Beta' },
            { variant: 'default', label: 'DE / EN' },
          ],
        },
      ],
    },
    venues: {
      track: '05',
      eyebrow: 'The agent in action',
      heading: ['Three venues.', 'Worth a shot.'] as const,
      lede:
        'You ask once. Klano matches your sound, your size, your region. Drafts the outreach. Sends. Follows up. You sign off.',
      cards: [
        { rank: '01', match: '94%', region: 'ZRH', name: 'Bogen F', city: 'Zürich', cap: '180', genre: 'Indie', verdict: '★ Top fit' },
        { rank: '02', match: '89%', region: 'ZRH', name: 'Mascotte', city: 'Zürich', cap: '220', genre: 'All', verdict: 'Strong' },
        { rank: '03', match: '87%', region: 'WIN', name: 'Sender', city: 'Winterthur', cap: '140', genre: 'Folk', verdict: 'Solid' },
      ],
    },
    trust: {
      lines: ['From Zürich. Two people.', 'No VC. No tracking.', 'We answer every email.'],
    },
    plans: {
      track: '07',
      eyebrow: 'What you get',
      heading: ['Free when you play.', 'Pro when you book.'] as const,
      lede:
        'Beta is free for the first 50 bands. After that, Free stays free forever — Pro takes the work off your plate.',
      cards: [
        {
          name: 'Beta',
          price: 'free',
          priceMeta: 'Spring 2026 · 50 spots',
          description: 'Full functionality for the first 50 bands. No limit, no catch.',
          features: [
            'Everything from Pro',
            'Weekly calls with the team',
            'You shape the product',
            'After beta: 6 months of Pro free',
          ],
          cta: 'Get a beta seat',
          ctaHref: '#waitlist',
          highlight: true,
        },
        {
          name: 'Free',
          price: '0 CHF',
          priceMeta: 'forever',
          description: 'For bands using Klano lightly — the ones playing 4–6 gigs a year.',
          features: [
            'Up to 6 band members',
            '10 outreach emails / month',
            'Manual inbox sorting',
            'Rehearsal proposals',
            'Community support',
          ],
          cta: 'Start with Free',
          ctaHref: '#waitlist',
        },
        {
          name: 'Pro',
          price: '19 CHF',
          priceMeta: 'per month · 14-day trial',
          description: 'When you book actively and want the agent working for you.',
          features: [
            'Unlimited outreach emails',
            'Auto follow-ups',
            'AI inbox classification',
            'Unlimited members',
            'Priority support',
            '190 CHF/year — save 17%',
          ],
          cta: 'Try Pro',
          ctaHref: '#waitlist',
        },
      ],
    },
    marquee: {
      items: [
        'Made in Zürich',
        'For musicians who play',
        'Closed beta · Spring 2026',
        'DACH first',
        'Stop running the band',
      ],
    },
    waitlist: {
      track: '06',
      eyebrow: 'Closed beta · Spring 2026',
      heading: ['Stop running the band.', 'Start playing it.'] as const,
      lede: "We're taking 50 bands into beta. Then we open up.",
      placeholder: 'band@yourdomain.com',
      submit: 'Get early access',
      success: 'You are in.',
      successPlaceholder: 'We will write in spring.',
      meta: 'No credit card · GDPR · Made in Zürich',
      timing: {
        label: 'When do you need this?',
        options: [
          { value: 'now', label: 'Right now' },
          { value: 'soon', label: 'In 3 months' },
          { value: 'curious', label: 'Just curious' },
        ],
      },
    },
    footer: {
      manifest: 'For the people who keep showing up — and never wanted the manager job.',
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
          ],
        },
      ],
      legalLeft: 'klano.ai · v0 · from Zürich',
      legalRight: '© 2026',
    },
  },
};

export type CopyFor<L extends Locale> = (typeof copy)[L];

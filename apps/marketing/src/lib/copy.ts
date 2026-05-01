import type { Locale } from './seo';

const iconSearch = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`;
const iconCalendar = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`;
const iconInbox = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></svg>`;
const iconBolt = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z"/></svg>`;
const iconUsers = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const iconShield = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z"/></svg>`;

export const copy: Record<Locale, {
  nav: {
    primaryCta: string;
    loginLabel: string;
    /** Inline links (desktop) + mobile menu items */
    links: readonly { label: string; href: string }[];
  };
  hero: {
    badge: string;
    headline: string;
    headlineItalic?: string;
    subline: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  demo: {
    num: string;
    sectionLabel: string;
    bandLabel: string;
    statsLabel: string;
    cols: readonly [string, string, string, string];
    rows: readonly { venue: string; city: string; status: 'sent' | 'opened' | 'replied' | 'booked'; match: string; meta: string }[];
    aiLabel: string;
    aiText: string;
    aiCta: string;
  };
  features: {
    num: string;
    eyebrow: string;
    heading: string;
    cards: readonly { icon: string; title: string; body: string }[];
  };
  plans: {
    num: string;
    eyebrow: string;
    heading: string;
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
  pricing: {
    title: string;
    intro: string;
    faq: readonly { q: string; a: string }[];
  };
  personal: {
    num: string;
    eyebrow: string;
    heading: string;
    body: string;
    signoff: string;
    people: { initials: string; name: string; role: string }[];
  };
  waitlist: {
    num: string;
    eyebrow: string;
    heading: string;
    subline: string;
    placeholder: string;
    submit: string;
    success: string;
    successPlaceholder: string;
    meta: string;
  };
  footer: {
    tagline: string;
    cols: readonly { heading: string; links: { label: string; href: string }[] }[];
    legalLeft: string;
    legalRight: string;
  };
}> = {
  de: {
    nav: {
      primaryCta: 'Frühen Zugang',
      loginLabel: 'Login',
      links: [
        { label: 'Funktionen', href: '/#features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Manifest', href: '/#personal' },
        { label: 'Kontakt', href: 'mailto:hello@klano.ai' },
      ],
    },
    hero: {
      badge: 'Closed Beta · Frühjahr 2026',
      headline: 'Der Booking-Agent',
      headlineItalic: 'für Bands.',
      subline:
        'Klano sucht passende Venues, schreibt Outreach in eurem Ton und hakt automatisch nach. Ihr probt. Klano arbeitet.',
      ctaPrimary: 'Frühen Zugang sichern',
      ctaSecondary: 'Funktionen ansehen',
    },
    demo: {
      num: '01',
      sectionLabel: 'Live in der App',
      bandLabel: 'Halbnacht — Bookings',
      statsLabel: '6 aktiv · 1 neue Antwort',
      cols: ['Venue', 'Status', 'Match', 'Letzte Aktion'],
      rows: [
        { venue: 'Helsinki', city: 'Zürich', status: 'replied', match: '81%', meta: 'Reply · 17. Mai · 800 CHF' },
        { venue: 'Bogen F', city: 'Zürich', status: 'opened', match: '94%', meta: 'Geöffnet · gestern 18:42' },
        { venue: 'Mascotte', city: 'Zürich', status: 'sent', match: '89%', meta: 'Gesendet · vor 2 Tagen' },
        { venue: 'Sender', city: 'Winterthur', status: 'sent', match: '87%', meta: 'Gesendet · vor 7 Tagen' },
      ],
      aiLabel: 'AI live',
      aiText: 'Antwort von Helsinki ist positiv. Datum & Gage erkannt — soll ich bestätigen?',
      aiCta: 'Bestätigen',
    },
    features: {
      num: '02',
      eyebrow: 'Funktionen',
      heading: 'Sechs Stunden pro Woche, die ihr zurückbekommt.',
      cards: [
        {
          icon: iconSearch,
          title: 'Venue-Matching',
          body: 'Kuratierte DACH-Datenbank. Klano matcht eure Größe, eure Region, euren Sound.',
        },
        {
          icon: iconBolt,
          title: 'Outreach-Drafts',
          body: 'Persönliche Mails in DE oder EN, im Ton der Band. Ihr lest, klickt, sendet.',
        },
        {
          icon: iconInbox,
          title: 'Inbox-AI',
          body: 'Antworten von Venues werden klassifiziert: Datum, Gage, Tech-Specs extrahiert.',
        },
        {
          icon: iconCalendar,
          title: 'Auto-Follow-ups',
          body: 'Nach 7 und 14 Tagen ohne Antwort hakt Klano sanft nach. Persönlich, nicht generisch.',
        },
        {
          icon: iconUsers,
          title: 'Sync für die Band',
          body: 'Verfügbarkeiten an einem Ort. Klano schlägt Probetermine vor, die für alle passen.',
        },
        {
          icon: iconShield,
          title: 'Privatsphäre eingebaut',
          body: 'Daten in EU-Frankfurt. DSG- und DSGVO-konform. Keine Drittanbieter-Tracker.',
        },
      ],
    },
    plans: {
      num: '03',
      eyebrow: 'Preise',
      heading: 'Frei in der Beta. Pro, wenn ihr aktiv bookt.',
      cards: [
        {
          name: 'Beta',
          price: 'gratis',
          priceMeta: '50 Plätze · Frühjahr 2026',
          description: 'Volle Funktionalität für die ersten 50 Bands. Wöchentliche Calls mit dem Team.',
          features: ['Alles aus Pro', 'Wöchentliche Calls', 'Direkter Einfluss aufs Produkt', 'Nach Beta: 6 Monate Pro gratis'],
          cta: 'Beta-Platz sichern',
          ctaHref: '#waitlist',
          highlight: true,
        },
        {
          name: 'Free',
          price: '0 CHF',
          priceMeta: 'für immer',
          description: 'Für Bands mit 4–6 Gigs im Jahr. Klano bleibt im Hintergrund.',
          features: [
            'Bis 6 Bandmitglieder',
            '10 Outreach-Mails / Monat',
            'Manuelle Inbox',
            'Probetermin-Vorschläge',
            'Community-Support',
          ],
          cta: 'Mit Free starten',
          ctaHref: '#waitlist',
        },
        {
          name: 'Pro',
          price: '19 CHF',
          priceMeta: 'pro Monat · 14 Tage gratis',
          description: 'Für aktive Bands. Klano übernimmt den Booking-Job vollständig.',
          features: [
            'Unlimitierte Outreach-Mails',
            'Auto-Follow-ups',
            'AI-Inbox-Klassifizierung',
            'Unlimitierte Mitglieder',
            'Priority-Support',
            '190 CHF/Jahr · 17% Rabatt',
          ],
          cta: 'Pro testen',
          ctaHref: '#waitlist',
        },
      ],
    },
    pricing: {
      title: 'Faire Preise. Keine Tricks.',
      intro:
        'Free bleibt für immer kostenlos. Pro nimmt euch die Arbeit ab — 14 Tage gratis testen, ohne Kreditkarte. Während der Beta kostet alles nichts.',
      faq: [
        {
          q: 'Wann startet die Beta?',
          a: 'Frühjahr 2026. Wir nehmen 50 Bands rein, wöchentliche Calls inklusive. Trag dich auf der Warteliste ein.',
        },
        {
          q: 'Was passiert nach der Beta?',
          a: 'Beta-Bands bekommen 6 Monate Pro gratis. Free-Tier bleibt permanent. Pro startet bei 19 CHF/Monat.',
        },
        {
          q: 'Brauche ich eine Kreditkarte für den Trial?',
          a: 'Nein. 14 Tage Pro testen ohne Karte. Wenn ihr nichts macht, fallt ihr automatisch auf Free zurück.',
        },
        {
          q: 'Kann ich monatlich kündigen?',
          a: 'Ja. Monats-Abo monatlich kündbar, Jahres-Abo pro rata mit kleiner Bearbeitungsgebühr.',
        },
        {
          q: 'Wo werden die Daten gespeichert?',
          a: 'Supabase EU-Frankfurt. DSG- und DSGVO-konform. Auftragsverarbeitungsverträge mit allen Sub-Auftragnehmern.',
        },
        {
          q: 'Wird Klano auch in DE/AT/EU funktionieren?',
          a: 'Ja. Klano startet DACH-weit. Venue-Datenbank für CH/DE/AT von Anfang an.',
        },
      ],
    },
    personal: {
      num: '04',
      eyebrow: 'Wer wir sind',
      heading: 'Zwei Leute aus Zürich. Wir bauen das, weil uns die Band wichtig ist.',
      body:
        'Pascal hat 12 Jahre lang die Band-Orga gemacht und es gehasst. Marc baut seit 8 Jahren AI-Tools. Klano ist das, was wir uns gewünscht hätten — und was wir jetzt teilen.',
      signoff: 'Schreib uns: hello@klano.ai',
      people: [
        { initials: 'PK', name: 'Pascal', role: 'Produkt · Zürich' },
        { initials: 'MR', name: 'Marc', role: 'Engineering · Zürich' },
      ],
    },
    waitlist: {
      num: '05',
      eyebrow: 'Warteliste',
      heading: 'Hör auf, die Band zu managen.',
      subline:
        'Wir nehmen 50 Bands in die Beta — Frühjahr 2026. Trag deine Mail ein, wir melden uns rechtzeitig.',
      placeholder: 'band@deinedomain.com',
      submit: 'Anmelden',
      success: 'Du bist drin.',
      successPlaceholder: 'Wir melden uns im Frühjahr.',
      meta: 'Keine Kreditkarte · DSG/DSGVO · Made in Zürich',
    },
    footer: {
      tagline: 'Der Booking-Agent für Bands. Aus Zürich.',
      cols: [
        {
          heading: 'Produkt',
          links: [
            { label: 'Funktionen', href: '#features' },
            { label: 'Preise', href: '#pricing' },
            { label: 'App', href: 'https://app.klano.ai' },
          ],
        },
        {
          heading: 'Klano',
          links: [
            { label: 'Manifest', href: '/manifest' },
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
      legalLeft: '© 2026 Klano · Zürich',
      legalRight: 'klano.ai',
    },
  },
  en: {
    nav: {
      primaryCta: 'Get early access',
      loginLabel: 'Login',
      links: [
        { label: 'Features', href: '/en#features' },
        { label: 'Pricing', href: '/en/pricing' },
        { label: 'Manifesto', href: '/en#personal' },
        { label: 'Contact', href: 'mailto:hello@klano.ai' },
      ],
    },
    hero: {
      badge: 'Closed beta · Spring 2026',
      headline: 'The booking agent',
      headlineItalic: 'for bands.',
      subline:
        'Klano finds the right venues, drafts outreach in your voice, and follows up automatically. You rehearse. Klano works.',
      ctaPrimary: 'Get early access',
      ctaSecondary: 'See features',
    },
    demo: {
      num: '01',
      sectionLabel: 'Live in the app',
      bandLabel: 'Halbnacht — Bookings',
      statsLabel: '6 active · 1 new reply',
      cols: ['Venue', 'Status', 'Match', 'Last activity'],
      rows: [
        { venue: 'Helsinki', city: 'Zürich', status: 'replied', match: '81%', meta: 'Reply · May 17 · 800 CHF' },
        { venue: 'Bogen F', city: 'Zürich', status: 'opened', match: '94%', meta: 'Opened · yesterday 18:42' },
        { venue: 'Mascotte', city: 'Zürich', status: 'sent', match: '89%', meta: 'Sent · 2 days ago' },
        { venue: 'Sender', city: 'Winterthur', status: 'sent', match: '87%', meta: 'Sent · 7 days ago' },
      ],
      aiLabel: 'AI live',
      aiText: 'Reply from Helsinki is positive. Date & fee detected — confirm?',
      aiCta: 'Confirm',
    },
    features: {
      num: '02',
      eyebrow: 'Features',
      heading: 'Six hours a week — back in your calendar.',
      cards: [
        {
          icon: iconSearch,
          title: 'Venue matching',
          body: 'Curated DACH database. Klano matches your size, your region, your sound.',
        },
        {
          icon: iconBolt,
          title: 'Outreach drafts',
          body: 'Personal emails in DE or EN, in your band\'s voice. You read, click, send.',
        },
        {
          icon: iconInbox,
          title: 'Inbox AI',
          body: 'Replies from venues are classified: date, fee, tech specs extracted.',
        },
        {
          icon: iconCalendar,
          title: 'Auto follow-ups',
          body: 'After 7 and 14 days without reply, Klano follows up gently. Personal, not generic.',
        },
        {
          icon: iconUsers,
          title: 'Sync for the band',
          body: 'Availability in one place. Klano proposes rehearsal slots that work for everyone.',
        },
        {
          icon: iconShield,
          title: 'Privacy by default',
          body: 'Data in EU Frankfurt. GDPR-compliant. No third-party trackers.',
        },
      ],
    },
    plans: {
      num: '03',
      eyebrow: 'Pricing',
      heading: 'Free in beta. Pro when you book.',
      cards: [
        {
          name: 'Beta',
          price: 'free',
          priceMeta: '50 spots · Spring 2026',
          description: 'Full functionality for the first 50 bands. Weekly calls with the team.',
          features: ['Everything from Pro', 'Weekly calls', 'Direct product input', 'After beta: 6 months Pro free'],
          cta: 'Get a beta seat',
          ctaHref: '#waitlist',
          highlight: true,
        },
        {
          name: 'Free',
          price: '0 CHF',
          priceMeta: 'forever',
          description: 'For bands with 4–6 gigs a year. Klano stays in the background.',
          features: [
            'Up to 6 members',
            '10 outreach emails / month',
            'Manual inbox',
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
          description: 'For active bands. Klano takes the booking job entirely.',
          features: [
            'Unlimited outreach',
            'Auto follow-ups',
            'AI inbox classification',
            'Unlimited members',
            'Priority support',
            '190 CHF/year · save 17%',
          ],
          cta: 'Try Pro',
          ctaHref: '#waitlist',
        },
      ],
    },
    pricing: {
      title: 'Fair pricing. No tricks.',
      intro:
        "Free stays free forever. Pro takes the work off your plate — 14-day trial, no credit card. During beta everything is free.",
      faq: [
        {
          q: 'When does beta start?',
          a: 'Spring 2026. 50 bands, weekly calls included. Drop your email on the waitlist.',
        },
        {
          q: 'What happens after beta?',
          a: "Beta bands get 6 months Pro free. Free tier stays permanent. Pro starts at 19 CHF/month.",
        },
        {
          q: 'Do I need a credit card for the trial?',
          a: 'No. 14-day Pro trial, no card. If you do nothing, you fall back to Free automatically.',
        },
        {
          q: 'Can I cancel monthly?',
          a: 'Yes. Monthly is cancel-anytime, yearly is pro-rata with a small handling fee.',
        },
        {
          q: 'Where is the data stored?',
          a: 'Supabase EU Frankfurt. GDPR-compliant. DPA with every sub-processor.',
        },
        {
          q: 'Does Klano work in DE/AT/EU too?',
          a: 'Yes. DACH-wide from day one — venue database covers CH/DE/AT.',
        },
      ],
    },
    personal: {
      num: '04',
      eyebrow: 'Who we are',
      heading: 'Two people from Zürich. We build this because we care about the band.',
      body:
        'Pascal ran band logistics for 12 years and hated it. Marc has been building AI tools for 8 years. Klano is what we wished we had — and now we share it.',
      signoff: 'Write us: hello@klano.ai',
      people: [
        { initials: 'PK', name: 'Pascal', role: 'Product · Zürich' },
        { initials: 'MR', name: 'Marc', role: 'Engineering · Zürich' },
      ],
    },
    waitlist: {
      num: '05',
      eyebrow: 'Waitlist',
      heading: 'Stop running the band.',
      subline:
        "We're taking 50 bands into beta — Spring 2026. Drop your email, we'll write when we open up.",
      placeholder: 'band@yourdomain.com',
      submit: 'Sign up',
      success: 'You are in.',
      successPlaceholder: "We'll write in spring.",
      meta: 'No credit card · GDPR · Made in Zürich',
    },
    footer: {
      tagline: 'The booking agent for bands. From Zürich.',
      cols: [
        {
          heading: 'Product',
          links: [
            { label: 'Features', href: '/en#features' },
            { label: 'Pricing', href: '/en#pricing' },
            { label: 'App', href: 'https://app.klano.ai' },
          ],
        },
        {
          heading: 'Klano',
          links: [
            { label: 'Manifesto', href: '/en/manifesto' },
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
      legalLeft: '© 2026 Klano · Zürich',
      legalRight: 'klano.ai',
    },
  },
};

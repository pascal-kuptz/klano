/**
 * Static booking data used by /bookings (kanban) and /bookings/[id]
 * (detail). Replaced with live Supabase queries in v0.4 proper.
 */

export type Status = 'drafted' | 'sent' | 'opened' | 'replied' | 'booked';

export interface ThreadMessage {
  direction: 'outbound' | 'inbound';
  from: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string; // ISO
  classification?: {
    intent: 'positive' | 'negative' | 'question' | 'spam' | 'other';
    suggestedAction: 'wait' | 'reply' | 'archive';
    extractedDate?: string;
    extractedFee?: number;
    summary: string;
  };
}

export interface Booking {
  id: string;
  status: Status;
  venue: {
    name: string;
    city: string;
    country: 'CH' | 'DE' | 'AT';
    capacity: number;
    genres: string[];
    region: string;
  };
  match: number; // 0-100
  desiredDate?: string;
  agreedDate?: string;
  agreedFee?: number;
  thread: ThreadMessage[];
  meta: string; // short label for kanban
  createdAt: string;
}

const HALBNACHT = 'band-halbnacht-booking-{id}@inbound.klano.ai';

export const BOOKINGS: Record<string, Booking> = {
  helsinki: {
    id: 'helsinki',
    status: 'replied',
    venue: { name: 'Helsinki Klub', city: 'Zürich', country: 'CH', capacity: 250, genres: ['Indie', 'Electronic', 'Jazz'], region: 'Zürich' },
    match: 81,
    desiredDate: '2026-05-17',
    agreedFee: 800,
    meta: '17. Mai · 800 CHF',
    createdAt: '2026-04-22T08:14:00Z',
    thread: [
      {
        direction: 'outbound',
        from: HALBNACHT.replace('{id}', 'helsinki'),
        to: 'bookings@helsinkiklub.ch',
        subject: 'Anfrage Gig — Halbnacht',
        body: `Hallo Helsinki-Team,

wir sind Halbnacht, eine Indie-/Singer-Songwriter-Band aus Zürich. Eure Programmgestaltung der letzten Monate hat uns aufgefallen — besonders die Linie zwischen Indie und Live-Atmosphäre passt zu dem, was wir live machen.

Konkret: wir suchen für Frühjahr/Sommer 2026 ein Gig-Datum in Zürich. Unsere Bandgröße passt zu eurer Kapazität (250).

Soundproben: https://halbnacht.bandcamp.com

Hättet ihr für April–Juni 2026 freie Daten?

Beste Grüße,
Pascal · Halbnacht`,
        sentAt: '2026-04-22T08:14:00Z',
      },
      {
        direction: 'outbound',
        from: HALBNACHT.replace('{id}', 'helsinki'),
        to: 'bookings@helsinkiklub.ch',
        subject: 'Re: Anfrage Gig — Halbnacht',
        body: `Hallo nochmal,

nur ein freundlicher Reminder zu meiner Anfrage von letzter Woche. Falls die Mail untergegangen ist — kein Stress, wir freuen uns über jede Rückmeldung.

Beste Grüße,
Pascal`,
        sentAt: '2026-04-29T09:00:00Z',
      },
      {
        direction: 'inbound',
        from: 'sarah@helsinkiklub.ch',
        to: HALBNACHT.replace('{id}', 'helsinki'),
        subject: 'Re: Anfrage Gig — Halbnacht',
        body: `Hi Pascal,

danke für die Mail. Ja, der 17. Mai passt bei uns. Standard-Gage 800 CHF + 10% Door, Soundcheck 18:00 Uhr.

Tech-Specs hänge ich an. Lass uns gerne die Details per Telefon abklären.

Sarah · Helsinki Klub`,
        sentAt: '2026-04-30T11:42:00Z',
        classification: {
          intent: 'positive',
          suggestedAction: 'reply',
          extractedDate: '2026-05-17',
          extractedFee: 800,
          summary: 'Zusage für 17. Mai, 800 CHF + 10% Door. Tech-Specs angehängt.',
        },
      },
    ],
  },

  bogenf: {
    id: 'bogenf',
    status: 'opened',
    venue: { name: 'Bogen F', city: 'Zürich', country: 'CH', capacity: 180, genres: ['Indie', 'Rock'], region: 'Zürich' },
    match: 94,
    meta: 'Geöffnet · gestern 18:42',
    createdAt: '2026-04-28T08:00:00Z',
    thread: [
      {
        direction: 'outbound',
        from: HALBNACHT.replace('{id}', 'bogenf'),
        to: 'bookings@bogenf.ch',
        subject: 'Anfrage Gig — Halbnacht',
        body: `Hallo Bogen F-Team,

wir sind Halbnacht — Indie/Singer-Songwriter aus Zürich. Eure Akustik und das intimere Format (~180) passen exakt zu unserem Sound.

Wir suchen für Q2 2026 ein Gig-Datum. Würde sich lohnen.

Soundproben: https://halbnacht.bandcamp.com

Beste Grüße,
Pascal`,
        sentAt: '2026-04-28T08:00:00Z',
      },
    ],
  },

  mascotte: {
    id: 'mascotte',
    status: 'sent',
    venue: { name: 'Mascotte', city: 'Zürich', country: 'CH', capacity: 220, genres: ['Indie', 'Rock', 'Pop', 'Electronic'], region: 'Zürich' },
    match: 89,
    meta: 'Sent · vor 2 Tagen',
    createdAt: '2026-04-29T07:30:00Z',
    thread: [
      {
        direction: 'outbound',
        from: HALBNACHT.replace('{id}', 'mascotte'),
        to: 'bookings@mascotte.ch',
        subject: 'Anfrage Gig — Halbnacht',
        body: `Hallo Mascotte-Team,\n\nwir sind Halbnacht aus Zürich — Indie/Singer-Songwriter. Wir würden gerne im Frühjahr 2026 bei euch spielen.\n\nBeste Grüße,\nPascal`,
        sentAt: '2026-04-29T07:30:00Z',
      },
    ],
  },

  sender: {
    id: 'sender',
    status: 'sent',
    venue: { name: 'Sender', city: 'Winterthur', country: 'CH', capacity: 140, genres: ['Folk', 'Indie', 'Singer-Songwriter'], region: 'Zürich' },
    match: 87,
    meta: 'Sent · vor 7 Tagen',
    createdAt: '2026-04-23T10:00:00Z',
    thread: [
      {
        direction: 'outbound',
        from: HALBNACHT.replace('{id}', 'sender'),
        to: 'bookings@sender.ch',
        subject: 'Anfrage Gig — Halbnacht',
        body: `Hallo Sender-Team,\n\nHalbnacht — Singer-Songwriter aus Zürich, sucht ein Gig in Winterthur Q2 2026.\n\nBeste Grüße,\nPascal`,
        sentAt: '2026-04-23T10:00:00Z',
      },
    ],
  },

  kammgarn: {
    id: 'kammgarn',
    status: 'drafted',
    venue: { name: 'Kammgarn', city: 'Schaffhausen', country: 'CH', capacity: 300, genres: ['Rock', 'Jazz', 'Indie'], region: 'Schaffhausen' },
    match: 76,
    meta: 'Klano schreibt …',
    createdAt: '2026-05-01T07:00:00Z',
    thread: [],
  },
};

export const BOOKING_LIST: Booking[] = Object.values(BOOKINGS);

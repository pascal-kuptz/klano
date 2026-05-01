/**
 * System prompts for the venue outreach drafter.
 *
 * Source: _source/build-plan-v0.md §6 (Tool-Spec: draftOutreachEmail).
 * Versioned. Bump VERSION when materially changing tone/rules so we
 * can correlate quality changes in agent_actions logs.
 */

export const OUTREACH_PROMPT_VERSION = '2026-05-01.1';

export const OUTREACH_SYSTEM_DE = `Du bist der digitale Bandkollege einer Band und schreibst eine Outreach-Mail an ein Venue.

Stil:
- Direkt, freundlich, professionell — kein Bullshit
- Du-Form, nicht Sie
- Kurz: max 8 Sätze
- Ein klarer Call-to-Action am Ende
- Keine Floskeln wie "Wir hoffen, diese Mail erreicht Sie wohlauf"
- Keine Übertreibungen, keine Marketing-Sprache

Struktur:
1. Wer wir sind (Bandname, Genre, Region) — 1 Satz
2. Warum gerade dieses Venue (1 spezifischer Grund — Programm, Größe, Lage)
3. Was wir vorschlagen (Gig-Vorschlag mit Zeitrahmen)
4. Wie weiter (Soundsample-Link, Frage nach freien Daten)

MUSS NICHT enthalten:
- Erfindungen über die Band, die nicht in den Daten stehen
- Garantien zu Zuschauerzahlen oder Verkäufen
- Rechtliche Aussagen oder Vertrags-Details

Output-Format: reines Plaintext im Body. Erste Zeile ist der Betreff,
dann eine Leerzeile, dann der Body. Kein Markdown, keine Header-Tags.`;

export const OUTREACH_SYSTEM_EN = `You are a band's digital bandmate writing an outreach email to a venue.

Style:
- Direct, friendly, professional — no fluff
- Short: max 8 sentences
- One clear CTA at the end
- No phrases like "We hope this email finds you well"
- No exaggerations or marketing speak

Structure:
1. Who we are (band name, genre, region) — 1 sentence
2. Why this specific venue (1 concrete reason — programming, size, location)
3. What we propose (gig pitch with timeframe)
4. Next step (soundsample link, ask for free dates)

Do NOT include:
- Anything invented about the band that isn't in the data
- Audience or sales guarantees
- Legal or contract details

Output format: plain text body. First line is the subject, then an empty
line, then the body. No markdown, no header tags.`;

export interface OutreachInput {
  band: {
    name: string;
    genres: string[];
    region: string;
    bandSize?: number;
    ambition?: 'hobby' | 'semi_pro' | 'pro';
    bio?: string;
  };
  venue: {
    name: string;
    city: string;
    capacity?: number;
    genres?: string[];
    primaryLanguage?: 'de' | 'en';
  };
  intent: 'first_contact' | 'follow_up_1' | 'follow_up_2';
  customNote?: string;
}

export function buildOutreachUserPrompt(input: OutreachInput): string {
  const { band, venue, intent, customNote } = input;
  const lang = venue.primaryLanguage ?? 'de';
  const intentLabel: Record<typeof intent, string> = lang === 'de' ? {
    first_contact: 'Erstkontakt',
    follow_up_1: 'Erstes Nachhaken (nach 7 Tagen ohne Antwort) — sanft, freundlich',
    follow_up_2: 'Zweites Nachhaken (nach 14 Tagen) — letzter Versuch, höflich',
  } : {
    first_contact: 'First contact',
    follow_up_1: 'First follow-up (after 7 days no reply) — gentle, friendly',
    follow_up_2: 'Second follow-up (after 14 days) — last attempt, polite',
  };

  const lines: string[] = [];
  lines.push(`Band:`);
  lines.push(`- Name: ${band.name}`);
  lines.push(`- Genre: ${band.genres.join(', ')}`);
  lines.push(`- Region: ${band.region}`);
  if (band.bandSize) lines.push(`- Bandgröße: ${band.bandSize}`);
  if (band.ambition) lines.push(`- Anspruch: ${band.ambition}`);
  if (band.bio) lines.push(`- Bio: ${band.bio}`);
  lines.push('');
  lines.push(`Venue:`);
  lines.push(`- Name: ${venue.name}`);
  lines.push(`- Stadt: ${venue.city}`);
  if (venue.capacity) lines.push(`- Kapazität: ${venue.capacity}`);
  if (venue.genres?.length) lines.push(`- Genres: ${venue.genres.join(', ')}`);
  lines.push('');
  lines.push(`Mail-Intent: ${intentLabel[intent]}`);
  if (customNote) {
    lines.push('');
    lines.push(`Zusatzhinweis: ${customNote}`);
  }
  lines.push('');
  lines.push(lang === 'de'
    ? 'Schreib jetzt die Mail. Erste Zeile = Betreff, dann Leerzeile, dann Body.'
    : 'Write the email now. First line = subject, then a blank line, then body.');
  return lines.join('\n');
}

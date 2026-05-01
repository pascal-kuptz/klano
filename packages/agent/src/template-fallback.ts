import type { OutreachInput } from './prompts/outreach';

/**
 * Deterministic outreach template used when ANTHROPIC_API_KEY is missing
 * (local dev pre-setup). Same shape as the streamed Claude output so the
 * client doesn't need to branch.
 */
export function buildFallbackDraft(input: OutreachInput): { subject: string; body: string } {
  const { band, venue } = input;
  const lang = venue.primaryLanguage ?? 'de';
  const genre = band.genres.join('/').toLowerCase() || (lang === 'de' ? 'Live-Musik' : 'live music');
  const cap = venue.capacity ? ` (~${venue.capacity})` : '';
  const refGenre = venue.genres?.[0] ?? (lang === 'de' ? 'Indie' : 'Indie');

  if (lang === 'en') {
    return {
      subject: `Gig request — ${band.name}`,
      body: `Hi ${venue.name} team,

we're ${band.name}, a ${genre} band from ${band.region}. Your line between ${refGenre} and live atmosphere is exactly the kind of room we play.

We're looking for a date in spring or summer 2026 in ${venue.city}. Our band size fits your capacity${cap}, and we bring our own crowd from the region.

Soundsamples: https://${slug(band.name)}.bandcamp.com

Any free dates April–July? Quick reply would be great.

Cheers,
${band.name}`,
    };
  }

  return {
    subject: `Anfrage Gig — ${band.name}`,
    body: `Hallo ${venue.name}-Team,

wir sind ${band.name}, eine ${genre}-Band aus ${band.region}. Eure Programmgestaltung der letzten Monate hat uns aufgefallen — besonders eure Linie zwischen ${refGenre} und Live-Atmosphäre passt zu dem, was wir live machen.

Konkret: wir suchen für Frühjahr/Sommer 2026 ein Gig-Datum in ${venue.city}. Unsere Bandgröße passt zu eurer Kapazität${cap}, und wir bringen eigenes Publikum aus der Region mit.

Hört euch gerne mal rein: https://${slug(band.name)}.bandcamp.com

Hättet ihr für April–Juli 2026 freie Daten? Über eine kurze Rückmeldung würden wir uns freuen.

Beste Grüße,
${band.name}`,
  };
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 32);
}

/**
 * Static venue list used for client-side suggestions during onboarding
 * (the user is not authenticated yet, so we don't query Supabase).
 *
 * Mirrors `supabase/seed.sql` plus a few extras. Replace with a public
 * Edge Function reading from `venues` once we want richer matching.
 */
import type { Country } from '@klano/db';

export interface StaticVenue {
  id: string;
  name: string;
  city: string;
  country: Country;
  region: string;
  capacity: number;
  genres: string[];
}

export const STATIC_VENUES: StaticVenue[] = [
  { id: 'bogenf',    name: 'Bogen F',    city: 'Zürich',       country: 'CH', region: 'Zürich',       capacity: 180,  genres: ['indie', 'rock'] },
  { id: 'mascotte',  name: 'Mascotte',   city: 'Zürich',       country: 'CH', region: 'Zürich',       capacity: 220,  genres: ['indie', 'rock', 'pop', 'electronic'] },
  { id: 'sender',    name: 'Sender',     city: 'Winterthur',   country: 'CH', region: 'Zürich',       capacity: 140,  genres: ['folk', 'indie', 'singer-songwriter'] },
  { id: 'kammgarn',  name: 'Kammgarn',   city: 'Schaffhausen', country: 'CH', region: 'Schaffhausen', capacity: 300,  genres: ['rock', 'jazz', 'indie'] },
  { id: 'helsinki',  name: 'Helsinki Klub', city: 'Zürich',    country: 'CH', region: 'Zürich',       capacity: 250,  genres: ['indie', 'electronic', 'jazz'] },
  { id: 'lido',      name: 'Lido',       city: 'Berlin',       country: 'DE', region: 'Berlin',       capacity: 800,  genres: ['indie', 'rock'] },
  { id: 'badehaus',  name: 'Badehaus',   city: 'Berlin',       country: 'DE', region: 'Berlin',       capacity: 180,  genres: ['indie', 'singer-songwriter'] },
  { id: 'molotow',   name: 'Molotow',    city: 'Hamburg',      country: 'DE', region: 'Hamburg',      capacity: 250,  genres: ['indie', 'rock', 'punk'] },
  { id: 'strom',     name: 'Strom',      city: 'München',      country: 'DE', region: 'München',      capacity: 350,  genres: ['indie', 'rock', 'electronic'] },
  { id: 'flex',      name: 'Flex',       city: 'Wien',         country: 'AT', region: 'Wien',         capacity: 1000, genres: ['indie', 'electronic'] },
  { id: 'rhiz',      name: 'Rhiz',       city: 'Wien',         country: 'AT', region: 'Wien',         capacity: 200,  genres: ['electronic', 'experimental'] },
  { id: 'ppc',       name: 'P.P.C.',     city: 'Graz',         country: 'AT', region: 'Graz',         capacity: 700,  genres: ['indie', 'rock'] },
];

export interface MatchedVenue extends StaticVenue {
  match: number; // 0–100 score
}

interface MatchInput {
  country?: Country;
  regions: string[];
  genres: string[];
  ambition?: 'hobby' | 'semi_pro' | 'pro';
}

const CAPACITY_RANGE: Record<NonNullable<MatchInput['ambition']>, [number, number]> = {
  hobby: [50, 250],
  semi_pro: [100, 500],
  pro: [200, 2000],
};

/** Score: genre overlap × 3 + region match × 2 + capacity fit × 1, normalized to 0–100. */
export function matchVenues(input: MatchInput, limit = 3): MatchedVenue[] {
  const range: [number, number] = input.ambition ? CAPACITY_RANGE[input.ambition] : [50, 500];
  const [minCap, maxCap] = range;
  const wantGenres = new Set(input.genres.map((g) => g.toLowerCase()));
  const wantRegions = new Set(input.regions.map((r) => r.toLowerCase()));

  const candidates = input.country
    ? STATIC_VENUES.filter((v) => v.country === input.country)
    : STATIC_VENUES;

  const scored = candidates.map<MatchedVenue>((v) => {
    const genreHits = v.genres.filter((g) => wantGenres.has(g.toLowerCase())).length;
    const genreScore = wantGenres.size === 0 ? 0 : (genreHits / wantGenres.size) * 3;

    const regionHit = wantRegions.has(v.region.toLowerCase()) || wantRegions.has(v.city.toLowerCase());
    const regionScore = regionHit ? 2 : 0;

    const inRange = v.capacity >= minCap && v.capacity <= maxCap;
    const capacityScore = inRange ? 1 : 0;

    const raw = genreScore + regionScore + capacityScore; // 0..6
    const match = Math.round((raw / 6) * 100);
    return { ...v, match };
  });

  return scored
    .sort((a, b) => b.match - a.match)
    .slice(0, limit)
    .filter((v) => v.match > 0); // hide truly bad matches
}

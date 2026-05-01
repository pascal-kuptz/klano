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
  /** WGS84 coords for the venues map. Slight per-venue jitter avoids overlap. */
  lat: number;
  lng: number;
}

export const STATIC_VENUES: StaticVenue[] = [
  { id: 'bogenf',    name: 'Bogen F',    city: 'Zürich',       country: 'CH', region: 'Zürich',       capacity: 180,  genres: ['indie', 'rock'],                       lat: 47.3920, lng: 8.5180 },
  { id: 'mascotte',  name: 'Mascotte',   city: 'Zürich',       country: 'CH', region: 'Zürich',       capacity: 220,  genres: ['indie', 'rock', 'pop', 'electronic'],  lat: 47.3680, lng: 8.5450 },
  { id: 'sender',    name: 'Sender',     city: 'Winterthur',   country: 'CH', region: 'Zürich',       capacity: 140,  genres: ['folk', 'indie', 'singer-songwriter'],  lat: 47.5022, lng: 8.7386 },
  { id: 'kammgarn',  name: 'Kammgarn',   city: 'Schaffhausen', country: 'CH', region: 'Schaffhausen', capacity: 300,  genres: ['rock', 'jazz', 'indie'],               lat: 47.6968, lng: 8.6310 },
  { id: 'helsinki',  name: 'Helsinki Klub', city: 'Zürich',    country: 'CH', region: 'Zürich',       capacity: 250,  genres: ['indie', 'electronic', 'jazz'],         lat: 47.3825, lng: 8.5320 },
  { id: 'lido',      name: 'Lido',       city: 'Berlin',       country: 'DE', region: 'Berlin',       capacity: 800,  genres: ['indie', 'rock'],                       lat: 52.4920, lng: 13.4485 },
  { id: 'badehaus',  name: 'Badehaus',   city: 'Berlin',       country: 'DE', region: 'Berlin',       capacity: 180,  genres: ['indie', 'singer-songwriter'],          lat: 52.5085, lng: 13.4525 },
  { id: 'molotow',   name: 'Molotow',    city: 'Hamburg',      country: 'DE', region: 'Hamburg',      capacity: 250,  genres: ['indie', 'rock', 'punk'],               lat: 53.5511, lng: 9.9937 },
  { id: 'strom',     name: 'Strom',      city: 'München',      country: 'DE', region: 'München',      capacity: 350,  genres: ['indie', 'rock', 'electronic'],         lat: 48.1351, lng: 11.5820 },
  { id: 'flex',      name: 'Flex',       city: 'Wien',         country: 'AT', region: 'Wien',         capacity: 1000, genres: ['indie', 'electronic'],                 lat: 48.2160, lng: 16.3760 },
  { id: 'rhiz',      name: 'Rhiz',       city: 'Wien',         country: 'AT', region: 'Wien',         capacity: 200,  genres: ['electronic', 'experimental'],          lat: 48.1995, lng: 16.3530 },
  { id: 'ppc',       name: 'P.P.C.',     city: 'Graz',         country: 'AT', region: 'Graz',         capacity: 700,  genres: ['indie', 'rock'],                       lat: 47.0707, lng: 15.4395 },
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

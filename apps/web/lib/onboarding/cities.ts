import type { Country } from '@klano/db';

export interface City {
  name: string;
  lat: number;
  lng: number;
}

/**
 * DACH cities with coordinates. Mirrors the chip list in Step3Geo so
 * map markers and chips refer to the same set.
 */
export const CITIES: Record<Country, City[]> = {
  CH: [
    { name: 'Zürich', lat: 47.3769, lng: 8.5417 },
    { name: 'Bern', lat: 46.9481, lng: 7.4474 },
    { name: 'Basel', lat: 47.5596, lng: 7.5886 },
    { name: 'Luzern', lat: 47.0502, lng: 8.3093 },
    { name: 'St. Gallen', lat: 47.4245, lng: 9.3767 },
    { name: 'Winterthur', lat: 47.5022, lng: 8.7386 },
    { name: 'Schaffhausen', lat: 47.6968, lng: 8.631 },
    { name: 'Lausanne', lat: 46.5197, lng: 6.6323 },
    { name: 'Genf', lat: 46.2044, lng: 6.1432 },
  ],
  DE: [
    { name: 'Berlin', lat: 52.52, lng: 13.405 },
    { name: 'Hamburg', lat: 53.5511, lng: 9.9937 },
    { name: 'München', lat: 48.1351, lng: 11.582 },
    { name: 'Köln', lat: 50.9375, lng: 6.9603 },
    { name: 'Frankfurt', lat: 50.1109, lng: 8.6821 },
    { name: 'Leipzig', lat: 51.3397, lng: 12.3731 },
    { name: 'Stuttgart', lat: 48.7758, lng: 9.1829 },
    { name: 'Düsseldorf', lat: 51.2277, lng: 6.7735 },
    { name: 'Bremen', lat: 53.0793, lng: 8.8017 },
  ],
  AT: [
    { name: 'Wien', lat: 48.2082, lng: 16.3738 },
    { name: 'Graz', lat: 47.0707, lng: 15.4395 },
    { name: 'Linz', lat: 48.3069, lng: 14.2858 },
    { name: 'Salzburg', lat: 47.8095, lng: 13.055 },
    { name: 'Innsbruck', lat: 47.2692, lng: 11.4041 },
    { name: 'Klagenfurt', lat: 46.6249, lng: 14.305 },
  ],
};

/** Bounding box and center for each country, used for camera fly-to. */
export const COUNTRY_VIEW: Record<Country, { center: [number, number]; zoom: number }> = {
  CH: { center: [8.2, 46.85], zoom: 6.6 },
  DE: { center: [10.5, 51.2], zoom: 5.4 },
  AT: { center: [13.5, 47.7], zoom: 6.4 },
};

export const DACH_VIEW: { center: [number, number]; zoom: number } = {
  center: [10.5, 49.0],
  zoom: 4.6,
};

import type { Country } from '@klano/db';

/**
 * Administrative regions per DACH country at the level a band would
 * realistically tour at: Kantone (CH), Bundesländer (DE), Bundesländer (AT).
 *
 * Names match the `properties.name` field in the GeoJSON sources we load
 * from `click_that_hood` (see RegionMap.tsx). If you change the GeoJSON
 * source, re-check that names match exactly.
 */
export const REGIONS: Record<Country, string[]> = {
  CH: [
    'Zürich', 'Bern', 'Luzern', 'Uri', 'Schwyz', 'Obwalden', 'Nidwalden',
    'Glarus', 'Zug', 'Fribourg', 'Solothurn', 'Basel-Stadt', 'Basel-Landschaft',
    'Schaffhausen', 'Appenzell Ausserrhoden', 'Appenzell Innerrhoden',
    'St. Gallen', 'Graubünden', 'Aargau', 'Thurgau', 'Ticino', 'Vaud',
    'Valais', 'Neuchâtel', 'Genève', 'Jura',
  ],
  DE: [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
    'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
    'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
    'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
  ],
  AT: [
    'Burgenland', 'Kärnten', 'Niederösterreich', 'Oberösterreich',
    'Salzburg', 'Steiermark', 'Tirol', 'Vorarlberg', 'Wien',
  ],
};

/** Camera target per country (center + zoom for fly-to). */
export const COUNTRY_VIEW: Record<Country, { center: [number, number]; zoom: number }> = {
  CH: { center: [8.2, 46.85], zoom: 6.6 },
  DE: { center: [10.5, 51.2], zoom: 5.4 },
  AT: { center: [13.5, 47.7], zoom: 6.4 },
};

export const DACH_VIEW: { center: [number, number]; zoom: number } = {
  center: [10.5, 49.0],
  zoom: 4.6,
};

/** Public CDN URLs for simplified GeoJSON of administrative regions. */
export const GEOJSON_URL: Record<Country, string> = {
  CH: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/switzerland.geojson',
  DE: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/germany.geojson',
  AT: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/austria.geojson',
};

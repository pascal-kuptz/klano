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

/** Approximate bbox per country [west, south, east, north] for camera fitBounds. */
export const COUNTRY_BBOX: Record<Country, [number, number, number, number]> = {
  CH: [5.95, 45.82, 10.49, 47.81],
  DE: [5.87, 47.27, 15.04, 55.06],
  AT: [9.53, 46.37, 17.16, 49.02],
};

export const DACH_BBOX: [number, number, number, number] = [5.87, 45.82, 17.16, 55.06];

/**
 * Public CDN URLs for simplified GeoJSON of administrative regions.
 * Multiple URLs per country — first one that responds wins (used for resilience
 * because the click_that_hood repo doesn't ship every DACH country reliably).
 */
export const GEOJSON_URLS: Record<Country, string[]> = {
  CH: [
    'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/switzerland.geojson',
    'https://raw.githubusercontent.com/openZH/canton-geometries/master/cantons.geojson',
  ],
  DE: [
    'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/germany.geojson',
    'https://raw.githubusercontent.com/isellsoap/deutschlandGeoJSON/main/2_bundeslaender/2_hoch.geo.json',
  ],
  AT: [
    'https://raw.githubusercontent.com/ginseng666/GeoJSON-TopoJSON-Austria/master/2017/simplified-99.9/laender_999_geo.json',
    'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/austria-states.geojson',
    'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/austria.geojson',
  ],
};

/**
 * Some sources use different property names for the region label. We try
 * these in order on each feature and use the first non-empty value.
 */
export const NAME_PROPS = ['name', 'NAME', 'Name', 'BL', 'BL_NAME', 'NUTS_NAME'] as const;

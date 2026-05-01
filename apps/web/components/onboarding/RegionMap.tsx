'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, {
  type Map as MaplibreMap,
  type StyleSpecification,
  type LngLatBoundsLike,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Country } from '@klano/db';
import {
  COUNTRY_BBOX,
  DACH_BBOX,
  GEOJSON_URLS,
  NAME_PROPS,
} from '@/lib/onboarding/regions';

interface Props {
  countries: Country[];
  selectedRegions: string[];
  /** Called only when exactly one country is active. */
  onToggleRegion: (regionName: string) => void;
}

/** Fully neutral style — no tiles, no labels, no roads. */
const STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#fafafa' } }],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

const SOURCE_ID = 'regions';
const FILL_LAYER = 'regions-fill';
const HOVER_LAYER = 'regions-hover';
const SELECTED_LAYER = 'regions-selected';
const OUTLINE_LAYER = 'regions-outline';

type FC = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;

function getName(props: Record<string, unknown> | null | undefined): string | null {
  if (!props) return null;
  for (const key of NAME_PROPS) {
    const v = props[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

/** Fetches the first GeoJSON source that returns 2xx for a given country. */
async function fetchCountryGeoJson(country: Country): Promise<FC | null> {
  const urls = GEOJSON_URLS[country];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const fc = (await r.json()) as FC;
      // Normalize: ensure each feature has properties.name
      for (const f of fc.features) {
        const name = getName(f.properties as Record<string, unknown>);
        if (!f.properties) f.properties = {} as Record<string, unknown>;
        (f.properties as Record<string, unknown>).name = name ?? `${country}-region`;
      }
      return fc;
    } catch (e) {
      console.warn(`[RegionMap] ${country} ${url} failed`, e);
    }
  }
  return null;
}

export function RegionMap({ countries, selectedRegions, onToggleRegion }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const cacheRef = useRef<Partial<Record<Country, FC>>>({});
  const selectedRef = useRef(selectedRegions);
  const onToggleRef = useRef(onToggleRegion);
  const interactiveRef = useRef(countries.length === 1);
  const hoveredRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    selectedRef.current = selectedRegions;
    onToggleRef.current = onToggleRegion;
    interactiveRef.current = countries.length === 1;
  }, [selectedRegions, onToggleRegion, countries]);

  // Init map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      bounds: DACH_BBOX as LngLatBoundsLike,
      fitBoundsOptions: { padding: 24 },
      attributionControl: false,
    });

    map.on('load', () => {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        promoteId: 'name',
      });

      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: { 'fill-color': '#ffffff', 'fill-opacity': 1 },
      });

      map.addLayer({
        id: HOVER_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': '#0a0a0a',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.06,
            0,
          ],
        },
      });

      map.addLayer({
        id: SELECTED_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': '#0a0a0a',
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            1,
            0,
          ],
        },
      });

      map.addLayer({
        id: OUTLINE_LAYER,
        type: 'line',
        source: SOURCE_ID,
        paint: {
          'line-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#0a0a0a',
            '#d4d4d8',
          ],
          'line-width': 1,
        },
      });

      map.on('click', FILL_LAYER, (e) => {
        if (!interactiveRef.current) return;
        const f = e.features?.[0];
        if (!f) return;
        const name = (f.properties as { name?: string })?.name;
        if (name) onToggleRef.current(name);
      });

      map.on('mousemove', FILL_LAYER, (e) => {
        if (!interactiveRef.current) {
          map.getCanvas().style.cursor = '';
          return;
        }
        const f = e.features?.[0];
        if (!f) return;
        map.getCanvas().style.cursor = 'pointer';
        const name = (f.properties as { name?: string })?.name ?? null;
        if (hoveredRef.current && hoveredRef.current !== name) {
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredRef.current },
            { hover: false },
          );
        }
        hoveredRef.current = name;
        if (name) {
          map.setFeatureState({ source: SOURCE_ID, id: name }, { hover: true });
        }
      });

      map.on('mouseleave', FILL_LAYER, () => {
        map.getCanvas().style.cursor = '';
        if (hoveredRef.current) {
          map.setFeatureState(
            { source: SOURCE_ID, id: hoveredRef.current },
            { hover: false },
          );
          hoveredRef.current = null;
        }
      });
    });

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Load + apply data when countries change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = async () => {
      // Camera: union of selected country bboxes, or DACH if empty.
      if (countries.length === 0) {
        map.fitBounds(DACH_BBOX as LngLatBoundsLike, { padding: 24, duration: 800 });
        const src = map.getSource(SOURCE_ID);
        if (src && 'setData' in src) {
          (src as maplibregl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
        return;
      }

      const bbox = countries.reduce<[number, number, number, number]>(
        (acc, c) => {
          const b = COUNTRY_BBOX[c];
          return [
            Math.min(acc[0], b[0]),
            Math.min(acc[1], b[1]),
            Math.max(acc[2], b[2]),
            Math.max(acc[3], b[3]),
          ];
        },
        [Infinity, Infinity, -Infinity, -Infinity],
      );
      map.fitBounds(bbox, { padding: 32, duration: 800 });

      // Load GeoJSON for any country not already cached.
      setError(null);
      await Promise.all(
        countries.map(async (c) => {
          if (cacheRef.current[c]) return;
          const fc = await fetchCountryGeoJson(c);
          if (fc) cacheRef.current[c] = fc;
        }),
      );

      // Merge features.
      const merged: FC = { type: 'FeatureCollection', features: [] };
      const missing: Country[] = [];
      for (const c of countries) {
        const fc = cacheRef.current[c];
        if (fc) merged.features.push(...fc.features);
        else missing.push(c);
      }

      if (merged.features.length === 0) {
        setError('Karte konnte nicht geladen werden.');
        return;
      }
      if (missing.length) {
        setError(`Daten für ${missing.join(', ')} fehlen.`);
      }

      const src = map.getSource(SOURCE_ID);
      if (src && 'setData' in src) {
        (src as maplibregl.GeoJSONSource).setData(merged);
      }

      // Re-apply selected feature-state.
      for (const f of merged.features) {
        const name = (f.properties as { name?: string })?.name;
        if (name) {
          map.setFeatureState(
            { source: SOURCE_ID, id: name },
            { selected: selectedRef.current.includes(name) },
          );
        }
      }
    };

    if (map.loaded()) apply();
    else map.once('load', apply);
  }, [countries]);

  // Update selected feature-state when selection changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const c of countries) {
      const fc = cacheRef.current[c];
      if (!fc) continue;
      for (const f of fc.features) {
        const name = (f.properties as { name?: string })?.name;
        if (!name) continue;
        map.setFeatureState(
          { source: SOURCE_ID, id: name },
          { selected: selectedRegions.includes(name) },
        );
      }
    }
  }, [selectedRegions, countries]);

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" aria-label="Region map" />
      {error && (
        <div className="map-error">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
            {error}
          </p>
        </div>
      )}
      <style jsx>{`
        .map-wrap {
          position: relative;
          width: 100%;
          height: 320px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-klano-border);
          background: #fafafa;
        }
        .map { width: 100%; height: 100%; }
        .map-error {
          position: absolute;
          left: 12px;
          top: 12px;
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid var(--color-klano-border);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}

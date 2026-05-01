'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, {
  type Map as MaplibreMap,
  type StyleSpecification,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Country } from '@klano/db';
import { COUNTRY_VIEW, DACH_VIEW, GEOJSON_URL } from '@/lib/onboarding/regions';

interface Props {
  country?: Country;
  selected: string[];
  onToggle: (regionName: string) => void;
}

/** Fully neutral style — no tiles, no labels, no roads. Just our polygons. */
const STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [
    {
      id: 'bg',
      type: 'background',
      paint: { 'background-color': '#fafafa' },
    },
  ],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

const SOURCE_ID = 'regions';
const FILL_LAYER = 'regions-fill';
const OUTLINE_LAYER = 'regions-outline';
const HOVER_LAYER = 'regions-hover';
const SELECTED_LAYER = 'regions-selected';

type FC = GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon, { name: string }>;

export function RegionMap({ country, selected, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const dataCacheRef = useRef<Partial<Record<Country, FC>>>({});
  const selectedRef = useRef(selected);
  const onToggleRef = useRef(onToggle);
  const hoveredRef = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    selectedRef.current = selected;
    onToggleRef.current = onToggle;
  }, [selected, onToggle]);

  // Init map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: DACH_VIEW.center,
      zoom: DACH_VIEW.zoom,
      attributionControl: false,
    });

    map.on('load', () => {
      // Empty source initially, populated when country loads.
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        promoteId: 'name',
      });

      // Base fill: subtle warm gray
      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': '#ffffff',
          'fill-opacity': 1,
        },
      });

      // Hover fill — soft tint
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

      // Selected fill — solid black
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

      // Outline always
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

      // Click → toggle
      map.on('click', FILL_LAYER, (e) => {
        const f = e.features?.[0];
        if (!f) return;
        const name = (f.properties as { name?: string })?.name;
        if (name) onToggleRef.current(name);
      });

      // Hover state
      map.on('mousemove', FILL_LAYER, (e) => {
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

  // Load + update GeoJSON on country change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      const view = country ? COUNTRY_VIEW[country] : DACH_VIEW;
      map.flyTo({ center: view.center, zoom: view.zoom, speed: 1.4, curve: 1.6 });

      if (!country) {
        const src = map.getSource(SOURCE_ID);
        if (src && 'setData' in src) {
          (src as maplibregl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: [],
          });
        }
        return;
      }

      const cached = dataCacheRef.current[country];
      if (cached) {
        applyData(map, cached, selectedRef.current);
        return;
      }

      setError(null);
      fetch(GEOJSON_URL[country])
        .then((r) => {
          if (!r.ok) throw new Error(`GeoJSON ${r.status}`);
          return r.json();
        })
        .then((fc: FC) => {
          dataCacheRef.current[country] = fc;
          applyData(map, fc, selectedRef.current);
        })
        .catch((e) => {
          console.error('RegionMap load failed', e);
          setError('Karte konnte nicht geladen werden.');
        });
    };

    if (map.loaded()) apply();
    else map.once('load', apply);
  }, [country]);

  // Update selected feature-state when selection changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !country) return;
    const fc = dataCacheRef.current[country];
    if (!fc) return;
    for (const f of fc.features) {
      const name = f.properties.name;
      map.setFeatureState(
        { source: SOURCE_ID, id: name },
        { selected: selected.includes(name) },
      );
    }
  }, [selected, country]);

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
          height: 360px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-klano-border);
          background: #fafafa;
        }
        .map { width: 100%; height: 100%; }
        .map-error {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(250, 250, 250, 0.85);
        }
      `}</style>
    </div>
  );
}

function applyData(map: MaplibreMap, fc: FC, selected: string[]) {
  const src = map.getSource(SOURCE_ID);
  if (!src || !('setData' in src)) return;
  (src as maplibregl.GeoJSONSource).setData(fc);
  // Re-apply selected states
  for (const f of fc.features) {
    const name = f.properties.name;
    map.setFeatureState({ source: SOURCE_ID, id: name }, { selected: selected.includes(name) });
  }
}

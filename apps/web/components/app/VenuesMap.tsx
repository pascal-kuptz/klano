'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl, {
  type Map as MaplibreMap,
  type StyleSpecification,
  type LngLatBoundsLike,
  type Marker,
} from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Country } from '@klano/db';
import { GEOJSON_URLS, NAME_PROPS, DACH_BBOX } from '@/lib/onboarding/regions';
import type { StaticVenue } from '@/lib/onboarding/venues-static';

interface Props {
  venues: StaticVenue[];
  /** Called when a venue marker is clicked. Page scrolls/highlights its card. */
  onSelect?: (id: string) => void;
  /** Currently selected/hovered venue id (highlights its marker). */
  activeId?: string | null;
}

const COUNTRIES: Country[] = ['CH', 'DE', 'AT'];

const STYLE: StyleSpecification = {
  version: 8,
  sources: {},
  layers: [{ id: 'bg', type: 'background', paint: { 'background-color': '#fafafa' } }],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

const SOURCE_ID = 'regions';
const FILL_LAYER = 'regions-fill';
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

async function fetchCountryGeoJson(country: Country): Promise<FC | null> {
  for (const url of GEOJSON_URLS[country]) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const fc = (await r.json()) as FC;
      for (const f of fc.features) {
        const name = getName(f.properties as Record<string, unknown>);
        if (!f.properties) f.properties = {} as Record<string, unknown>;
        (f.properties as Record<string, unknown>).name = name ?? `${country}-region`;
      }
      return fc;
    } catch (e) {
      console.warn(`[VenuesMap] ${country} ${url} failed`, e);
    }
  }
  return null;
}

export function VenuesMap({ venues, onSelect, activeId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Map<string, Marker>>(new Map());
  const onSelectRef = useRef(onSelect);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Init map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      bounds: DACH_BBOX as LngLatBoundsLike,
      fitBoundsOptions: { padding: 32 },
      attributionControl: false,
    });

    map.on('load', async () => {
      // Load all 3 country GeoJSONs in parallel and merge.
      setError(null);
      const results = await Promise.all(COUNTRIES.map(fetchCountryGeoJson));
      const merged: FC = { type: 'FeatureCollection', features: [] };
      const missing: Country[] = [];
      results.forEach((fc, i) => {
        if (fc) merged.features.push(...fc.features);
        else missing.push(COUNTRIES[i]!);
      });
      if (merged.features.length === 0) {
        setError('Karte konnte nicht geladen werden.');
        return;
      }
      if (missing.length) setError(`Daten für ${missing.join(', ')} fehlen.`);

      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: merged,
        promoteId: 'name',
      });
      map.addLayer({
        id: FILL_LAYER,
        type: 'fill',
        source: SOURCE_ID,
        paint: { 'fill-color': '#ffffff', 'fill-opacity': 1 },
      });
      map.addLayer({
        id: OUTLINE_LAYER,
        type: 'line',
        source: SOURCE_ID,
        paint: { 'line-color': '#e4e4e7', 'line-width': 0.75 },
      });
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), 'top-right');

    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  // Add / refresh venue markers when the venue list changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const apply = () => {
      // Remove markers no longer in list.
      const ids = new Set(venues.map((v) => v.id));
      for (const [id, m] of markersRef.current.entries()) {
        if (!ids.has(id)) {
          m.remove();
          markersRef.current.delete(id);
        }
      }
      // Add or update.
      for (const v of venues) {
        const existing = markersRef.current.get(v.id);
        if (existing) {
          existing.setLngLat([v.lng, v.lat]);
          paintMarkerEl(existing.getElement(), v, activeId === v.id);
          continue;
        }
        const el = createMarkerEl(v, activeId === v.id);
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectRef.current?.(v.id);
        });
        const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat([v.lng, v.lat])
          .addTo(map);
        markersRef.current.set(v.id, marker);
      }
    };
    if (map.loaded()) apply();
    else map.once('load', apply);
  }, [venues, activeId]);

  // Repaint active marker when activeId changes (without rebuilding).
  useEffect(() => {
    for (const v of venues) {
      const marker = markersRef.current.get(v.id);
      if (!marker) continue;
      paintMarkerEl(marker.getElement(), v, activeId === v.id);
    }
  }, [activeId, venues]);

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" aria-label="Venues map" />
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
          height: 380px;
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
        :global(.maplibregl-ctrl-group) {
          background: var(--color-klano-surface) !important;
          border: 1px solid var(--color-klano-border) !important;
          box-shadow: none !important;
        }
        :global(.maplibregl-ctrl-group button) {
          width: 32px !important;
          height: 32px !important;
        }
      `}</style>
    </div>
  );
}

// === Marker element ===

function createMarkerEl(venue: StaticVenue, active: boolean): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'klano-venue-marker';
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', venue.name);
  el.style.cursor = 'pointer';
  el.style.position = 'relative';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.gap = '6px';

  const dot = document.createElement('span');
  dot.className = 'klano-venue-dot';
  dot.style.display = 'inline-block';
  dot.style.borderRadius = '50%';
  dot.style.transition = 'all 150ms ease';
  el.appendChild(dot);

  const label = document.createElement('span');
  label.className = 'klano-venue-label';
  label.textContent = venue.name;
  label.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  label.style.fontSize = '11px';
  label.style.fontWeight = '500';
  label.style.padding = '2px 8px';
  label.style.borderRadius = '999px';
  label.style.transition = 'all 150ms ease';
  label.style.whiteSpace = 'nowrap';
  el.appendChild(label);

  paintMarkerEl(el, venue, active);
  return el;
}

function paintMarkerEl(el: HTMLElement, _venue: StaticVenue, active: boolean) {
  const dot = el.querySelector<HTMLElement>('.klano-venue-dot');
  const label = el.querySelector<HTMLElement>('.klano-venue-label');
  if (!dot || !label) return;
  if (active) {
    dot.style.width = '14px';
    dot.style.height = '14px';
    dot.style.background = '#0a0a0a';
    dot.style.border = '2px solid #ffffff';
    dot.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.2)';
    label.style.background = '#0a0a0a';
    label.style.color = '#ffffff';
    label.style.border = '1px solid #0a0a0a';
  } else {
    dot.style.width = '9px';
    dot.style.height = '9px';
    dot.style.background = '#0a0a0a';
    dot.style.border = '2px solid #ffffff';
    dot.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    label.style.background = 'rgba(255,255,255,0.85)';
    label.style.color = '#52525b';
    label.style.border = '1px solid #e4e4e7';
    (label.style as CSSStyleDeclaration & { backdropFilter?: string }).backdropFilter = 'blur(4px)';
  }
}

'use client';

import { useEffect, useRef } from 'react';
import maplibregl, { type Map as MaplibreMap, type Marker, type StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Country } from '@klano/db';
import { CITIES, COUNTRY_VIEW, DACH_VIEW, type City } from '@/lib/onboarding/cities';

interface Props {
  country?: Country;
  selected: string[]; // city names
  onToggle: (cityName: string) => void;
}

/**
 * Minimal raster style — uses public OSM tiles (fine for low-volume
 * onboarding traffic). For prod scale switch to MapTiler/Stadia keyed
 * vector style. https://operations.osmfoundation.org/policies/tiles/
 */
const STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
      maxzoom: 19,
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      paint: {
        'raster-saturation': -1,
        'raster-contrast': -0.05,
        'raster-brightness-max': 0.95,
      },
    },
  ],
  glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
};

export function RegionMap({ country, selected, onToggle }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MaplibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const selectedRef = useRef(selected);
  const onToggleRef = useRef(onToggle);

  // Keep refs in sync so marker click closures stay current.
  useEffect(() => {
    selectedRef.current = selected;
    onToggleRef.current = onToggle;
  }, [selected, onToggle]);

  // Initialize map once.
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE,
      center: DACH_VIEW.center,
      zoom: DACH_VIEW.zoom,
      attributionControl: false,
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new maplibregl.AttributionControl({ compact: true, customAttribution: '© OSM' }),
      'bottom-right',
    );
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to country and rebuild markers when country changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up old markers
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    const view = country ? COUNTRY_VIEW[country] : DACH_VIEW;
    map.flyTo({ center: view.center, zoom: view.zoom, speed: 1.4, curve: 1.6 });

    if (!country) return;

    const cities = CITIES[country];
    for (const city of cities) {
      const el = createMarkerEl(city, selectedRef.current.includes(city.name));
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onToggleRef.current(city.name);
      });
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([city.lng, city.lat])
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [country]);

  // Restyle existing markers when selection changes (without rebuilding).
  useEffect(() => {
    if (!country) return;
    const cities = CITIES[country];
    markersRef.current.forEach((marker, i) => {
      const city = cities[i];
      if (!city) return;
      const el = marker.getElement();
      paintMarkerEl(el, city, selected.includes(city.name));
    });
  }, [selected, country]);

  return (
    <div className="map-wrap">
      <div ref={containerRef} className="map" aria-label="Region map" />
      <style jsx>{`
        .map-wrap {
          position: relative;
          width: 100%;
          height: 360px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--color-klano-border);
          background: var(--color-klano-surface-2);
        }
        .map { width: 100%; height: 100%; }
        :global(.maplibregl-ctrl-attrib) {
          font-size: 10px !important;
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
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

// === Marker element factory ===

function createMarkerEl(city: City, isSelected: boolean): HTMLDivElement {
  const el = document.createElement('div');
  el.className = 'klano-marker';
  el.setAttribute('role', 'button');
  el.setAttribute('aria-label', city.name);
  el.style.cursor = 'pointer';
  el.style.position = 'relative';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.gap = '6px';

  const dot = document.createElement('span');
  dot.className = 'klano-marker-dot';
  dot.style.display = 'inline-block';
  dot.style.borderRadius = '50%';
  dot.style.transition = 'all 150ms ease';
  el.appendChild(dot);

  const label = document.createElement('span');
  label.className = 'klano-marker-label';
  label.textContent = city.name;
  label.style.fontFamily = 'Inter Variable, system-ui, sans-serif';
  label.style.fontSize = '11px';
  label.style.fontWeight = '500';
  label.style.padding = '2px 6px';
  label.style.borderRadius = '6px';
  label.style.transition = 'all 150ms ease';
  label.style.whiteSpace = 'nowrap';
  el.appendChild(label);

  paintMarkerEl(el, city, isSelected);
  return el;
}

function paintMarkerEl(el: HTMLElement, _city: City, isSelected: boolean) {
  const dot = el.querySelector<HTMLElement>('.klano-marker-dot');
  const label = el.querySelector<HTMLElement>('.klano-marker-label');
  if (!dot || !label) return;

  if (isSelected) {
    dot.style.width = '12px';
    dot.style.height = '12px';
    dot.style.background = '#0a0a0a';
    dot.style.border = '2px solid #ffffff';
    dot.style.boxShadow = '0 0 0 1px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.15)';

    label.style.background = '#0a0a0a';
    label.style.color = '#ffffff';
    label.style.border = '1px solid #0a0a0a';
  } else {
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.background = '#ffffff';
    dot.style.border = '1.5px solid #52525b';
    dot.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';

    label.style.background = 'rgba(255,255,255,0.85)';
    label.style.color = '#52525b';
    label.style.border = '1px solid #e4e4e7';
    label.style.backdropFilter = 'blur(4px)';
  }
}

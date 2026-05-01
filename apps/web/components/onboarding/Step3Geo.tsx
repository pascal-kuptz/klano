'use client';

import dynamic from 'next/dynamic';
import type { Country } from '@klano/db';
import { useWizard } from './WizardProvider';
import { CITIES } from '@/lib/onboarding/cities';
import { cn } from '@/lib/cn';

// MapLibre uses window/canvas — load only on the client.
const RegionMap = dynamic(() => import('./RegionMap').then((m) => m.RegionMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] rounded-[16px] border border-klano-border bg-klano-surface-2 flex items-center justify-center">
      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
        Karte lädt …
      </span>
    </div>
  ),
});

const COUNTRIES: { code: Country; flag: string; name: string }[] = [
  { code: 'CH', flag: '🇨🇭', name: 'Schweiz' },
  { code: 'DE', flag: '🇩🇪', name: 'Deutschland' },
  { code: 'AT', flag: '🇦🇹', name: 'Österreich' },
];

const MAX_REGIONS = 5;

export function Step3Geo() {
  const { state, dispatch } = useWizard();
  const { country, regions } = state.band;

  function setCountry(c: Country) {
    if (country === c) return;
    dispatch({ type: 'patch-band', patch: { country: c, regions: [] } });
  }

  function toggleRegion(r: string) {
    const has = regions.includes(r);
    let next: string[];
    if (has) next = regions.filter((x) => x !== r);
    else if (regions.length >= MAX_REGIONS) return;
    else next = [...regions, r];
    dispatch({ type: 'patch-band', patch: { regions: next } });
  }

  return (
    <div className="max-w-[760px] mx-auto w-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
        03 / Region
      </p>
      <h2
        className="text-klano-text leading-[1.05] mb-10"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          letterSpacing: '-0.02em',
        }}
      >
        Wo seid ihr unterwegs?
      </h2>

      {/* Country picker */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {COUNTRIES.map((c) => {
          const active = country === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setCountry(c.code)}
              className={cn(
                'h-20 flex flex-col items-center justify-center gap-1 rounded-[16px] border transition-colors',
                active
                  ? 'border-klano-text bg-klano-surface'
                  : 'border-klano-border bg-klano-surface hover:border-klano-border-strong',
              )}
            >
              <span className="text-[28px] leading-none">{c.flag}</span>
              <span className="text-[13px] font-medium text-klano-text">{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="mb-6">
        <RegionMap country={country} selected={regions} onToggle={toggleRegion} />
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-3">
          {country
            ? regions.length
              ? `${regions.length} / ${MAX_REGIONS} ausgewählt — Klick auf Marker zum Toggle`
              : 'Wähl bis zu 5 Städte. Klick auf einen Marker.'
            : 'Land wählen, dann Karte fokussiert.'}
        </p>
      </div>

      {/* Quick-pick chips (in case map markers are missed) */}
      {country && (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
            Schnellauswahl
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES[country].map((city) => {
              const active = regions.includes(city.name);
              const disabled = !active && regions.length >= MAX_REGIONS;
              return (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => toggleRegion(city.name)}
                  disabled={disabled}
                  className={cn(
                    'h-9 px-4 rounded-full text-sm transition-colors border',
                    active
                      ? 'bg-klano-text text-klano-action-fg border-klano-text'
                      : 'bg-klano-surface text-klano-text-2 border-klano-border hover:border-klano-border-strong hover:text-klano-text',
                    disabled && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

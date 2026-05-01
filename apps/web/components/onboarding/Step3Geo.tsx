'use client';

import dynamic from 'next/dynamic';
import type { Country } from '@klano/db';
import { useWizard } from './WizardProvider';
import { REGIONS } from '@/lib/onboarding/regions';
import { cn } from '@/lib/cn';

// MapLibre uses window/canvas — load only on the client.
const RegionMap = dynamic(() => import('./RegionMap').then((m) => m.RegionMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] rounded-[16px] border border-klano-border bg-klano-surface-2 flex items-center justify-center">
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
  const { countries, regions } = state.band;

  const single = countries.length === 1;
  const activeCountry = countries[0];

  function toggleCountry(c: Country) {
    const has = countries.includes(c);
    const next = has ? countries.filter((x) => x !== c) : [...countries, c];
    // Region picks only make sense with exactly one country — clear when crossing that line.
    const nextRegions = next.length === 1 ? regions : [];
    dispatch({ type: 'patch-band', patch: { countries: next, regions: nextRegions } });
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
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
        03 / Region
      </p>
      <h2
        className="text-klano-text leading-[1.05] mb-2"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          letterSpacing: '-0.02em',
        }}
      >
        Wo seid ihr unterwegs?
      </h2>
      <p className="text-[13px] text-klano-text-2 mb-6">
        Mehrere Länder gleichzeitig wählbar. Bei einem Land kannst du Kantone bzw. Bundesländer pinpointen.
      </p>

      {/* Country pills (multi-select) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {COUNTRIES.map((c) => {
          const active = countries.includes(c.code);
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => toggleCountry(c.code)}
              className={cn(
                'h-10 px-4 inline-flex items-center gap-2 rounded-full text-sm border transition-colors',
                active
                  ? 'bg-klano-text text-klano-action-fg border-klano-text'
                  : 'bg-klano-surface text-klano-text-2 border-klano-border hover:border-klano-border-strong hover:text-klano-text',
              )}
            >
              <span className="text-[16px] leading-none">{c.flag}</span>
              <span className="font-medium">{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* Map */}
      <div className="mb-4">
        <RegionMap
          countries={countries}
          selectedRegions={regions}
          onToggleRegion={toggleRegion}
        />
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-3">
          {countries.length === 0 && 'Land wählen — Karte zoomt rein.'}
          {countries.length > 1 &&
            `${countries.length} Länder — ihr seid in ganz ${countries.join(', ')} unterwegs.`}
          {single && activeCountry && (
            regions.length
              ? `${regions.length} / ${MAX_REGIONS} ausgewählt — Klick auf Region zum Toggle`
              : `Klick direkt auf ${activeCountry === 'CH' ? 'Kantone' : 'Bundesländer'} (1–5).`
          )}
        </p>
      </div>

      {/* Quick-pick chips: only when single country */}
      {single && activeCountry && (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-2">
            Schnellauswahl
          </p>
          <div className="flex flex-wrap gap-1.5">
            {REGIONS[activeCountry].map((region) => {
              const active = regions.includes(region);
              const disabled = !active && regions.length >= MAX_REGIONS;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleRegion(region)}
                  disabled={disabled}
                  className={cn(
                    'h-8 px-3 rounded-full text-[12px] transition-colors border',
                    active
                      ? 'bg-klano-text text-klano-action-fg border-klano-text'
                      : 'bg-klano-surface text-klano-text-2 border-klano-border hover:border-klano-border-strong hover:text-klano-text',
                    disabled && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

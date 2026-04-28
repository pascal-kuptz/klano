'use client';

import type { Country } from '@klano/db';
import { useWizard } from './WizardProvider';
import { cn } from '@/lib/cn';

const COUNTRIES: { code: Country; flag: string; name: string }[] = [
  { code: 'CH', flag: '🇨🇭', name: 'Schweiz' },
  { code: 'DE', flag: '🇩🇪', name: 'Deutschland' },
  { code: 'AT', flag: '🇦🇹', name: 'Österreich' },
];

const REGIONS_BY_COUNTRY: Record<Country, string[]> = {
  CH: ['Zürich', 'Bern', 'Basel', 'Luzern', 'St. Gallen', 'Winterthur', 'Schaffhausen', 'Lausanne', 'Genf'],
  DE: ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Leipzig', 'Stuttgart', 'Düsseldorf', 'Bremen'],
  AT: ['Wien', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt'],
};

export function Step3Geo() {
  const { state, dispatch } = useWizard();
  const { country, regions } = state.band;

  function setCountry(c: Country) {
    if (country === c) return;
    // Reset regions when country switches
    dispatch({ type: 'patch-band', patch: { country: c, regions: [] } });
  }

  function toggleRegion(r: string) {
    const has = regions.includes(r);
    let next: string[];
    if (has) next = regions.filter((x) => x !== r);
    else if (regions.length >= 5) return;
    else next = [...regions, r];
    dispatch({ type: 'patch-band', patch: { regions: next } });
  }

  const cities = country ? REGIONS_BY_COUNTRY[country] : [];

  return (
    <div className="max-w-[640px] mx-auto w-full">
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

      <div className="grid grid-cols-3 gap-3 mb-10">
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

      {country && (
        <>
          <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
            Städte / Regionen <span className="lowercase">(1–5)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {cities.map((r) => {
              const active = regions.includes(r);
              const disabled = !active && regions.length >= 5;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => toggleRegion(r)}
                  disabled={disabled}
                  className={cn(
                    'h-9 px-4 rounded-full text-sm transition-colors border',
                    active
                      ? 'bg-klano-text text-klano-action-fg border-klano-text'
                      : 'bg-klano-surface text-klano-text-2 border-klano-border hover:border-klano-border-strong hover:text-klano-text',
                    disabled && 'opacity-40 cursor-not-allowed',
                  )}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

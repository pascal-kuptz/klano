'use client';

import { useMemo, useState, useEffect } from 'react';
import { useWizard } from './WizardProvider';
import { matchVenues, type MatchedVenue } from '@/lib/onboarding/venues-static';
import { cn } from '@/lib/cn';

export function Step6Venues() {
  const { state, dispatch } = useWizard();
  const [loading, setLoading] = useState(true);

  const matches = useMemo<MatchedVenue[]>(
    () =>
      matchVenues({
        country: state.band.country,
        regions: state.band.regions,
        genres: state.band.genres.map((g) => g.toLowerCase()),
        ambition: state.band.ambition,
      }),
    [state.band],
  );

  // 1.4s "AI is searching" feel — not fake but lets the user breathe.
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="max-w-[760px] mx-auto w-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
        06 / Venues
      </p>
      <h2
        className="text-klano-text leading-[1.05] mb-3"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(2rem, 4vw, 2.75rem)',
          letterSpacing: '-0.02em',
        }}
      >
        {loading ? `Suche Venues für ${state.band.name || 'deine Band'}…` : 'Drei Venues. Wähl einen.'}
      </h2>
      {!loading && (
        <p className="text-klano-text-2 mb-10">
          Auf Klano matcht der Agent eure Größe, Region und Sound. Hier sind die ersten drei.
        </p>
      )}

      {loading ? (
        <div className="flex flex-col gap-3 mt-12">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 rounded-[16px] border border-klano-border bg-klano-surface relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer" />
            </div>
          ))}
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-4 text-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-klano-success mr-2 align-middle animate-pulse" />
            Klano scannt 480+ Venues in {state.band.country ?? 'DACH'} …
          </p>
          <style jsx>{`
            .shimmer {
              background: linear-gradient(
                90deg,
                transparent 0%,
                rgba(10, 10, 10, 0.04) 50%,
                transparent 100%
              );
              animation: shimmer 1.6s linear infinite;
            }
            @keyframes shimmer {
              from { transform: translateX(-100%); }
              to { transform: translateX(100%); }
            }
          `}</style>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-[16px] border border-klano-border bg-klano-surface p-8 text-center">
          <p className="text-klano-text-2">
            Hmm. Mit deinen Kriterien finden wir gerade keine Top-Treffer in unserer Datenbank.
            Trotzdem geht's weiter — die Liste wächst täglich.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((v, i) => {
            const active = state.selectedVenueId === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => dispatch({ type: 'select-venue', id: v.id })}
                className={cn(
                  'text-left rounded-[16px] border bg-klano-surface p-5 md:p-6 transition-all',
                  active
                    ? 'border-klano-text shadow-[0_0_0_1px_var(--color-klano-text)]'
                    : 'border-klano-border hover:border-klano-border-strong',
                )}
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-[11px] tracking-tight text-klano-text-3 mt-1 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3
                        className="text-klano-text leading-[1.1]"
                        style={{
                          fontFamily: 'Instrument Serif, Georgia, serif',
                          fontWeight: 400,
                          fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
                          letterSpacing: '-0.015em',
                        }}
                      >
                        {v.name}
                      </h3>
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-2 tabular-nums">
                        Match {v.match}%
                      </span>
                    </div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-1">
                      {v.city} · Cap {v.capacity} · {v.genres.slice(0, 2).join(' / ')}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'inline-flex items-center justify-center h-7 w-7 rounded-full border transition-colors flex-shrink-0',
                      active
                        ? 'bg-klano-text border-klano-text text-klano-action-fg'
                        : 'border-klano-border text-klano-text-3',
                    )}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import type { AmbitionLevel } from '@klano/db';
import { useWizard } from './WizardProvider';
import { cn } from '@/lib/cn';

const LEVELS: { id: AmbitionLevel; title: string; sub: string; meta: string }[] = [
  {
    id: 'hobby',
    title: 'Aus Spaß',
    sub: '4–6 Gigs im Jahr, Proben sind heilig.',
    meta: 'Hobby',
  },
  {
    id: 'semi_pro',
    title: 'Wir wollen mehr.',
    sub: '15–30 Gigs im Jahr, Tour-Hunger.',
    meta: 'Semi-Pro',
  },
  {
    id: 'pro',
    title: 'Wir leben davon.',
    sub: '40+ Gigs, Booking-Pipeline ist Job.',
    meta: 'Pro',
  },
];

export function Step4Ambition() {
  const { state, dispatch } = useWizard();
  const current = state.band.ambition;

  return (
    <div className="max-w-[760px] mx-auto w-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
        04 / Anspruch
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
        Was ist euer Spielfeld?
      </h2>

      <div className="grid gap-3 md:grid-cols-3">
        {LEVELS.map((l) => {
          const active = current === l.id;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                dispatch({ type: 'patch-band', patch: { ambition: l.id } });
                // Auto-advance — selection is the action
                setTimeout(() => dispatch({ type: 'next' }), 200);
              }}
              className={cn(
                'text-left p-7 rounded-[20px] border transition-all min-h-[180px] flex flex-col',
                active
                  ? 'border-klano-text bg-klano-surface'
                  : 'border-klano-border bg-klano-surface hover:border-klano-border-strong hover:-translate-y-0.5',
              )}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
                {l.meta}
              </span>
              <h3
                className="text-klano-text mb-3 leading-[1.1]"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(1.375rem, 2vw, 1.625rem)',
                  letterSpacing: '-0.015em',
                }}
              >
                {l.title}
              </h3>
              <p className="text-[14px] text-klano-text-2 leading-[1.55]">{l.sub}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

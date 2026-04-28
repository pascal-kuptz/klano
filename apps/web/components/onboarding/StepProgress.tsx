'use client';

import { TOTAL_STEPS, type Step } from '@/lib/onboarding/state';
import { cn } from '@/lib/cn';

const LABELS: Record<Step, string> = {
  1: 'Welcome',
  2: 'Band',
  3: 'Region',
  4: 'Anspruch',
  5: 'Mitglieder',
  6: 'Venues',
  7: 'Konto',
};

export function StepProgress({ current }: { current: Step }) {
  return (
    <ol className="flex items-center gap-2">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const idx = (i + 1) as Step;
        const active = idx === current;
        const past = idx < current;
        return (
          <li
            key={idx}
            className="flex items-center gap-2"
            aria-current={active ? 'step' : undefined}
          >
            <span
              className={cn(
                'inline-flex items-center gap-2 px-3 h-7 rounded-full font-mono text-[11px] tracking-tight transition-colors',
                active && 'bg-klano-text text-klano-action-fg',
                past && 'text-klano-text-2',
                !active && !past && 'text-klano-text-3',
              )}
            >
              <span className="tabular-nums">{idx.toString().padStart(2, '0')}</span>
              <span className="hidden sm:inline">{LABELS[idx]}</span>
            </span>
            {idx < TOTAL_STEPS && (
              <span className="hidden md:inline-block h-px w-4 bg-klano-border" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

'use client';

import { TOTAL_STEPS, type Step } from '@/lib/onboarding/state';

const STEP_LABELS: Record<Step, string> = {
  1: 'Welcome',
  2: 'Band',
  3: 'Region',
  4: 'Anspruch',
  5: 'Mitglieder',
  6: 'Venues',
  7: 'Konto',
};

interface Props {
  current: Step;
  /** Visual variant. 'light' = on dark image bg. 'dark' = on light bg. */
  variant?: 'light' | 'dark';
}

export function ProgressBar({ current, variant = 'dark' }: Props) {
  const pct = (current / TOTAL_STEPS) * 100;
  const trackColor =
    variant === 'light' ? 'rgba(255,255,255,0.18)' : 'var(--color-klano-border)';
  const fillColor =
    variant === 'light' ? '#FFFFFF' : 'var(--color-klano-text)';
  const labelColor =
    variant === 'light'
      ? 'rgba(255,255,255,0.55)'
      : 'var(--color-klano-text-3)';
  const accentColor =
    variant === 'light' ? '#FFFFFF' : 'var(--color-klano-text)';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-mono text-[11px] tracking-[0.04em] tabular-nums"
          style={{ color: labelColor }}
        >
          <span style={{ color: accentColor }}>
            {String(current).padStart(2, '0')}
          </span>
          <span> / {String(TOTAL_STEPS).padStart(2, '0')}</span>
          <span className="ml-3 uppercase tracking-[0.08em]">{STEP_LABELS[current]}</span>
        </span>
        <span
          className="font-mono text-[11px] tabular-nums"
          style={{ color: labelColor }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div
        className="h-[3px] w-full rounded-full overflow-hidden"
        style={{ background: trackColor }}
      >
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
    </div>
  );
}

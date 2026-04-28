'use client';

import { useWizard } from './WizardProvider';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';

const GENRES = [
  'Indie', 'Rock', 'Pop', 'Folk', 'Jazz', 'Electronic',
  'Punk', 'Singer-Songwriter', 'HipHop', 'Metal', 'Klassik', 'Blues',
];
const SIZES = [3, 4, 5, 6, 7, 8] as const;

export function Step2BandBasics() {
  const { state, dispatch } = useWizard();
  const { name, genres, bandSize } = state.band;

  function toggleGenre(g: string) {
    const has = genres.includes(g);
    let next: string[];
    if (has) next = genres.filter((x) => x !== g);
    else if (genres.length >= 3) return; // hard cap
    else next = [...genres, g];
    dispatch({ type: 'patch-band', patch: { genres: next } });
  }

  return (
    <div className="max-w-[640px] mx-auto w-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
        02 / Band
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
        Wer seid ihr?
      </h2>

      {/* Band name */}
      <div className="mb-8">
        <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-2">
          Bandname
        </label>
        <Input
          autoFocus
          value={name}
          onChange={(e) => dispatch({ type: 'patch-band', patch: { name: e.target.value } })}
          placeholder="Halbnacht"
          className="!h-14 !text-[18px]"
        />
        {name.trim().length >= 2 && (
          <p
            className="mt-3 text-klano-text-2"
            style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontStyle: 'italic', fontSize: '20px' }}
          >
            Hi {name.trim()}.
          </p>
        )}
      </div>

      {/* Genres */}
      <div className="mb-8">
        <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
          Genre <span className="lowercase">(bis 3)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => {
            const active = genres.includes(g);
            const disabled = !active && genres.length >= 3;
            return (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                disabled={disabled}
                className={cn(
                  'h-9 px-4 rounded-full text-sm transition-colors border',
                  active
                    ? 'bg-klano-text text-klano-action-fg border-klano-text'
                    : 'bg-klano-surface text-klano-text-2 border-klano-border hover:border-klano-border-strong hover:text-klano-text',
                  disabled && 'opacity-40 cursor-not-allowed',
                )}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bandgröße */}
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
          Wie viele seid ihr?
        </label>
        <div className="flex gap-2">
          {SIZES.map((s) => {
            const active = bandSize === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => dispatch({ type: 'patch-band', patch: { bandSize: s } })}
                className={cn(
                  'h-11 w-11 rounded-full text-sm font-medium transition-colors border tabular-nums',
                  active
                    ? 'bg-klano-text text-klano-action-fg border-klano-text'
                    : 'bg-klano-surface text-klano-text-2 border-klano-border hover:border-klano-border-strong hover:text-klano-text',
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

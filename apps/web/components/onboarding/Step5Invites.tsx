'use client';

import { useEffect, useState } from 'react';
import { useWizard } from './WizardProvider';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';

const MAX_INVITES = 7;

export function Step5Invites() {
  const { state, dispatch } = useWizard();
  const [rows, setRows] = useState<{ email: string; instrument: string }[]>(
    state.invites.length
      ? state.invites.map((i) => ({ email: i.email, instrument: i.instrument ?? '' }))
      : [{ email: '', instrument: '' }],
  );

  // Persist to wizard state on change.
  useEffect(() => {
    const cleaned = rows
      .map((r) => ({ email: r.email.trim(), instrument: r.instrument.trim() }))
      .filter((r) => r.email.length > 0);
    dispatch({
      type: 'set-invites',
      invites: cleaned.map((r) => ({
        email: r.email,
        instrument: r.instrument || undefined,
      })),
    });
  }, [rows, dispatch]);

  function update(i: number, patch: Partial<{ email: string; instrument: string }>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    if (rows.length >= MAX_INVITES) return;
    setRows((prev) => [...prev, { email: '', instrument: '' }]);
  }
  function removeRow(i: number) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="max-w-[640px] mx-auto w-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
        05 / Mitglieder
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
        Wer ist noch dabei?
      </h2>
      <p className="text-klano-text-2 mb-10">
        Wir senden ihnen einen Einladungs-Link, sobald du dein Konto erstellt hast. Überspringen geht auch — du kannst sie später hinzufügen.
      </p>

      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_180px_40px] gap-2 items-center">
            <Input
              type="email"
              placeholder="band@deinedomain.com"
              value={r.email}
              onChange={(e) => update(i, { email: e.target.value })}
              autoFocus={i === 0}
            />
            <Input
              type="text"
              placeholder="Instrument"
              value={r.instrument}
              onChange={(e) => update(i, { instrument: e.target.value })}
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              disabled={rows.length === 1}
              aria-label="Entfernen"
              className={cn(
                'h-10 w-10 inline-flex items-center justify-center rounded-full text-klano-text-3 transition-colors',
                rows.length === 1
                  ? 'opacity-30 cursor-not-allowed'
                  : 'hover:text-klano-danger hover:bg-klano-danger/10',
              )}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        disabled={rows.length >= MAX_INVITES}
        className={cn(
          'mt-4 inline-flex items-center gap-2 text-[13px] text-klano-text-2 hover:text-klano-text transition-colors',
          rows.length >= MAX_INVITES && 'opacity-30 cursor-not-allowed',
        )}
      >
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full border border-klano-border">
          +
        </span>
        Weiteres Mitglied
      </button>
    </div>
  );
}

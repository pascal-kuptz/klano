'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/cn';

export interface PendingMember {
  name: string;
  instrument?: string | null;
}

interface Props {
  members: PendingMember[];
}

type Status = 'idle' | 'sending' | 'sent';

/**
 * Dashboard card: shows the names collected during onboarding step 5
 * and lets the leader drop an email per row to send the invite.
 *
 * Server-side: posts to /api/invitations (TODO v0.6 — wires Resend +
 * inserts band_invitations row, removes name from bands.pending_members).
 */
export function InviteCard({ members }: Props) {
  const [rows, setRows] = useState(
    members.map((m) => ({ name: m.name, instrument: m.instrument ?? '', email: '', status: 'idle' as Status })),
  );

  function update(i: number, patch: Partial<{ email: string; status: Status }>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  async function send(i: number) {
    const row = rows[i];
    if (!row || !row.email.trim()) return;
    update(i, { status: 'sending' });
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: row.name,
          instrument: row.instrument || undefined,
          email: row.email.trim(),
        }),
      });
      if (!res.ok) throw new Error(`http ${res.status}`);
      update(i, { status: 'sent' });
    } catch (e) {
      console.error('invite send failed', e);
      update(i, { status: 'idle' });
    }
  }

  if (rows.length === 0) {
    return (
      <article className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
          Bandkollegen einladen
        </h3>
        <p
          className="text-klano-text mb-4"
          style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontWeight: 400,
            fontSize: '20px',
            letterSpacing: '-0.015em',
          }}
        >
          Allein unterwegs?
        </p>
        <p className="text-[13px] text-klano-text-2 mb-4">
          Du kannst jederzeit Mitglieder hinzufügen — Klano verfolgt eure Verfügbarkeiten und Kommunikation als Band.
        </p>
        <Button variant="secondary" size="sm">
          + Mitglied hinzufügen
        </Button>
      </article>
    );
  }

  return (
    <article className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
      <div className="flex items-baseline justify-between mb-2">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
          Bandkollegen einladen
        </h3>
        <span className="font-mono text-[11px] text-klano-text-3 tabular-nums">
          {rows.filter((r) => r.status !== 'sent').length} offen
        </span>
      </div>
      <p className="text-[13px] text-klano-text-2 mb-5">
        Trag die E-Mails ein — Klano schickt einen Magic-Link, sie sind direkt in der Band drin.
      </p>

      <ul className="flex flex-col divide-y divide-klano-border">
        {rows.map((r, i) => (
          <li key={i} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-baseline justify-between gap-2 mb-2">
              <span className="text-[14px] font-medium text-klano-text">{r.name}</span>
              {r.instrument && (
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-klano-text-3">
                  {r.instrument}
                </span>
              )}
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
              <Input
                type="email"
                placeholder="email@…"
                value={r.email}
                onChange={(e) => update(i, { email: e.target.value })}
                disabled={r.status === 'sent'}
                className={cn('!h-10 !text-[13px]', r.status === 'sent' && 'opacity-60')}
              />
              {r.status === 'sent' ? (
                <span
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-full bg-klano-success/10 text-klano-success text-[12px] font-medium"
                  aria-label="Gesendet"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Gesendet
                </span>
              ) : (
                <Button
                  size="sm"
                  variant={r.email.trim() ? 'primary' : 'secondary'}
                  onClick={() => send(i)}
                  disabled={!r.email.trim() || r.status === 'sending'}
                >
                  {r.status === 'sending' ? '…' : 'Senden'}
                </Button>
              )}
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.08em] text-klano-text-3">
        Magic-Link · keine Passwörter
      </p>
    </article>
  );
}

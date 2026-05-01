'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

type Status = 'idle' | 'loading' | 'error';
type Cycle = 'monthly' | 'yearly';

const PLAN_LABEL: Record<string, string> = {
  free: 'Free',
  trialing: 'Pro · Trial',
  active: 'Pro · Aktiv',
  past_due: 'Pro · Zahlung fehlgeschlagen',
  canceled: 'Free (storniert)',
  incomplete: 'Pro · unvollständig',
};

interface Props {
  /** Current plan/status — passed from server in real wiring; placeholder for now. */
  plan?: keyof typeof PLAN_LABEL;
  hasCustomer?: boolean;
}

export function BillingClient({ plan = 'free', hasCustomer = false }: Props) {
  const [cycle, setCycle] = useState<Cycle>('monthly');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cycle }),
      });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!json.ok || !json.url) throw new Error(json.error ?? 'checkout failed');
      window.location.assign(json.url);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'unknown');
    }
  }

  async function openPortal() {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const json = (await res.json()) as { ok: boolean; url?: string; error?: string };
      if (!json.ok || !json.url) throw new Error(json.error ?? 'portal failed');
      window.location.assign(json.url);
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : 'unknown');
    }
  }

  const isPro = plan === 'active' || plan === 'trialing' || plan === 'past_due';

  return (
    <div className="flex flex-col gap-10">
      {/* Current plan */}
      <section className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
            Aktueller Plan
          </h3>
          <span
            className={cn(
              'inline-flex h-6 px-3 rounded-full border font-mono text-[10px] uppercase tracking-[0.06em] items-center',
              isPro
                ? 'bg-klano-success/10 text-klano-success border-klano-success/30'
                : 'bg-klano-surface-2 text-klano-text-2 border-klano-border',
            )}
          >
            {PLAN_LABEL[plan] ?? plan}
          </span>
        </div>
        <p
          className="text-klano-text leading-[1.05] mt-4"
          style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontWeight: 400,
            fontSize: 28,
            letterSpacing: '-0.02em',
          }}
        >
          {isPro ? 'Pro' : 'Free'}
        </p>
        <p className="text-[13px] text-klano-text-2 mt-1">
          {isPro
            ? 'Unlimitierte Outreach, Auto-Follow-ups, AI-Inbox.'
            : 'Bis 10 Outreach-Mails/Monat. Upgrade für mehr.'}
        </p>

        {hasCustomer && (
          <div className="mt-6">
            <Button variant="secondary" size="sm" onClick={openPortal} disabled={status === 'loading'}>
              Customer Portal öffnen
            </Button>
          </div>
        )}
      </section>

      {/* Upgrade */}
      {!isPro && (
        <section className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
            Pro freischalten
          </h3>
          <p className="text-[13px] text-klano-text-2 mb-5">
            14 Tage kostenlos. Keine Kreditkarte für den Start. Monatlich kündbar.
          </p>

          {/* Cycle toggle */}
          <div className="inline-flex p-1 rounded-full bg-klano-surface-2 border border-klano-border mb-6">
            {(['monthly', 'yearly'] as Cycle[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCycle(c)}
                className={cn(
                  'h-8 px-4 rounded-full text-[13px] font-medium transition-colors',
                  cycle === c
                    ? 'bg-klano-text text-klano-action-fg'
                    : 'text-klano-text-2 hover:text-klano-text',
                )}
              >
                {c === 'monthly' ? 'Monatlich' : 'Jährlich · 17% sparen'}
              </button>
            ))}
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span
              className="text-klano-text leading-none"
              style={{
                fontFamily: 'Instrument Serif, Georgia, serif',
                fontWeight: 400,
                fontSize: 56,
                letterSpacing: '-0.025em',
              }}
            >
              {cycle === 'monthly' ? '19' : '190'} CHF
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
              {cycle === 'monthly' ? '/ Monat' : '/ Jahr'}
            </span>
          </div>

          <Button onClick={startCheckout} disabled={status === 'loading'}>
            {status === 'loading' ? 'Lade …' : 'Pro starten'}
          </Button>

          {error && <p className="text-[12px] text-klano-danger mt-3">{error}</p>}
        </section>
      )}

      {/* Plan summary */}
      <section className="bg-klano-surface border border-klano-border rounded-[16px] p-6">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
          Was Pro umfasst
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2 text-[13px] text-klano-text">
          {[
            'Unlimitierte Outreach-Mails',
            'Auto-Follow-ups (7 + 14 Tage)',
            'AI-Inbox-Klassifizierung',
            'Unlimitierte Bandmitglieder',
            'Priority-Support',
            '14 Tage gratis testen',
          ].map((line) => (
            <li key={line} className="flex items-start gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-klano-text-2 mt-0.5 flex-shrink-0"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {line}
            </li>
          ))}
        </ul>
      </section>

      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
        Stripe Checkout · MwSt automatisch · v0.7 wired
      </p>
    </div>
  );
}

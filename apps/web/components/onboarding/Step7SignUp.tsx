'use client';

import { useState } from 'react';
import { useWizard } from './WizardProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export function Step7SignUp() {
  const { state } = useWizard();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('sending');
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        // After magic-link confirmation, callback finalizes the wizard
        // and redirects to /dashboard via /onboarding/finalize.
        emailRedirectTo: `${origin}/auth/callback?next=/onboarding/finalize`,
        data: {
          /* Stash a hint that this is the onboarding flow — finalize uses it */
          onboarding: 'pending',
        },
      },
    });

    if (authError) {
      setStatus('error');
      setError(authError.message);
      return;
    }
    setStatus('sent');
  }

  if (status === 'sent') {
    return (
      <div className="max-w-[560px] mx-auto w-full text-center">
        <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-klano-success/10 text-klano-success">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          className="text-klano-text leading-[1.05] mb-3"
          style={{
            fontFamily: 'Instrument Serif, Georgia, serif',
            fontWeight: 400,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            letterSpacing: '-0.02em',
          }}
        >
          Check deine Mail.
        </h2>
        <p className="text-klano-text-2 max-w-[420px] mx-auto">
          Wir haben einen Link an <span className="text-klano-text">{email}</span> geschickt. Wenn du
          ihn klickst, ist {state.band.name || 'deine Band'} bereit.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto w-full">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-4">
        07 / Konto
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
        Letzter Schritt: dein Konto.
      </h2>
      <p className="text-klano-text-2 mb-8">
        Wir speichern alles, was du gerade eingerichtet hast — und schicken einen Magic-Link an deine
        Mail. Keine Passwörter, kein Schnickschnack.
      </p>

      <div className="rounded-[16px] border border-klano-border bg-klano-surface p-5 mb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
          Zusammenfassung
        </p>
        <dl className="grid grid-cols-[100px_1fr] gap-y-2 gap-x-4 text-[14px]">
          <dt className="text-klano-text-3">Band</dt>
          <dd className="text-klano-text font-medium">{state.band.name || '—'}</dd>
          <dt className="text-klano-text-3">Genre</dt>
          <dd className="text-klano-text">{state.band.genres.join(' · ') || '—'}</dd>
          <dt className="text-klano-text-3">Region</dt>
          <dd className="text-klano-text">
            {state.band.country ? `${state.band.country} · ${state.band.regions.join(', ')}` : '—'}
          </dd>
          <dt className="text-klano-text-3">Anspruch</dt>
          <dd className="text-klano-text capitalize">
            {state.band.ambition?.replace('_', '-') || '—'}
          </dd>
          {state.invites.length > 0 && (
            <>
              <dt className="text-klano-text-3">Bandkollegen</dt>
              <dd className="text-klano-text">
                {state.invites.map((i) => i.name).join(' · ')}
              </dd>
            </>
          )}
          {state.selectedVenueId && (
            <>
              <dt className="text-klano-text-3">Erstes Venue</dt>
              <dd className="text-klano-text">
                {state.selectedVenueId}
              </dd>
            </>
          )}
        </dl>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          required
          autoFocus
          autoComplete="email"
          placeholder="band@deinedomain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="!h-14 !text-[16px]"
        />
        {error && <p className="text-sm text-klano-danger">{error}</p>}
        <Button
          type="submit"
          size="lg"
          disabled={status === 'sending'}
          className="!w-full"
        >
          {status === 'sending' ? 'Sende ...' : 'Magic-Link senden & loslegen'}
        </Button>
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 text-center mt-2">
          Keine Kreditkarte · DSG/DSGVO · Made in Zürich
        </p>
      </form>
    </div>
  );
}

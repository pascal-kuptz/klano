'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

export function SignInForm() {
  const params = useSearchParams();
  const next = params.get('next') ?? '/dashboard';
  const callbackError = params.get('error');

  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(callbackError ? 'Login fehlgeschlagen.' : null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setState('sending');
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (authError) {
      setState('error');
      setError(authError.message);
      return;
    }
    setState('sent');
  }

  if (state === 'sent') {
    return (
      <div className="text-center py-4">
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-klano-success/10 text-klano-success">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-[18px] font-semibold text-klano-text mb-1">Check deine Mail.</h2>
        <p className="text-klano-text-2 text-sm">
          Wir haben einen Link an <span className="text-klano-text">{email}</span> geschickt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="email"
          className="block font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-2"
        >
          E-Mail
        </label>
        <Input
          id="email"
          type="email"
          name="email"
          placeholder="band@deinedomain.com"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-klano-danger">{error}</p>
      )}

      <Button type="submit" size="lg" disabled={state === 'sending'} className="w-full">
        {state === 'sending' ? 'Sende ...' : 'Magic-Link senden'}
      </Button>

      <div className="flex items-center gap-3 text-klano-text-3">
        <span className="h-px flex-1 bg-klano-border" />
        <span className="font-mono text-[10px] uppercase tracking-[0.1em]">oder</span>
        <span className="h-px flex-1 bg-klano-border" />
      </div>

      <Button type="button" variant="secondary" size="lg" className="w-full" disabled>
        <span className="inline-flex items-center gap-2">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v3.18h5.36c-.23 1.4-1.66 4.1-5.36 4.1-3.23 0-5.86-2.67-5.86-5.96S8.77 6.46 12 6.46c1.84 0 3.07.78 3.78 1.45l2.58-2.49C16.78 3.96 14.6 3 12 3 6.91 3 2.78 7.13 2.78 12.22S6.91 21.44 12 21.44c6.93 0 9.5-4.86 9.5-7.4 0-.5-.05-.88-.15-1.94Z"
            />
          </svg>
          Mit Google fortfahren
          <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.08em] text-klano-text-3">
            bald
          </span>
        </span>
      </Button>
    </form>
  );
}

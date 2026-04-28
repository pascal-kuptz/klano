'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_KEY, type WizardState } from '@/lib/onboarding/state';
import { finalizeOnboarding } from '@/lib/onboarding/finalize';
import { Logo } from '@/components/ui/Logo';

type Phase = 'reading' | 'persisting' | 'redirect' | 'error';

export function FinalizeClient() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('reading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          // Nothing to finalize — go straight to dashboard.
          router.replace('/dashboard');
          return;
        }
        const state = JSON.parse(raw) as WizardState;

        setPhase('persisting');
        const result = await finalizeOnboarding(state);
        if (cancelled) return;

        if (!result.ok) {
          setError(result.error ?? 'Unbekannter Fehler.');
          setPhase('error');
          return;
        }

        // Clear local state on success.
        window.localStorage.removeItem(STORAGE_KEY);
        setPhase('redirect');
        router.replace('/dashboard');
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Unbekannter Fehler.');
        setPhase('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-klano-canvas">
      <header className="px-6 py-6 md:px-10 md:py-8">
        <Logo size={22} />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-[480px]">
          {phase !== 'error' && (
            <>
              <div className="mb-6 inline-flex h-10 w-10 items-center justify-center">
                <span className="block w-1.5 h-1.5 rounded-full bg-klano-success animate-pulse" />
              </div>
              <h1
                className="text-klano-text leading-[1.05] mb-3"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                {phase === 'reading' && 'Lade deine Daten …'}
                {phase === 'persisting' && 'Richte deine Band ein …'}
                {phase === 'redirect' && 'Geschafft.'}
              </h1>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mt-2">
                Einen Moment — Klano speichert alles.
              </p>
            </>
          )}
          {phase === 'error' && (
            <>
              <h1
                className="text-klano-text leading-[1.05] mb-3"
                style={{
                  fontFamily: 'Instrument Serif, Georgia, serif',
                  fontWeight: 400,
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  letterSpacing: '-0.02em',
                }}
              >
                Hmm, das ging schief.
              </h1>
              <p className="text-klano-text-2 mb-6 text-sm">
                {error ?? 'Wir konnten dein Setup nicht abschließen.'}
              </p>
              <button
                type="button"
                onClick={() => router.replace('/onboarding')}
                className="text-[13px] underline underline-offset-4 text-klano-text hover:text-klano-text-2 transition-colors"
              >
                Zurück zum Setup
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

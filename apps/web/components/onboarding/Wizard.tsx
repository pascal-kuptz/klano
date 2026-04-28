'use client';

import Link from 'next/link';
import { useWizard } from './WizardProvider';
import { canAdvance } from '@/lib/onboarding/state';
import { StepProgress } from './StepProgress';
import { Step1Welcome } from './Step1Welcome';
import { Step2BandBasics } from './Step2BandBasics';
import { Step3Geo } from './Step3Geo';
import { Step4Ambition } from './Step4Ambition';
import { Step5Invites } from './Step5Invites';
import { Step6Venues } from './Step6Venues';
import { Step7SignUp } from './Step7SignUp';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function Wizard() {
  const { state, dispatch } = useWizard();
  const isFirst = state.step === 1;
  const isLast = state.step === 7;
  const advanceOk = canAdvance(state);
  const showSkip = state.step === 5;

  return (
    <div className="min-h-screen flex flex-col bg-klano-canvas">
      <header className="px-4 md:px-8 py-5 border-b border-klano-border bg-klano-canvas/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
          <Logo href="/" size={22} />
          <StepProgress current={state.step} />
          <Link
            href="/sign-in"
            className="hidden md:inline-flex items-center text-[13px] text-klano-text-2 hover:text-klano-text transition-colors h-9 px-3"
          >
            Schon ein Konto?
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-12 md:py-20">
        <div
          key={state.step}
          className={cn('w-full transition-opacity', 'animate-step-in')}
        >
          {state.step === 1 && <Step1Welcome />}
          {state.step === 2 && <Step2BandBasics />}
          {state.step === 3 && <Step3Geo />}
          {state.step === 4 && <Step4Ambition />}
          {state.step === 5 && <Step5Invites />}
          {state.step === 6 && <Step6Venues />}
          {state.step === 7 && <Step7SignUp />}
        </div>
      </main>

      {!isFirst && !isLast && (
        <footer className="sticky bottom-0 z-20 bg-klano-canvas/85 backdrop-blur border-t border-klano-border">
          <div className="max-w-[760px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-3">
            <Button variant="ghost" size="md" onClick={() => dispatch({ type: 'prev' })}>
              ← Zurück
            </Button>

            <div className="flex items-center gap-3">
              {showSkip && (
                <button
                  type="button"
                  onClick={() => dispatch({ type: 'next' })}
                  className="text-[13px] text-klano-text-2 hover:text-klano-text transition-colors"
                >
                  Überspringen
                </button>
              )}
              <Button
                size="md"
                disabled={!advanceOk}
                onClick={() => dispatch({ type: 'next' })}
              >
                Weiter →
              </Button>
            </div>
          </div>
        </footer>
      )}

      <style jsx>{`
        :global(.animate-step-in) {
          animation: step-in 320ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes step-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.animate-step-in) { animation: none; }
        }
      `}</style>
    </div>
  );
}

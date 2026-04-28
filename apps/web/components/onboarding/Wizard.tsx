'use client';

import { useWizard } from './WizardProvider';
import { canAdvance } from '@/lib/onboarding/state';
import { OnboardingNav } from './OnboardingNav';
import { OnboardingStage } from './OnboardingStage';
import { ProgressBar } from './ProgressBar';
import { Step1Welcome } from './Step1Welcome';
import { Step2BandBasics } from './Step2BandBasics';
import { Step3Geo } from './Step3Geo';
import { Step4Ambition } from './Step4Ambition';
import { Step5Invites } from './Step5Invites';
import { Step6Venues } from './Step6Venues';
import { Step7SignUp } from './Step7SignUp';
import { Button } from '@/components/ui/Button';

export function Wizard() {
  const { state, dispatch } = useWizard();
  const isFirst = state.step === 1;
  const isLast = state.step === 7;
  const advanceOk = canAdvance(state);
  const showSkip = state.step === 5;

  return (
    <div className="layout">
      {/* LEFT — atmospheric stage (desktop only) */}
      <OnboardingStage currentStep={state.step} />

      {/* RIGHT — pill nav + scrollable content + sticky pill footer */}
      <main className="content">
        <OnboardingNav currentStep={state.step} />

        {/* Mobile-only progress bar — desktop has it on the stage */}
        <div className="mobile-progress">
          <ProgressBar current={state.step} variant="dark" />
        </div>

        <div key={state.step} className="step animate-step-in">
          {state.step === 1 && <Step1Welcome />}
          {state.step === 2 && <Step2BandBasics />}
          {state.step === 3 && <Step3Geo />}
          {state.step === 4 && <Step4Ambition />}
          {state.step === 5 && <Step5Invites />}
          {state.step === 6 && <Step6Venues />}
          {state.step === 7 && <Step7SignUp />}
        </div>

        {!isLast && <div className="footer-spacer" aria-hidden="true" />}

        {!isFirst && !isLast && (
          <footer className="footer">
            <div className="footer-pill">
              <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'prev' })}>
                ← Zurück
              </Button>
              <div className="footer-cta">
                {showSkip && (
                  <button
                    type="button"
                    onClick={() => dispatch({ type: 'next' })}
                    className="skip"
                  >
                    Überspringen
                  </button>
                )}
                <Button size="sm" disabled={!advanceOk} onClick={() => dispatch({ type: 'next' })}>
                  Weiter →
                </Button>
              </div>
            </div>
          </footer>
        )}
      </main>

      <style jsx>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-klano-canvas);
        }
        .content {
          flex: 1;
          min-width: 0;
          position: relative;
          padding: 88px 24px 24px;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .content { padding: 96px 56px 32px; }
        }
        @media (min-width: 1024px) {
          .content { padding: 96px 80px 40px; }
        }

        .mobile-progress { margin-bottom: 32px; }
        @media (min-width: 1024px) {
          .mobile-progress { display: none; }
        }

        .step {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 0 64px;
        }
        @media (min-width: 1024px) {
          .step { padding: 48px 0 96px; }
        }

        .footer-spacer { height: 100px; }

        .footer {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 16px;
          z-index: 40;
          display: flex;
          justify-content: center;
          padding: 0 24px;
          pointer-events: none;
        }
        @media (min-width: 1024px) {
          .footer { left: 50%; }
        }

        .footer-pill {
          pointer-events: auto;
          width: 100%;
          max-width: 560px;
          height: 56px;
          padding: 8px 8px 8px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid var(--color-klano-border);
          backdrop-filter: saturate(180%) blur(16px);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.08);
        }
        .footer-cta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .skip {
          font-size: 13px;
          color: var(--color-klano-text-2);
          background: transparent;
          border: 0;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 9999px;
          transition: color 150ms;
        }
        .skip:hover { color: var(--color-klano-text); }

        :global(.animate-step-in) {
          animation: step-in 380ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes step-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.animate-step-in) { animation: none; }
        }
      `}</style>
    </div>
  );
}

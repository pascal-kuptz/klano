'use client';

import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { TOTAL_STEPS, type Step } from '@/lib/onboarding/state';

export function OnboardingNav({ currentStep }: { currentStep: Step }) {
  return (
    <div className="nav-wrap">
      <nav className="nav-pill">
        <Logo size={22} />
        <span className="nav-step font-mono text-[11px] tracking-tight tabular-nums">
          <span className="text-klano-text">{String(currentStep).padStart(2, '0')}</span>
          <span className="text-klano-text-3"> / {String(TOTAL_STEPS).padStart(2, '0')}</span>
        </span>
        <Link href={'/sign-in' as never} className="nav-link">
          Schon ein Konto?
        </Link>
      </nav>

      <style jsx>{`
        .nav-wrap {
          position: fixed;
          top: 16px;
          left: 0;
          right: 0;
          z-index: 50;
          display: flex;
          justify-content: center;
          padding: 0 12px;
          pointer-events: none;
        }
        @media (min-width: 768px) {
          .nav-wrap {
            top: 20px;
            padding: 0 32px;
          }
        }
        .nav-pill {
          pointer-events: auto;
          width: 100%;
          max-width: 720px;
          height: 56px;
          padding: 6px 8px 6px 22px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 16px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid var(--color-klano-border);
          backdrop-filter: saturate(180%) blur(16px);
          -webkit-backdrop-filter: saturate(180%) blur(16px);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        }
        .nav-step {
          text-align: center;
        }
        .nav-link {
          height: 44px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          color: var(--color-klano-text-2);
          font-size: 13px;
          font-weight: 500;
          text-decoration: none;
          border-radius: 9999px;
          background: transparent;
          transition: color 150ms, background 150ms;
        }
        .nav-link:hover {
          color: var(--color-klano-text);
          background: var(--color-klano-surface-2);
        }
      `}</style>
    </div>
  );
}

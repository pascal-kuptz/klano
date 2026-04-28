'use client';

import { Logo } from '@/components/ui/Logo';
import { ProgressBar } from './ProgressBar';
import type { Step } from '@/lib/onboarding/state';

const STEP_LEAD: Record<Step, { eyebrow: string; line: string }> = {
  1: { eyebrow: 'Loslegen', line: 'Sieben kurze Schritte. Du brauchst kein Konto bis zum Schluss.' },
  2: { eyebrow: 'Eure Band', line: 'Name, Genre, Größe — die Grundlage für alle weiteren Vorschläge.' },
  3: { eyebrow: 'Wo ihr spielt', line: 'Klano matcht eure Region und schlägt nur Venues vor, die wirklich erreichbar sind.' },
  4: { eyebrow: 'Euer Spielfeld', line: 'Hobby, Semi-Pro oder Pro — bestimmt Ton und Größenrahmen der Outreach.' },
  5: { eyebrow: 'Die Crew', line: 'Du und dein Bandkollege — Klano kennt euch alle. Verfügbarkeiten kommen später.' },
  6: { eyebrow: 'Erste Treffer', line: 'Live-Match aus 480+ Venues. Drei Vorschläge, die zu eurer Größe und Region passen.' },
  7: { eyebrow: 'Letzter Schritt', line: 'Kein Passwort. Magic-Link an deine Mail — und alles ist gespeichert.' },
};

export function OnboardingStage({ currentStep }: { currentStep: Step }) {
  const lead = STEP_LEAD[currentStep];

  return (
    <aside className="stage" aria-hidden="false">
      {/* Layered atmospheric bg — drop your hero photo into .stage-img later */}
      <div className="stage-img" aria-hidden="true" />
      <div className="stage-grid" aria-hidden="true" />
      <div className="stage-vignette" aria-hidden="true" />

      <div className="stage-inner">
        <Logo size={26} className="!text-klano-text-on-stage" />

        <div className="stage-quote">
          <p className="stage-eyebrow">{lead.eyebrow}</p>
          <p className="stage-line">{lead.line}</p>
        </div>

        <div className="stage-meta">
          <ProgressBar current={currentStep} variant="dark" />
          <p className="stage-foot">
            <span className="dot" /> Made in Zürich · klano.ai
          </p>
        </div>
      </div>

      <style jsx>{`
        .stage {
          position: relative;
          display: none;
          min-height: 100vh;
          background: var(--color-klano-canvas);
          border-right: 1px solid var(--color-klano-border);
          overflow: hidden;
        }
        @media (min-width: 1024px) {
          .stage {
            display: flex;
            flex-direction: column;
            position: sticky;
            top: 0;
            height: 100vh;
            width: 50%;
          }
        }

        .stage-img {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 30% 20%, rgba(10, 10, 10, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 100%, rgba(10, 10, 10, 0.05) 0%, transparent 65%),
            linear-gradient(135deg, var(--color-klano-canvas) 0%, var(--color-klano-surface-2) 50%, var(--color-klano-canvas) 100%);
        }
        .stage-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(10, 10, 10, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(10, 10, 10, 0.04) 1px, transparent 1px);
          background-size: 64px 64px;
          background-position: -1px -1px;
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 90%);
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 90%);
        }
        .stage-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 65% 55% at 50% 60%, rgba(255, 255, 255, 0.45) 0%, transparent 75%);
        }

        .stage-inner {
          position: relative;
          z-index: 2;
          flex: 1;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        @media (min-width: 1280px) {
          .stage-inner { padding: 56px; }
        }

        .stage-quote { max-width: 440px; }
        .stage-eyebrow {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-klano-text-3);
          margin-bottom: 20px;
        }
        .stage-line {
          font-family: var(--font-display);
          font-weight: 400;
          font-size: clamp(1.625rem, 2.5vw, 2.25rem);
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: var(--color-klano-text);
        }

        .stage-meta {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stage-foot {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-klano-text-3);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .stage-foot .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-klano-success);
          box-shadow: 0 0 6px rgba(16, 185, 129, 0.5);
          display: inline-block;
        }
      `}</style>
    </aside>
  );
}

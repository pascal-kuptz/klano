'use client';

import { useWizard } from './WizardProvider';
import { Button } from '@/components/ui/Button';

export function Step1Welcome() {
  const { dispatch } = useWizard();
  return (
    <div className="text-center max-w-[640px] mx-auto">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-6">
        01 / Willkommen
      </p>
      <h1
        className="text-klano-text leading-[1.0]"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          letterSpacing: '-0.025em',
        }}
      >
        Lass uns deine Band kennenlernen.
      </h1>
      <p className="mt-6 text-klano-text-2 text-[clamp(1rem,1.4vw,1.125rem)] leading-[1.6]">
        Sieben kurze Schritte. Du brauchst kein Konto bis zum Schluss — wir zeigen dir vorher, was Klano für deine
        Band finden kann.
      </p>
      <div className="mt-10">
        <Button size="lg" onClick={() => dispatch({ type: 'next' })}>
          Los geht's
        </Button>
      </div>
    </div>
  );
}

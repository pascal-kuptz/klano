import { Suspense } from 'react';
import { SignInForm } from '@/components/app/SignInForm';

export const metadata = { title: 'Sign in' };

export default function SignInPage() {
  return (
    <div className="w-full max-w-[440px]">
      <div className="mb-8 text-center">
        <h1
          className="text-[clamp(2rem,4vw,2.5rem)] leading-[1.05] tracking-[-0.02em] text-klano-text"
          style={{ fontFamily: 'Instrument Serif, Georgia, serif', fontWeight: 400 }}
        >
          Welcome back
        </h1>
        <p className="mt-3 text-klano-text-2 text-[15px]">
          Wir senden dir einen Magic-Link an deine Mail.
        </p>
      </div>

      <div className="bg-klano-surface border border-klano-border rounded-[20px] p-8">
        <Suspense fallback={<div className="h-[280px]" />}>
          <SignInForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
        Keine Passwörter · Magic-Link · DSG/DSGVO
      </p>
    </div>
  );
}

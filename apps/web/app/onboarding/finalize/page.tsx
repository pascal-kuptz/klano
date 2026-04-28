import { Suspense } from 'react';
import { FinalizeClient } from '@/components/onboarding/FinalizeClient';

export const metadata = {
  title: 'Setup abschließen',
  robots: { index: false, follow: false },
};

export default function FinalizePage() {
  return (
    <Suspense fallback={<FinalizeFallback />}>
      <FinalizeClient />
    </Suspense>
  );
}

function FinalizeFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3">
        Lade …
      </p>
    </div>
  );
}

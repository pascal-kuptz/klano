'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function accept() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/invitations/${encodeURIComponent(token)}/accept`, {
        method: 'POST',
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) throw new Error(json.error ?? 'failed');
      router.replace('/dashboard');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler.');
      setBusy(false);
    }
  }

  return (
    <>
      <Button onClick={accept} disabled={busy} size="lg" className="w-full">
        {busy ? 'Schließe an …' : 'Einladung annehmen'}
      </Button>
      {error && <p className="text-[12px] text-klano-danger mt-3">{error}</p>}
    </>
  );
}

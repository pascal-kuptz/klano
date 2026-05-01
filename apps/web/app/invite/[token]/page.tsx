import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Logo } from '@/components/ui/Logo';
import { AcceptInviteButton } from '@/components/app/AcceptInviteButton';
import { createServerClient, getUser } from '@/lib/supabase/server';

interface Props {
  params: Promise<{ token: string }>;
}

interface Invitation {
  id: string;
  band_id: string;
  email: string;
  expires_at: string;
  accepted_at: string | null;
  band_name: string;
  invited_by_name: string;
}

export const metadata = { title: 'Einladung', robots: { index: false, follow: false } };

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const user = await getUser();

  // If signed out, route to sign-in and come back here.
  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(`/invite/${token}`)}`);
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  const { data: rawInvite, error } = await supabase
    .from('band_invitations')
    .select('id, band_id, email, expires_at, accepted_at')
    .eq('token', token)
    .maybeSingle();

  if (error || !rawInvite) {
    return <Shell><InvalidState /></Shell>;
  }

  const invite = rawInvite as Pick<Invitation, 'id' | 'band_id' | 'email' | 'expires_at' | 'accepted_at'>;

  if (invite.accepted_at) {
    return <Shell><AlreadyAccepted /></Shell>;
  }
  if (new Date(invite.expires_at) < new Date()) {
    return <Shell><ExpiredState /></Shell>;
  }

  // Look up band + inviter for the confirmation card.
  const [{ data: band }, { data: inviter }] = await Promise.all([
    supabase.from('bands').select('name').eq('id', invite.band_id).maybeSingle(),
    supabase
      .from('band_invitations')
      .select('invited_by, profiles:invited_by(full_name, email)')
      .eq('id', invite.id)
      .maybeSingle(),
  ]);

  const bandName = (band as { name?: string } | null)?.name ?? 'eine Band';
  const inviterName =
    ((inviter as { profiles?: { full_name?: string; email?: string } } | null)?.profiles?.full_name) ??
    ((inviter as { profiles?: { full_name?: string; email?: string } } | null)?.profiles?.email?.split('@')[0]) ??
    'jemand aus deiner Band';

  return (
    <Shell>
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-klano-text-3 mb-3">
        Einladung
      </p>
      <h1
        className="text-klano-text leading-[1.05] mb-3"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: 'clamp(1.875rem, 4vw, 2.5rem)',
          letterSpacing: '-0.02em',
        }}
      >
        Du wurdest zu {bandName} hinzugefügt.
      </h1>
      <p className="text-[14px] text-klano-text-2 leading-[1.6] mb-8">
        {inviterName} hat dich auf Klano eingeladen. Klick unten, dann bist du Teil der Band — Verfügbarkeiten,
        Bookings, Reminders alles in einer Ansicht.
      </p>
      <AcceptInviteButton token={token} />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-6 md:px-10 md:py-8">
        <Logo href="/" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[480px] bg-klano-surface border border-klano-border rounded-[20px] p-8">
          {children}
        </div>
      </main>
      <footer className="px-6 py-6 md:px-10 md:py-8 font-mono text-[11px] tracking-[0.08em] uppercase text-klano-text-3">
        klano · v0
      </footer>
    </div>
  );
}

function InvalidState() {
  return (
    <>
      <h1
        className="text-klano-text leading-[1.05] mb-3"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: '24px',
          letterSpacing: '-0.02em',
        }}
      >
        Einladung nicht gefunden.
      </h1>
      <p className="text-[14px] text-klano-text-2">
        Der Link ist ungültig oder wurde bereits verwendet. Lass dir vom Bandleader einen neuen schicken.
      </p>
    </>
  );
}

function AlreadyAccepted() {
  return (
    <>
      <h1
        className="text-klano-text leading-[1.05] mb-3"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: '24px',
          letterSpacing: '-0.02em',
        }}
      >
        Schon angenommen.
      </h1>
      <p className="text-[14px] text-klano-text-2 mb-6">Du bist bereits Teil dieser Band.</p>
      <a href="/dashboard" className="font-mono text-[12px] uppercase tracking-[0.08em] underline underline-offset-4">
        → Zum Dashboard
      </a>
    </>
  );
}

function ExpiredState() {
  return (
    <>
      <h1
        className="text-klano-text leading-[1.05] mb-3"
        style={{
          fontFamily: 'Instrument Serif, Georgia, serif',
          fontWeight: 400,
          fontSize: '24px',
          letterSpacing: '-0.02em',
        }}
      >
        Link abgelaufen.
      </h1>
      <p className="text-[14px] text-klano-text-2">
        Einladungs-Links sind 14 Tage gültig. Bitte um eine neue Einladung — geht in Sekunden.
      </p>
    </>
  );
}

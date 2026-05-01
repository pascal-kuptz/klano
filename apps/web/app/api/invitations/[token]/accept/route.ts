import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient, getUser } from '@/lib/supabase/server';

interface Params {
  params: Promise<{ token: string }>;
}

/**
 * POST /api/invitations/[token]/accept
 *
 * Validates the invitation token, joins the user to the band as a 'member',
 * and marks the invitation accepted. Idempotent: if user is already a member,
 * just marks accepted_at and returns ok.
 */
export async function POST(_request: Request, { params }: Params) {
  const user = await getUser();
  if (!user) return error('Nicht angemeldet.', 401);

  const { token } = await params;
  if (!token) return error('Token fehlt.', 400);

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  const { data: rawInvite } = await supabase
    .from('band_invitations')
    .select('id, band_id, email, expires_at, accepted_at')
    .eq('token', token)
    .maybeSingle();

  const invite = rawInvite as
    | { id: string; band_id: string; email: string; expires_at: string; accepted_at: string | null }
    | null;
  if (!invite) return error('Einladung nicht gefunden.', 404);
  if (invite.accepted_at) return NextResponse.json({ ok: true, alreadyAccepted: true });
  if (new Date(invite.expires_at) < new Date()) return error('Link abgelaufen.', 410);

  // Idempotent insert: trigger ensure_owner_is_leader handles the leader case.
  const { error: memberErr } = await supabase
    .from('band_members')
    .upsert(
      {
        band_id: invite.band_id,
        user_id: user.id,
        role: 'member',
      },
      { onConflict: 'band_id,user_id' },
    );
  if (memberErr) return error(memberErr.message, 500);

  await supabase
    .from('band_invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', invite.id);

  return NextResponse.json({ ok: true, bandId: invite.band_id });
}

function error(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

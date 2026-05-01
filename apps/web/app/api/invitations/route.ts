import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient, getUser } from '@/lib/supabase/server';

interface PostBody {
  bandId?: string;
  name: string;
  email: string;
  instrument?: string;
}

const TOKEN_EXPIRY_DAYS = 14;

/**
 * POST /api/invitations
 *
 * Promotes a pending member (collected during onboarding step 5) into a real
 * band_invitations row + (in v0.6) triggers a Resend mail. Also drops that
 * person from bands.pending_members so the dashboard card hides the row.
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return jsonError('Nicht angemeldet.', 401);

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return jsonError('Invalid JSON.', 400);
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  if (!name) return jsonError('Name fehlt.', 400);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError('Ungültige Mail.', 400);
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  // Resolve target band: explicit bandId, or the user's first leader band.
  let bandId = body.bandId;
  if (!bandId) {
    const { data: ownBand } = await supabase
      .from('bands')
      .select('id')
      .eq('owner_user_id', user.id)
      .limit(1)
      .maybeSingle();
    bandId = (ownBand as { id?: string } | null)?.id;
  }
  if (!bandId) return jsonError('Keine Band gefunden.', 404);

  const token = randomToken();
  const expires_at = new Date(Date.now() + TOKEN_EXPIRY_DAYS * 86_400_000).toISOString();

  const { error: insertErr } = await supabase.from('band_invitations').insert({
    band_id: bandId,
    email,
    invited_by: user.id,
    token,
    expires_at,
  });
  if (insertErr) return jsonError(insertErr.message, 500);

  // Remove from bands.pending_members
  const { data: bandRow } = await supabase
    .from('bands')
    .select('pending_members')
    .eq('id', bandId)
    .maybeSingle();
  const list = ((bandRow as { pending_members?: { name: string }[] } | null)?.pending_members ?? []) as {
    name: string;
    instrument?: string | null;
  }[];
  const next = list.filter((m) => m.name.toLowerCase() !== name.toLowerCase());
  await supabase.from('bands').update({ pending_members: next }).eq('id', bandId);

  // TODO v0.6: trigger Resend send via packages/email + Edge Function.
  // For now, just acknowledge.
  return NextResponse.json({ ok: true, token });
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function randomToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

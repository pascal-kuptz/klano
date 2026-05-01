import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { sendMail, OutreachEmail, buildReplyTo } from '@klano/email';
import { createServerClient, getUser } from '@/lib/supabase/server';

interface PostBody {
  bandId: string;
  venueId: string;
  to: string;
  subject: string;
  body: string;
  bookingId?: string;
}

/**
 * POST /api/bookings/send — sends an outreach mail via Resend, creates the
 * `bookings` row (if not provided), and inserts an `email_threads` row.
 *
 * Reply-To is `band-{bandId}-booking-{bookingId}@inbound.klano.ai` so
 * inbound parsing can find the booking.
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return error('Nicht angemeldet.', 401);

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return error('Invalid JSON', 400);
  }

  const required = ['venueId', 'to', 'subject', 'body'] as const;
  for (const k of required) {
    if (!body[k]?.trim()) return error(`${k} required`, 400);
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  // Resolve bandId: explicit value, or fall back to user's first owned band.
  let resolvedBandId = body.bandId && body.bandId !== 'self' ? body.bandId : null;
  if (!resolvedBandId) {
    const { data: ownBand } = await supabase
      .from('bands')
      .select('id')
      .eq('owner_user_id', user.id)
      .limit(1)
      .maybeSingle();
    resolvedBandId = (ownBand as { id?: string } | null)?.id ?? null;
  }
  if (!resolvedBandId) return error('Keine Band gefunden.', 404);
  body.bandId = resolvedBandId;

  // Create booking if not provided.
  let bookingId = body.bookingId;
  if (!bookingId) {
    const { data: created, error: bErr } = await supabase
      .from('bookings')
      .insert({
        band_id: body.bandId,
        venue_id: body.venueId,
        status: 'sent',
        created_by: user.id,
      })
      .select('id')
      .single();
    if (bErr || !created) return error(bErr?.message ?? 'booking insert failed', 500);
    bookingId = (created as { id: string }).id;
  } else {
    await supabase.from('bookings').update({ status: 'sent' }).eq('id', bookingId);
  }

  const replyTo = buildReplyTo(body.bandId, bookingId!);

  const sent = await sendMail({
    to: body.to.trim(),
    subject: body.subject,
    react: OutreachEmail({ body: body.body }),
    text: body.body,
    replyTo,
    headers: {
      'X-Klano-Band': body.bandId,
      'X-Klano-Booking': bookingId!,
    },
    tags: [
      { name: 'kind', value: 'outreach' },
      { name: 'band', value: body.bandId },
    ],
  });

  // Log the thread row regardless (mail might be in dev fallback).
  await supabase.from('email_threads').insert({
    booking_id: bookingId,
    resend_id: sent.id,
    direction: 'outbound',
    from_address: 'hello@klano.ai',
    to_address: body.to.trim(),
    subject: body.subject,
    body_text: body.body,
    sent_at: new Date().toISOString(),
  });

  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, error: sent.error ?? 'send failed', bookingId },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, bookingId, mail: { source: sent.source, id: sent.id } });
}

function error(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

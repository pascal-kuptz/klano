import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { parseReplyTo } from '@klano/email';
import { classifyInboundEmail, isAgentReady } from '@klano/agent';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ResendInboundPayload {
  /** Recipient address — should be the per-booking reply-to we sent. */
  to?: string | string[];
  toAddresses?: string[];
  recipient?: string;
  from?: { email?: string; name?: string } | string;
  subject?: string;
  text?: string;
  html?: string;
  /** Resend message id of the inbound mail */
  id?: string;
}

/**
 * POST /api/webhooks/resend-inbound — receives a parsed inbound email from Resend.
 *
 * Looks up the booking via the to-address (band-{bandId}-booking-{bookingId}@…),
 * stores the email_threads row, runs Klano classification, and patches the
 * booking status (replied) when classification suggests engagement.
 *
 * Production: verify Resend webhook signature here (svix-id / svix-signature).
 */
export async function POST(request: Request) {
  // Optional: verify signature. Skipped for v0.6 scaffold; see TODO below.
  // const sig = request.headers.get('resend-signature') ?? request.headers.get('svix-signature');

  let payload: ResendInboundPayload;
  try {
    payload = (await request.json()) as ResendInboundPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const recipient = pickRecipient(payload);
  if (!recipient) return NextResponse.json({ ok: false, error: 'No recipient' }, { status: 400 });

  const ids = parseReplyTo(recipient);
  if (!ids) {
    // Not one of ours — drop silently (200 so Resend stops retrying).
    return NextResponse.json({ ok: true, skipped: 'unknown recipient' });
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  const fromEmail = typeof payload.from === 'string' ? payload.from : payload.from?.email ?? null;
  const bodyText = payload.text ?? stripHtml(payload.html ?? '');
  const subject = payload.subject ?? '(kein Betreff)';

  // Insert the inbound thread row first.
  const { data: insertedRow } = await supabase
    .from('email_threads')
    .insert({
      booking_id: ids.bookingId,
      resend_id: payload.id ?? null,
      direction: 'inbound',
      from_address: fromEmail,
      to_address: recipient,
      subject,
      body_text: bodyText,
      body_html: payload.html ?? null,
      replied_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  // Best-effort classification — only run if Anthropic key is set.
  if (isAgentReady() && bodyText) {
    try {
      const cls = await classifyInboundEmail({ emailBody: bodyText, subject });
      await supabase
        .from('email_threads')
        .update({ ai_classification: cls })
        .eq('id', (insertedRow as { id?: string } | null)?.id ?? '');

      // Update booking status based on classification intent.
      if (cls.intent === 'positive' || cls.suggestedNextAction === 'confirm') {
        await supabase
          .from('bookings')
          .update({ status: 'replied' })
          .eq('id', ids.bookingId);
      } else if (cls.intent === 'negative') {
        await supabase
          .from('bookings')
          .update({ status: 'declined' })
          .eq('id', ids.bookingId);
      }
    } catch (e) {
      console.warn('classify-inbound failed', e);
    }
  } else {
    // No AI — at least mark booking as replied since we got a response.
    await supabase.from('bookings').update({ status: 'replied' }).eq('id', ids.bookingId);
  }

  return NextResponse.json({ ok: true, bookingId: ids.bookingId });
}

function pickRecipient(p: ResendInboundPayload): string | null {
  if (typeof p.to === 'string') return p.to;
  if (Array.isArray(p.to)) return p.to[0] ?? null;
  if (Array.isArray(p.toAddresses)) return p.toAddresses[0] ?? null;
  if (p.recipient) return p.recipient;
  return null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

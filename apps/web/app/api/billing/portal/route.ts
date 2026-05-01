import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { APP_URL, getStripe, isBillingReady } from '@/lib/billing/stripe';
import { createServerClient, getUser } from '@/lib/supabase/server';

/**
 * POST /api/billing/portal — returns a Stripe Customer Portal URL for the
 * caller's band. The user can change plan, cancel, update payment method,
 * download invoices.
 */
export async function POST(_request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'Nicht angemeldet.' }, { status: 401 });

  if (!isBillingReady()) {
    return NextResponse.json({ ok: false, error: 'Billing nicht konfiguriert.' }, { status: 503 });
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  const { data: subRow } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('band_id', (
      (await supabase
        .from('bands')
        .select('id')
        .eq('owner_user_id', user.id)
        .limit(1)
        .maybeSingle()).data as { id?: string } | null
    )?.id ?? '')
    .maybeSingle();

  const customerId = (subRow as { stripe_customer_id?: string } | null)?.stripe_customer_id;
  if (!customerId) {
    return NextResponse.json(
      { ok: false, error: 'Kein Stripe-Kunde — schließe zuerst ein Abo ab.' },
      { status: 404 },
    );
  }

  const stripe = getStripe()!;
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${APP_URL}/settings/billing`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}

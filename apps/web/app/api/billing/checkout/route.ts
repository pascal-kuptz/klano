import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { APP_URL, PRICE, getStripe, isBillingReady } from '@/lib/billing/stripe';
import { createServerClient, getUser } from '@/lib/supabase/server';

interface PostBody {
  bandId?: string;
  cycle?: 'monthly' | 'yearly';
}

/**
 * POST /api/billing/checkout — creates a Stripe Checkout Session for the
 * Pro plan and returns the redirect URL. Caller (settings/billing page)
 * does `window.location = url`.
 *
 * Subscription is owned by the band (per D4); we pass band_id as
 * client_reference_id and store stripe_customer_id back in subscriptions.
 */
export async function POST(request: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ ok: false, error: 'Nicht angemeldet.' }, { status: 401 });

  if (!isBillingReady()) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Billing nicht konfiguriert. STRIPE_SECRET_KEY + STRIPE_PRICE_PRO_* setzen.',
      },
      { status: 503 },
    );
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    body = {};
  }

  const cycle = body.cycle ?? 'monthly';
  const priceId = cycle === 'yearly' ? PRICE.proYearly : PRICE.proMonthly;
  if (!priceId) {
    return NextResponse.json(
      { ok: false, error: `Preis-ID für ${cycle} fehlt.` },
      { status: 503 },
    );
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  // Resolve band: explicit, or user's first owned band.
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
  if (!bandId) {
    return NextResponse.json({ ok: false, error: 'Keine Band gefunden.' }, { status: 404 });
  }

  // Reuse existing customer if we have one.
  const { data: subRow } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('band_id', bandId)
    .maybeSingle();
  const existingCustomer =
    ((subRow as { stripe_customer_id?: string } | null)?.stripe_customer_id) ?? undefined;

  const stripe = getStripe()!;
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    customer: existingCustomer,
    customer_email: existingCustomer ? undefined : user.email,
    client_reference_id: bandId,
    metadata: { band_id: bandId, user_id: user.id },
    subscription_data: {
      metadata: { band_id: bandId },
      trial_period_days: 14,
    },
    automatic_tax: { enabled: true },
    customer_update: existingCustomer ? { name: 'auto', address: 'auto' } : undefined,
    tax_id_collection: { enabled: true },
    allow_promotion_codes: true,
    success_url: `${APP_URL}/settings/billing?status=success`,
    cancel_url: `${APP_URL}/settings/billing?status=cancelled`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}

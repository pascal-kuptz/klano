import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getStripe, isBillingReady } from '@/lib/billing/stripe';
import { createServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/webhooks/stripe — verifies signature and syncs subscription state.
 *
 * Events handled:
 *  - checkout.session.completed  → activate subscription
 *  - customer.subscription.updated → sync status/period_end
 *  - customer.subscription.deleted → downgrade to free
 *  - invoice.payment_failed → mark past_due (UI shows grace period)
 */
export async function POST(request: Request) {
  if (!isBillingReady() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ ok: false, error: 'Webhook not configured' }, { status: 503 });
  }

  const stripe = getStripe()!;
  const sig = request.headers.get('stripe-signature') ?? '';
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e) {
    console.error('stripe webhook bad signature', e);
    return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        const bandId =
          (s.metadata?.band_id as string | undefined) ??
          (s.client_reference_id as string | null) ??
          undefined;
        if (!bandId) break;

        const subId = typeof s.subscription === 'string' ? s.subscription : s.subscription?.id;
        const customerId = typeof s.customer === 'string' ? s.customer : s.customer?.id;

        let periodEnd: string | null = null;
        let status: string = 'active';
        if (subId) {
          const sub = await stripe.subscriptions.retrieve(subId);
          periodEnd = new Date(sub.current_period_end * 1000).toISOString();
          status = sub.status;
        }

        await supabase
          .from('subscriptions')
          .upsert(
            {
              band_id: bandId,
              stripe_customer_id: customerId ?? null,
              stripe_subscription_id: subId ?? null,
              status,
              plan: 'pro',
              current_period_end: periodEnd,
              cancel_at_period_end: false,
            },
            { onConflict: 'band_id' },
          );
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const bandId = sub.metadata?.band_id;
        if (!bandId) break;
        await supabase
          .from('subscriptions')
          .update({
            status: sub.status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
            plan: sub.status === 'active' || sub.status === 'trialing' ? 'pro' : 'free',
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            plan: 'free',
            current_period_end: null,
            cancel_at_period_end: false,
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const inv = event.data.object as Stripe.Invoice;
        const subId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id;
        if (!subId) break;
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('stripe_subscription_id', subId);
        // TODO: send dunning email via packages/email
        break;
      }

      default:
        // Ignore — return 200 so Stripe stops retrying
        break;
    }
  } catch (e) {
    console.error('stripe webhook handler failed', event.type, e);
    return NextResponse.json({ ok: false, error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

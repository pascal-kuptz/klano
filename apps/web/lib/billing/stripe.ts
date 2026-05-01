import Stripe from 'stripe';

let instance: Stripe | null = null;

/** Returns a Stripe SDK instance, or null when STRIPE_SECRET_KEY is missing. */
export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!instance) {
    instance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
      typescript: true,
    });
  }
  return instance;
}

export function isBillingReady(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

/** Stripe Price IDs — set in env from Stripe Dashboard after creating prices. */
export const PRICE = {
  proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY ?? '',
  proYearly: process.env.STRIPE_PRICE_PRO_YEARLY ?? '',
} as const;

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.klano.ai';

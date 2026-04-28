export const KLANO_BRAND = {
  name: 'Klano',
  domain: 'klano.ai',
  appDomain: 'app.klano.ai',
  outboundMailDomain: 'hello.klano.ai',
  inboundMailDomain: 'inbound.klano.ai',
} as const;

export const KLANO_LIMITS = {
  free: {
    members: 6,
    outreachPerMonth: 10,
    aiMailsPerMonth: 5,
    venueSuggestionsPerMonth: 20,
    autoFollowUps: false,
  },
  pro: {
    members: Number.POSITIVE_INFINITY,
    outreachPerMonth: Number.POSITIVE_INFINITY,
    aiMailsPerMonth: Number.POSITIVE_INFINITY,
    venueSuggestionsPerMonth: Number.POSITIVE_INFINITY,
    autoFollowUps: true,
  },
} as const;

export const KLANO_PRICING = {
  proMonthly: { CHF: 19, EUR: 19, USD: 19 },
  proYearly: { CHF: 190, EUR: 190, USD: 190 },
  trialDays: 14,
} as const;

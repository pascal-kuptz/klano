/**
 * Free / Pro tier limits. Single source of truth — enforce server-side
 * before any AI call or mail send.
 *
 * Sync with _admin/decisions.md D5/D6 and _source/build-plan-v0.md §8.
 */

export type Plan = 'free' | 'pro';

export const LIMITS = {
  free: {
    members: 6,
    outreachPerMonth: 10,
    aiMailsPerMonth: 5,
    venueSuggestionsPerMonth: 20,
    autoFollowUps: false,
    aiInboxClassification: false,
    prioritySupport: false,
  },
  pro: {
    members: Number.POSITIVE_INFINITY,
    outreachPerMonth: Number.POSITIVE_INFINITY,
    aiMailsPerMonth: Number.POSITIVE_INFINITY,
    venueSuggestionsPerMonth: Number.POSITIVE_INFINITY,
    autoFollowUps: true,
    aiInboxClassification: true,
    prioritySupport: true,
  },
} as const satisfies Record<Plan, Record<string, number | boolean>>;

export type LimitKey = keyof typeof LIMITS.free;

export function isUnderLimit(plan: Plan, key: LimitKey, current: number): boolean {
  const limit = LIMITS[plan][key];
  if (typeof limit === 'boolean') return limit; // feature flag
  return current < limit;
}

export function isFeatureEnabled(plan: Plan, key: LimitKey): boolean {
  return Boolean(LIMITS[plan][key]);
}

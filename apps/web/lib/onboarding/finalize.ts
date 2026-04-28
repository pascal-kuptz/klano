'use server';

import { redirect } from 'next/navigation';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createServerClient, getUser } from '@/lib/supabase/server';
import type { WizardState } from './state';
import { STATIC_VENUES } from './venues-static';

export interface FinalizeResult {
  ok: boolean;
  bandId?: string;
  error?: string;
}

/**
 * Called from FinalizeClient after the magic-link callback succeeds.
 * Persists band + leader-membership + invitations into Supabase.
 *
 * Note: idempotent re-run protection (user clicks the link twice) will be
 * added in v0.4 once we have generated DB types from a running Supabase.
 */
export async function finalizeOnboarding(payload: WizardState): Promise<FinalizeResult> {
  const user = await getUser();
  if (!user) return { ok: false, error: 'Nicht angemeldet.' };

  // Cast to untyped client: workspace placeholder types don't resolve through
  // the @klano/db/server re-export yet. Re-introduce typed queries after
  // `pnpm --filter @klano/db gen-types` runs against live Supabase.
  const supabase = (await createServerClient()) as unknown as SupabaseClient;

  const name = payload.band.name.trim();
  if (!name) return { ok: false, error: 'Bandname fehlt.' };

  const slug = `${slugify(name)}-${user.id.slice(0, 6)}`;

  // Insert band — trigger ensure_owner_is_leader will add the leader row.
  const { data: band, error: bandError } = await supabase
    .from('bands')
    .insert({
      name,
      slug,
      genre: payload.band.genres,
      country: payload.band.country ?? 'CH',
      region: payload.band.regions[0] ?? null,
      ambition_level: payload.band.ambition ?? 'hobby',
      owner_user_id: user.id,
      preferred_language: payload.locale,
    })
    .select('id')
    .single();

  if (bandError || !band) {
    return { ok: false, error: bandError?.message ?? 'Band konnte nicht erstellt werden.' };
  }

  const bandId = (band as { id: string }).id;

  // Invitations.
  if (payload.invites.length) {
    await supabase.from('band_invitations').insert(
      payload.invites.map((i) => ({
        band_id: bandId,
        email: i.email.toLowerCase(),
        invited_by: user.id,
        token: cryptoRandomToken(),
        expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })),
    );
    // TODO v0.6: trigger Resend invite email via packages/email + Edge Function.
  }

  // Pre-seeded booking from selected venue (if a real DB venue matches).
  if (payload.selectedVenueId) {
    const staticVenue = STATIC_VENUES.find((v) => v.id === payload.selectedVenueId);
    if (staticVenue) {
      const { data: dbVenue } = await supabase
        .from('venues')
        .select('id')
        .eq('name', staticVenue.name)
        .eq('city', staticVenue.city)
        .maybeSingle();
      if (dbVenue && (dbVenue as { id?: string }).id) {
        await supabase.from('bookings').insert({
          band_id: bandId,
          venue_id: (dbVenue as { id: string }).id,
          status: 'drafted',
          created_by: user.id,
        });
      }
    }
  }

  return { ok: true, bandId };
}

export async function finalizeAndRedirect(payload: WizardState): Promise<void> {
  const result = await finalizeOnboarding(payload);
  if (!result.ok) {
    redirect(`/onboarding?error=${encodeURIComponent(result.error ?? 'unknown')}`);
  }
  redirect('/dashboard');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

function cryptoRandomToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

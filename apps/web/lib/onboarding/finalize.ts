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
      country: payload.band.countries[0] ?? 'CH',
      region: payload.band.regions[0] ?? null,
      ambition_level: payload.band.ambition ?? 'hobby',
      owner_user_id: user.id,
      preferred_language: payload.locale,
      // Onboarding step 5 captures names only — emails are added on the
      // dashboard 'Bandkollegen einladen' card, which then creates real
      // band_invitations rows + sends Resend mails.
      pending_members: payload.invites.map((i) => ({
        name: i.name,
        instrument: i.instrument ?? null,
      })),
    })
    .select('id')
    .single();

  if (bandError || !band) {
    return { ok: false, error: bandError?.message ?? 'Band konnte nicht erstellt werden.' };
  }

  const bandId = (band as { id: string }).id;

  // Logo: upload data URL to Supabase Storage 'band-logos' bucket and patch URL.
  if (payload.band.logoDataUrl) {
    try {
      const blob = dataUrlToBlob(payload.band.logoDataUrl);
      const ext = blob.type === 'image/png' ? 'png' : 'jpg';
      const path = `${user.id}/${slug}.${ext}`;
      const { error: upError } = await supabase.storage
        .from('band-logos')
        .upload(path, blob, { upsert: true, contentType: blob.type });
      if (!upError) {
        const { data: pub } = supabase.storage.from('band-logos').getPublicUrl(path);
        if (pub?.publicUrl) {
          await supabase.from('bands').update({ logo_url: pub.publicUrl }).eq('id', bandId);
        }
      }
    } catch (e) {
      console.warn('Logo upload skipped', e);
    }
  }

  // Profile (full_name from wizard "Du" block) — best-effort, ignore errors.
  if (payload.user.fullName?.trim()) {
    await supabase
      .from('profiles')
      .update({ full_name: payload.user.fullName.trim() })
      .eq('id', user.id);
  }

  // Owner's band_members row was created by trigger; set the instrument if provided.
  if (payload.user.instrument?.trim()) {
    await supabase
      .from('band_members')
      .update({ instrument: payload.user.instrument.trim() })
      .eq('band_id', bandId)
      .eq('user_id', user.id);
  }

  // Email-based invitations are NOT created during onboarding anymore —
  // the leader collects only names + instruments here. Emails are added
  // and sent from the dashboard's 'Bandkollegen einladen' card, which
  // creates band_invitations rows and triggers Resend mails (v0.6).

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

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, body] = dataUrl.split(',');
  if (!head || !body) throw new Error('Invalid data URL');
  const mimeMatch = /data:(.*?);base64/.exec(head);
  const mime = mimeMatch?.[1] ?? 'application/octet-stream';
  const binary = atob(body);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
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


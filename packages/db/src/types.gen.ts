/**
 * Auto-generated types from `supabase gen types typescript`.
 * Re-generate with: `pnpm --filter @klano/db gen-types`
 *
 * Until the local Supabase is started for the first time, this is a
 * structural placeholder shaped after the migration files.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Locale = 'de' | 'en';
export type Country = 'CH' | 'DE' | 'AT';
export type AmbitionLevel = 'hobby' | 'semi_pro' | 'pro';
export type BandRole = 'leader' | 'member';
export type BookingStatus =
  | 'drafted'
  | 'sent'
  | 'opened'
  | 'replied'
  | 'negotiating'
  | 'booked'
  | 'declined'
  | 'no_response'
  | 'archived';
export type EmailDirection = 'outbound' | 'inbound';
export type EventType = 'rehearsal' | 'gig' | 'meeting' | 'other';
export type AvailabilityStatus = 'free' | 'busy' | 'tentative';
export type SubscriptionStatus =
  | 'free'
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'incomplete';
export type SubscriptionPlan = 'free' | 'pro';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          preferred_language: Locale;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string; email: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      bands: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          genre: string[] | null;
          region: string | null;
          country: Country;
          preferred_language: Locale;
          ambition_level: AmbitionLevel;
          bio: string | null;
          owner_user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bands']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
        };
        Update: Partial<Database['public']['Tables']['bands']['Row']>;
      };
      band_members: {
        Row: {
          band_id: string;
          user_id: string;
          role: BandRole;
          instrument: string | null;
          joined_at: string;
        };
        Insert: Database['public']['Tables']['band_members']['Row'];
        Update: Partial<Database['public']['Tables']['band_members']['Row']>;
      };
      // ... remaining tables intentionally omitted in placeholder.
      // Run `pnpm --filter @klano/db gen-types` once Supabase is running locally.
    };
    Functions: {
      is_band_member: { Args: { _band_id: string }; Returns: boolean };
      is_band_leader: { Args: { _band_id: string }; Returns: boolean };
      is_band_owner: { Args: { _band_id: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}

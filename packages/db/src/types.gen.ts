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
export type AgentActionStatus = 'pending' | 'success' | 'failed';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferred_language: Locale;
  created_at: string;
  updated_at: string;
}

interface BandRow {
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
}

interface BandMemberRow {
  band_id: string;
  user_id: string;
  role: BandRole;
  instrument: string | null;
  joined_at: string;
}

interface BandInvitationRow {
  id: string;
  band_id: string;
  email: string;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

interface VenueRow {
  id: string;
  name: string;
  city: string;
  country: Country;
  region: string | null;
  postal_code: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  capacity: number | null;
  genres: string[] | null;
  primary_language: Locale;
  contact_email: string | null;
  contact_form_url: string | null;
  website: string | null;
  notes: string | null;
  source: string | null;
  last_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface BookingRow {
  id: string;
  band_id: string;
  venue_id: string;
  status: BookingStatus;
  desired_date: string | null;
  agreed_date: string | null;
  agreed_fee: number | null;
  notes: string | null;
  last_followup_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface EmailThreadRow {
  id: string;
  booking_id: string | null;
  resend_id: string | null;
  direction: EmailDirection;
  from_address: string | null;
  to_address: string | null;
  subject: string | null;
  body_text: string | null;
  body_html: string | null;
  sent_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  ai_classification: Json | null;
  created_at: string;
}

interface EventRow {
  id: string;
  band_id: string;
  type: EventType;
  title: string;
  location: string | null;
  starts_at: string;
  ends_at: string | null;
  notes: string | null;
  booking_id: string | null;
  created_at: string;
}

interface AvailabilityRow {
  user_id: string;
  band_id: string;
  date: string;
  status: AvailabilityStatus;
}

interface SubscriptionRow {
  id: string;
  band_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

interface AgentActionRow {
  id: string;
  band_id: string | null;
  triggered_by: string | null;
  action_type: string;
  input: Json | null;
  output: Json | null;
  status: AgentActionStatus;
  error: string | null;
  tokens_input: number | null;
  tokens_output: number | null;
  cost_usd: number | null;
  created_at: string;
}

interface WaitlistRow {
  id: string;
  email: string;
  source: string | null;
  language: Locale;
  metadata: Json;
  confirmed_at: string | null;
  created_at: string;
}

type CRUD<T> = {
  Row: T;
  Insert: Partial<T>;
  Update: Partial<T>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: CRUD<ProfileRow>;
      bands: CRUD<BandRow>;
      band_members: CRUD<BandMemberRow>;
      band_invitations: CRUD<BandInvitationRow>;
      venues: CRUD<VenueRow>;
      bookings: CRUD<BookingRow>;
      email_threads: CRUD<EmailThreadRow>;
      events: CRUD<EventRow>;
      availabilities: CRUD<AvailabilityRow>;
      subscriptions: CRUD<SubscriptionRow>;
      agent_actions: CRUD<AgentActionRow>;
      waitlist: CRUD<WaitlistRow>;
    };
    Functions: {
      is_band_member: { Args: { _band_id: string }; Returns: boolean };
      is_band_leader: { Args: { _band_id: string }; Returns: boolean };
      is_band_owner: { Args: { _band_id: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
    Views: Record<string, never>;
  };
}

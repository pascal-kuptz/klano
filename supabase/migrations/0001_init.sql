-- ===================================================================
-- Klano · 0001_init
-- Core schema for tenants (bands), users, venues, bookings, events.
-- See _source/build-plan-v0.md §3 and _admin/decisions.md D4–D6 for rationale.
-- ===================================================================

create extension if not exists "pgcrypto";

-- =================================================================
-- profiles  ── mirror of auth.users for app-level joins
-- =================================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  preferred_language text not null default 'de'
    check (preferred_language in ('de', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_profiles_email on profiles(email);

-- =================================================================
-- bands  ── the tenant entity
-- =================================================================
create table bands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  genre text[],
  region text,
  country text not null default 'CH'
    check (country in ('CH', 'DE', 'AT')),
  preferred_language text not null default 'de'
    check (preferred_language in ('de', 'en')),
  ambition_level text not null default 'hobby'
    check (ambition_level in ('hobby', 'semi_pro', 'pro')),
  bio text,
  owner_user_id uuid not null references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bands_owner on bands(owner_user_id);
create index idx_bands_country on bands(country);

-- =================================================================
-- band_members  ── M:N profiles ↔ bands with role
-- =================================================================
create table band_members (
  band_id uuid not null references bands(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'member'
    check (role in ('leader', 'member')),
  instrument text,
  joined_at timestamptz not null default now(),
  primary key (band_id, user_id)
);

create index idx_band_members_user on band_members(user_id);
create index idx_band_members_role on band_members(band_id, role);

-- =================================================================
-- band_invitations  ── pending invites with one-time token
-- =================================================================
create table band_invitations (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references bands(id) on delete cascade,
  email text not null,
  invited_by uuid not null references profiles(id),
  token text unique not null,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_band_invitations_band on band_invitations(band_id);
create index idx_band_invitations_email on band_invitations(email);

-- =================================================================
-- venues  ── curated DACH database (read-only for end users)
-- =================================================================
create table venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text not null,
  country text not null check (country in ('CH', 'DE', 'AT')),
  region text,
  postal_code text,
  address text,
  lat numeric,
  lng numeric,
  capacity int,
  genres text[],
  primary_language text not null default 'de'
    check (primary_language in ('de', 'en')),
  contact_email text,
  contact_form_url text,
  website text,
  notes text,
  source text,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_venues_country_city on venues(country, city);
create index idx_venues_genres on venues using gin(genres);

-- =================================================================
-- bookings  ── pipeline state per band ↔ venue
-- =================================================================
create table bookings (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references bands(id) on delete cascade,
  venue_id uuid not null references venues(id),
  status text not null default 'drafted' check (status in (
    'drafted', 'sent', 'opened', 'replied', 'negotiating',
    'booked', 'declined', 'no_response', 'archived'
  )),
  desired_date date,
  agreed_date date,
  agreed_fee numeric,
  notes text,
  last_followup_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_bookings_band on bookings(band_id);
create index idx_bookings_status on bookings(band_id, status);
create index idx_bookings_venue on bookings(venue_id);

-- =================================================================
-- email_threads  ── outbound + inbound mail tied to a booking
-- =================================================================
create table email_threads (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id) on delete cascade,
  resend_id text,
  direction text not null check (direction in ('outbound', 'inbound')),
  from_address text,
  to_address text,
  subject text,
  body_text text,
  body_html text,
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz,
  ai_classification jsonb,
  created_at timestamptz not null default now()
);

create index idx_email_threads_booking on email_threads(booking_id);
create index idx_email_threads_resend on email_threads(resend_id);

-- =================================================================
-- events  ── rehearsals, gigs, meetings (per band)
-- =================================================================
create table events (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null references bands(id) on delete cascade,
  type text not null check (type in ('rehearsal', 'gig', 'meeting', 'other')),
  title text not null,
  location text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  notes text,
  booking_id uuid references bookings(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_events_band_date on events(band_id, starts_at);

-- =================================================================
-- availabilities  ── per-member day-level slots
-- =================================================================
create table availabilities (
  user_id uuid not null references profiles(id) on delete cascade,
  band_id uuid not null references bands(id) on delete cascade,
  date date not null,
  status text not null check (status in ('free', 'busy', 'tentative')),
  primary key (user_id, band_id, date)
);

create index idx_availabilities_band_date on availabilities(band_id, date);

-- =================================================================
-- subscriptions  ── Stripe mirror, 1:1 with band
-- =================================================================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  band_id uuid not null unique references bands(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  status text not null default 'free' check (status in (
    'free', 'trialing', 'active', 'past_due', 'canceled', 'incomplete'
  )),
  plan text not null default 'free' check (plan in ('free', 'pro')),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =================================================================
-- agent_actions  ── audit log for every AI tool invocation
-- =================================================================
create table agent_actions (
  id uuid primary key default gen_random_uuid(),
  band_id uuid references bands(id) on delete cascade,
  triggered_by uuid references profiles(id),
  action_type text not null,
  input jsonb,
  output jsonb,
  status text not null check (status in ('pending', 'success', 'failed')),
  error text,
  tokens_input int,
  tokens_output int,
  cost_usd numeric,
  created_at timestamptz not null default now()
);

create index idx_agent_actions_band on agent_actions(band_id, created_at desc);
create index idx_agent_actions_type on agent_actions(action_type, created_at desc);

-- =================================================================
-- waitlist  ── marketing-site sign-ups (public-write via edge fn only)
-- =================================================================
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  language text not null default 'de'
    check (language in ('de', 'en')),
  metadata jsonb not null default '{}'::jsonb,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_waitlist_created on waitlist(created_at desc);

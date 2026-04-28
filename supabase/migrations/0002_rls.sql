-- ===================================================================
-- Klano · 0002_rls
-- Row-level security policies. Aggressive default-deny; band-scoped reads.
-- Helper functions are SECURITY DEFINER and STABLE for use in policies.
-- ===================================================================

-- =================================================================
-- Helpers
-- =================================================================
create or replace function is_band_member(_band_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(
    select 1 from band_members
    where band_id = _band_id and user_id = auth.uid()
  );
$$;

create or replace function is_band_leader(_band_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(
    select 1 from band_members
    where band_id = _band_id and user_id = auth.uid() and role = 'leader'
  );
$$;

create or replace function is_band_owner(_band_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists(
    select 1 from bands
    where id = _band_id and owner_user_id = auth.uid()
  );
$$;

-- =================================================================
-- profiles  ── readable by self + band-mates; writable by self
-- =================================================================
alter table profiles enable row level security;

create policy "profiles: self-or-bandmate read" on profiles
  for select using (
    id = auth.uid()
    or exists (
      select 1 from band_members bm1
      join band_members bm2 on bm2.band_id = bm1.band_id
      where bm1.user_id = auth.uid() and bm2.user_id = profiles.id
    )
  );

create policy "profiles: self update" on profiles
  for update using (id = auth.uid());

create policy "profiles: self insert" on profiles
  for insert with check (id = auth.uid());

-- =================================================================
-- bands  ── members read; owner updates
-- =================================================================
alter table bands enable row level security;

create policy "bands: members read" on bands
  for select using (is_band_member(id));

create policy "bands: owner update" on bands
  for update using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

create policy "bands: authenticated insert (becomes owner)" on bands
  for insert with check (owner_user_id = auth.uid());

create policy "bands: owner delete" on bands
  for delete using (owner_user_id = auth.uid());

-- =================================================================
-- band_members
-- =================================================================
alter table band_members enable row level security;

create policy "band_members: members read" on band_members
  for select using (is_band_member(band_id));

create policy "band_members: leader manage" on band_members
  for all using (is_band_leader(band_id))
  with check (is_band_leader(band_id));

-- =================================================================
-- band_invitations
-- =================================================================
alter table band_invitations enable row level security;

create policy "band_invitations: members read" on band_invitations
  for select using (is_band_member(band_id));

create policy "band_invitations: leader manage" on band_invitations
  for all using (is_band_leader(band_id))
  with check (is_band_leader(band_id));

-- =================================================================
-- venues  ── public read for authenticated users; admin-only writes
-- =================================================================
alter table venues enable row level security;

create policy "venues: authenticated read" on venues
  for select using (auth.role() = 'authenticated');

-- Writes are reserved for service-role (curators) — no policy = denied.

-- =================================================================
-- bookings
-- =================================================================
alter table bookings enable row level security;

create policy "bookings: band members" on bookings
  for all using (is_band_member(band_id))
  with check (is_band_member(band_id));

-- =================================================================
-- email_threads  ── reachable through booking
-- =================================================================
alter table email_threads enable row level security;

create policy "email_threads: band members via booking" on email_threads
  for all using (
    booking_id is null
    or exists (
      select 1 from bookings b
      where b.id = email_threads.booking_id
        and is_band_member(b.band_id)
    )
  )
  with check (
    booking_id is null
    or exists (
      select 1 from bookings b
      where b.id = email_threads.booking_id
        and is_band_member(b.band_id)
    )
  );

-- =================================================================
-- events
-- =================================================================
alter table events enable row level security;

create policy "events: band members" on events
  for all using (is_band_member(band_id))
  with check (is_band_member(band_id));

-- =================================================================
-- availabilities  ── members manage their own; leaders read all
-- =================================================================
alter table availabilities enable row level security;

create policy "availabilities: self manage" on availabilities
  for all using (user_id = auth.uid())
  with check (user_id = auth.uid() and is_band_member(band_id));

create policy "availabilities: members read all" on availabilities
  for select using (is_band_member(band_id));

-- =================================================================
-- subscriptions  ── members read; only owner mutates (writes happen
-- server-side via Stripe webhook with service-role)
-- =================================================================
alter table subscriptions enable row level security;

create policy "subscriptions: members read" on subscriptions
  for select using (is_band_member(band_id));

-- =================================================================
-- agent_actions  ── members read for transparency; service-role writes
-- =================================================================
alter table agent_actions enable row level security;

create policy "agent_actions: members read" on agent_actions
  for select using (
    band_id is null or is_band_member(band_id)
  );

-- =================================================================
-- waitlist  ── default-deny. Writes happen via edge function with
-- service-role; no end-user reads.
-- =================================================================
alter table waitlist enable row level security;
-- Intentionally no policies → fully denied to anon/authenticated roles.

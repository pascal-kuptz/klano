-- ===================================================================
-- Klano · 0003_triggers
-- (1) updated_at touch on every mutable table
-- (2) profile auto-create on auth.users insert
-- (3) bands.owner is always also a band_members.leader (decision D4)
-- ===================================================================

-- =================================================================
-- 1) Generic updated_at touch
-- =================================================================
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_profiles_updated      before update on profiles      for each row execute function set_updated_at();
create trigger trg_bands_updated         before update on bands         for each row execute function set_updated_at();
create trigger trg_venues_updated        before update on venues        for each row execute function set_updated_at();
create trigger trg_bookings_updated      before update on bookings      for each row execute function set_updated_at();
create trigger trg_subscriptions_updated before update on subscriptions for each row execute function set_updated_at();

-- =================================================================
-- 2) Auto-provision profiles row from auth.users
-- =================================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- =================================================================
-- 3) Owner is always a leader  (decision D4)
--    Enforced via: insert/update on bands → upsert band_members(leader)
-- =================================================================
create or replace function ensure_owner_is_leader()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into band_members (band_id, user_id, role)
  values (new.id, new.owner_user_id, 'leader')
  on conflict (band_id, user_id)
    do update set role = 'leader';
  return new;
end;
$$;

create trigger trg_bands_owner_is_leader_insert
  after insert on bands
  for each row execute function ensure_owner_is_leader();

create trigger trg_bands_owner_is_leader_update
  after update of owner_user_id on bands
  for each row
  when (new.owner_user_id is distinct from old.owner_user_id)
  execute function ensure_owner_is_leader();

-- =================================================================
-- 4) Prevent removing the owner from band_members
-- =================================================================
create or replace function prevent_owner_member_removal()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1 from bands
    where id = old.band_id and owner_user_id = old.user_id
  ) then
    raise exception 'Cannot remove the band owner from members. Transfer ownership first.';
  end if;
  return old;
end;
$$;

create trigger trg_band_members_protect_owner
  before delete on band_members
  for each row execute function prevent_owner_member_removal();

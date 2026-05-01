-- ===================================================================
-- Klano · 0004_pending_members
-- Stores names + instruments collected during onboarding step 5 before
-- email invitations are actually sent. Users add emails on the dashboard
-- ('Bandkollegen einladen' card), which then promotes the entry into a
-- real `band_invitations` row.
-- ===================================================================

alter table bands
  add column if not exists pending_members jsonb not null default '[]'::jsonb;

comment on column bands.pending_members is
  'Onboarding-collected member placeholders: [{name, instrument?}]. Each entry becomes a band_invitations row when the leader adds an email and triggers the invite flow.';

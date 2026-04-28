-- ===================================================================
-- Klano · local dev seed
-- Runs after migrations on `supabase db reset`. Production seeding is
-- separate (see _admin/next-steps.md re: venue curation).
-- ===================================================================

insert into venues (name, city, country, region, capacity, genres, primary_language, contact_email, website)
values
  ('Bogen F',   'Zürich',     'CH', 'Zürich',          180,  array['indie','rock'],  'de', 'bookings@bogenf.ch',   'https://bogenf.ch'),
  ('Mascotte',  'Zürich',     'CH', 'Zürich',          220,  array['all'],            'de', 'bookings@mascotte.ch', 'https://mascotte.ch'),
  ('Sender',    'Winterthur', 'CH', 'Zürich',          140,  array['folk','indie'],   'de', null,                   null),
  ('Kammgarn',  'Schaffhausen','CH','Schaffhausen',    300,  array['rock','jazz'],    'de', null,                   null),
  ('Lido',      'Berlin',     'DE', 'Berlin',          800,  array['indie','rock'],   'de', null,                   null),
  ('Flex',      'Wien',       'AT', 'Wien',            1000, array['indie','electronic'],'de', null,                null)
on conflict do nothing;

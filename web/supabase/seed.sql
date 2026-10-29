-- REGIONS
insert into public.regions (slug, name, area, min_lat, max_lat, min_lng, max_lng, sort_order, is_default) values
  ('downtown', 'Downtown Vancouver', 'metro-vancouver', 49.270, 49.300, -123.145, -123.100, 1, true),
  ('burnaby',  'Burnaby',            'metro-vancouver', 49.180, 49.300, -123.025, -122.890, 2, false),
  ('richmond', 'Richmond',           'metro-vancouver', 49.110, 49.200, -123.210, -123.000, 3, false),
  ('surrey',   'Surrey',             'metro-vancouver', 49.000, 49.220, -122.900, -122.680, 4, false);

-- RESTAURANTS (fictional placeholders)
insert into public.restaurants
  (slug, name, cuisine, price_level, lat, lng, region_id, photo_path, food_score, packaging_score, supply_score, verified, published)
values
  ('fernleaf-kitchen',    'Fernleaf Kitchen',    'Vegan',   2, 49.2845, -123.1210, (select id from public.regions where slug = 'downtown'), 'fernleaf-kitchen.webp',    92, 88, 85, true,  true),
  ('little-tern-seafood', 'Little Tern Seafood', 'Seafood', 3, 49.2790, -123.1305, (select id from public.regions where slug = 'downtown'), 'little-tern-seafood.webp', 64, 71, 90, true,  true),
  ('ember-and-crust',     'Ember & Crust',       'Pizza',   2, 49.2270, -122.9980, (select id from public.regions where slug = 'burnaby'),  'ember-and-crust.webp',     78, 55, 62, false, true),
  ('cedar-row-cafe',      'Cedar Row Café',      'Cafe',    1, 49.1680, -123.1370, (select id from public.regions where slug = 'richmond'), 'cedar-row-cafe.webp',      85, 93, 70, false, true),
  ('casa-milpa',          'Casa Milpa',          'Mexican', 2, 49.1890, -122.8470, (select id from public.regions where slug = 'surrey'),   'casa-milpa.webp',          null, null, null, false, true);
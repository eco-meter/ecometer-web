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

  

-- ACHIEVEMENTS (Ewan's list, same copy as the About page)
insert into public.achievements (slug, name, description, sort_order) values
  ('food-for-all',           'Food For All',           'Helps reduce food insecurity by regularly donating safe, edible surplus food whenever possible.', 1),
  ('veggie-rescuer',         'Veggie Rescuer',         'Actively sources visually imperfect produce to reduce food waste on farms.', 2),
  ('all-organic',            'All Organic',            'Uses only certified organic ingredients that avoid synthetic pesticides, artificial fertilizers, GMOs, and ionizing radiation.', 3),
  ('plastic-free',           'Plastic Free',           'Avoids plastic throughout the storage, preparation, cleaning, and service of its food and food ware wherever practical.', 4),
  ('reusable-friendly',      'Reusable Friendly',      'Welcomes customers who bring their own reusable food and drink containers.', 5),
  ('canada-first',           'Canada First',           'Sources the majority of its food and packaging from Canadian farms and manufacturers, verified through supplier information.', 6),
  ('microplastic-mitigator', 'Microplastic Mitigator', 'Takes proactive steps to reduce microplastic contamination in food and beverages, including using high-quality water filtration.', 7),
  ('sustainable-seafood',    'Sustainable Seafood',    'Serves seafood certified by Ocean Wise.', 8),
  ('vegetarian-champion',    'Vegetarian Champion',    'Over 50% of menu items are vegetarian friendly.', 9),
  ('vegetarian-friend',      'Vegetarian Friend',      '25-50% of menu items are vegetarian friendly.', 10),
  ('vegan-champion',         'Vegan Champion',         'Over 50% of menu items are vegan friendly.', 11),
  ('vegan-friend',           'Vegan Friend',           '25-50% of menu items are vegan friendly.', 12),
  ('upcycler',               'Upcycler',               'Uses upcycled ingredients in dishes (e.g. spent grain, fruit pulp, peels, coffee grounds, etc.) or ensures they''re upcycled elsewhere.', 13),
  ('responsible-oil',        'Responsible Oil',        'Partners with specialized local recycling services to sustainably collect used cooking oil and replenish it with fresh oil in reusable containers.', 14);

-- EARNED ACHIEVEMENTS (placeholder data for the fictional restaurants)
insert into public.restaurant_achievements (restaurant_id, achievement_id, earned_on)
select r.id, a.id, e.earned_on::date
from (values
  ('fernleaf-kitchen',    'vegan-champion',         '2026-03-12'),
  ('fernleaf-kitchen',    'all-organic',            '2026-03-12'),
  ('fernleaf-kitchen',    'plastic-free',           '2026-05-02'),
  ('fernleaf-kitchen',    'reusable-friendly',      '2026-05-02'),
  ('fernleaf-kitchen',    'upcycler',               '2026-07-25'),
  ('fernleaf-kitchen',    'food-for-all',           '2026-08-14'),
  ('fernleaf-kitchen',    'canada-first',           '2026-09-30'),
  ('little-tern-seafood', 'sustainable-seafood',    '2026-04-18'),
  ('little-tern-seafood', 'responsible-oil',        '2026-06-09'),
  ('little-tern-seafood', 'reusable-friendly',      '2026-06-09'),
  ('ember-and-crust',     'veggie-rescuer',         '2026-07-01'),
  ('ember-and-crust',     'vegetarian-friend',      '2026-07-01'),
  ('cedar-row-cafe',      'reusable-friendly',      '2026-02-20'),
  ('cedar-row-cafe',      'microplastic-mitigator', '2026-05-15'),
  ('cedar-row-cafe',      'upcycler',               '2026-08-03'),
  ('cedar-row-cafe',      'plastic-free',           '2026-10-10')
) as e (restaurant_slug, achievement_slug, earned_on)
join public.restaurants r on r.slug = e.restaurant_slug
join public.achievements a on a.slug = e.achievement_slug;
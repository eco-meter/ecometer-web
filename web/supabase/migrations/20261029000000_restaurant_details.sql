-- Extra details shown on each restaurant page.
-- All optional, so existing rows keep working until they're filled in.
alter table public.restaurants
  add column description text,
  add column address text,
  add column tags text, -- comma-separated, e.g. 'Healthy Café, Plant-Based, Organic'
  add column google_rating numeric(2, 1) check (google_rating between 0 and 5),
  add column google_review_count integer check (google_review_count >= 0),
  add column score_updated_at date;
-- REGIONS: the areas people browse by (Downtown, Burnaby, etc.)
create table public.regions (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  area text not null check (area in ('metro-vancouver', 'vancouver-island')),
  min_lat double precision not null,
  max_lat double precision not null,
  min_lng double precision not null,
  max_lng double precision not null,
  sort_order int not null default 0,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  check (min_lat < max_lat),
  check (min_lng < max_lng)
);

-- Only one region can be the default
create unique index regions_one_default on public.regions (is_default) where is_default;

-- RESTAURANTS
create table public.restaurants (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  cuisine text not null,
  price_level smallint not null check (price_level between 1 and 4),
  lat double precision not null,
  lng double precision not null,
  region_id bigint not null references public.regions (id) on delete restrict,
  photo_path text,
  food_score smallint check (food_score between 0 and 100),
  packaging_score smallint check (packaging_score between 0 and 100),
  supply_score smallint check (supply_score between 0 and 100),
  verified boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create index restaurants_region_id_idx on public.restaurants (region_id);

-- SECURITY: the public can read, nobody can write through the website
alter table public.regions enable row level security;
alter table public.restaurants enable row level security;

create policy "Regions are publicly readable"
  on public.regions for select
  to anon, authenticated
  using (true);

create policy "Published restaurants are publicly readable"
  on public.restaurants for select
  to anon, authenticated
  using (published = true);

grant select on public.regions, public.restaurants to anon, authenticated;
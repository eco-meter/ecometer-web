-- ACHIEVEMENTS: the list of awards a restaurant can earn.
-- Ewan edits these in the Supabase Table Editor.
create table public.achievements (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  description text not null,
  emblem_path text, -- optional image in the restaurant-photos bucket, e.g. 'achievements/plastic-free.png'
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- Which restaurant has earned which achievement, and when.
-- Adding a row here awards it. Deleting the row takes it away.
create table public.restaurant_achievements (
  restaurant_id bigint not null references public.restaurants (id) on delete cascade,
  achievement_id bigint not null references public.achievements (id) on delete cascade,
  earned_on date not null default current_date,
  primary key (restaurant_id, achievement_id)
);

create index restaurant_achievements_achievement_id_idx
  on public.restaurant_achievements (achievement_id);

-- SECURITY: the public can read, nobody can write through the website
alter table public.achievements enable row level security;
alter table public.restaurant_achievements enable row level security;

create policy "Achievements are publicly readable"
  on public.achievements for select
  to anon, authenticated
  using (true);

create policy "Earned achievements are publicly readable"
  on public.restaurant_achievements for select
  to anon, authenticated
  using (true);

grant select on public.achievements, public.restaurant_achievements to anon, authenticated;
-- Run once in the Supabase SQL editor.
-- A one-row, read-only table that the daily Netlify keepalive function selects from,
-- so the free-tier project sees real database activity and is not paused.
create table if not exists public.keepalive (
  id int primary key,
  created_at timestamptz not null default now()
);

insert into public.keepalive (id) values (1) on conflict (id) do nothing;

alter table public.keepalive enable row level security;

drop policy if exists "keepalive is publicly readable" on public.keepalive;
create policy "keepalive is publicly readable"
  on public.keepalive for select
  to anon
  using (true);

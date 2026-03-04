-- Watchlist table (guest-only: no user accounts)
-- Run this in Supabase SQL Editor or via Supabase CLI

create table if not exists public.watchlist (
  id uuid primary key default gen_random_uuid(),
  guest_id text not null,
  symbol text not null,
  company text not null,
  added_at timestamptz not null default now()
);

create unique index if not exists watchlist_guest_symbol on public.watchlist (guest_id, symbol);
create index if not exists watchlist_guest_id on public.watchlist (guest_id);

-- Optional: enable RLS and allow all for anonymous (guest) access
alter table public.watchlist enable row level security;

create policy "Allow all for watchlist (guest mode)"
  on public.watchlist
  for all
  using (true)
  with check (true);

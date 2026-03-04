-- Switch watchlist from guest_id to user_id (Supabase Auth)
-- Run this in Supabase SQL Editor after 001_watchlist.sql.
-- Note: Existing guest watchlist rows will be removed (no user to attach them to).

-- Add user_id column
alter table public.watchlist add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- Remove old guest data and column (guest rows cannot be tied to a user)
delete from public.watchlist;
drop index if exists public.watchlist_guest_symbol;
drop index if exists public.watchlist_guest_id;
alter table public.watchlist drop column if exists guest_id;

-- Require user_id
alter table public.watchlist alter column user_id set not null;

-- One symbol per user
create unique index if not exists watchlist_user_symbol on public.watchlist (user_id, symbol);
create index if not exists watchlist_user_id on public.watchlist (user_id);

-- RLS: users can only see/edit their own watchlist
drop policy if exists "Allow all for watchlist (guest mode)" on public.watchlist;
create policy "Users can manage own watchlist"
  on public.watchlist
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

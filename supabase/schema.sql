-- ============================================================
-- PteroControl - Supabase Schema (run in Supabase SQL Editor)
-- ============================================================
-- Jalankan skrip ini sekali di Supabase Dashboard > SQL Editor.
-- Semua table, RLS, enum, dan trigger dibuat di sini.

-- ---------- Types ----------
create type user_role   as enum ('ADMIN', 'USER');
create type user_status as enum ('PENDING', 'APPROVED', 'REJECTED');

-- ============================================================
-- PROFILES
-- id == auth.users.id (UUID dari Supabase Auth)
-- ============================================================
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text unique not null,
  role       user_role   not null default 'USER',
  status     user_status not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- LINKED_PANELS
-- Koneksi panel Pterodactyl milik user (API key terenkripsi)
-- ============================================================
create table if not exists public.linked_panels (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles (id) on delete cascade,
  panel_name        text not null,
  panel_url         text not null,
  encrypted_api_key text not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists idx_linked_panels_user on public.linked_panels (user_id);

-- ---------- RLS ----------
alter table public.profiles      enable row level security;
alter table public.linked_panels enable row level security;

-- Helper: is the requestor an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'ADMIN' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- Profiles policies
drop policy if exists "profiles_select"         on public.profiles;
drop policy if exists "profiles_update_own"     on public.profiles;
drop policy if exists "profiles_update_admin"   on public.profiles;

create policy "profiles_select" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin());

-- Linked panels policies
drop policy if exists "panels_select" on public.linked_panels;
drop policy if exists "panels_insert" on public.linked_panels;
drop policy if exists "panels_update" on public.linked_panels;
drop policy if exists "panels_delete" on public.linked_panels;

create policy "panels_select" on public.linked_panels
  for select using (auth.uid() = user_id or public.is_admin());

create policy "panels_insert" on public.linked_panels
  for insert with check (auth.uid() = user_id);

create policy "panels_update" on public.linked_panels
  for update using (auth.uid() = user_id);

create policy "panels_delete" on public.linked_panels
  for delete using (auth.uid() = user_id);

-- ---------- Trigger: auto-create profile on new auth user ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role, status)
  values (new.id, new.email, 'USER', 'PENDING')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- SERVER_LINKS
-- Server per panel yang user hubungkan (auto-seeded dari dashboard)
-- ============================================================
create table if not exists public.server_links (
  id                uuid primary key default gen_random_uuid(),
  panel_id          uuid not null references public.linked_panels (id) on delete cascade,
  user_id           uuid not null references public.profiles (id) on delete cascade,
  identifier        text not null,       -- Pterodactyl server identifier
  name              text not null,
  state             text not null default 'offline',
  memory_limit      integer,
  cpu_limit         integer,
  disk_limit        integer,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (panel_id, identifier)
);

create index if not exists idx_server_links_panel on public.server_links (panel_id);
create index if not exists idx_server_links_user on public.server_links (user_id);

alter table public.server_links enable row level security;

-- RLS policies for server_links
create policy "server_links_select" on public.server_links
  for select using (auth.uid() = user_id or public.is_admin());
create policy "server_links_insert" on public.server_links
  for insert with check (auth.uid() = user_id);
create policy "server_links_update_own" on public.server_links
  for update using (auth.uid() = user_id);
create policy "server_links_delete_own" on public.server_links
  for delete using (auth.uid() = user_id);

-- Trigger auto-create on insert for realtime sync of linked_panels updates
-- Reuse existing trigger logic above.

-- Optional: realtime for live panel data
do $$
begin
  alter publication supabase_realtime add table public.linked_panels;
exception when undefined_object then null;
end $$;
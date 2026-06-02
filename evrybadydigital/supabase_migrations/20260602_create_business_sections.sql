-- Supabase migration: create business-owned section management tables

create extension if not exists "pgcrypto";

create table business_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null references auth.users(id),
  created_at timestamptz default now()
);

create table sections (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references business_profiles(id) on delete cascade,
  owner_id uuid not null references auth.users(id),
  page_slug text not null,
  section_key text not null,
  title text not null,
  subtitle text,
  content text,
  cta_text text,
  cta_url text,
  metadata jsonb default '{}'::jsonb,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sections_page_slug_position_idx on sections (page_slug, position);

alter table business_profiles enable row level security;
create policy "Business owners can manage their profiles" on business_profiles
  for all using (auth.uid() = owner_id);

alter table sections enable row level security;
-- Allow public reads for sections (site content is public). Owners still required for mutations.
create policy "Public can read sections" on sections
  for select using (true);

create policy "Business owner can manage their own sections" on sections
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- Supabase migration: create projects table for StudioHub dashboard

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  name text not null,
  description text,
  status text not null default 'active' check (status in ('active','paused','completed')),
  client_name text,
  start_date date,
  end_date date,
  budget numeric(12,2),
  tags text[] default '{}',
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_owner_id_idx on projects(owner_id);
create index if not exists projects_status_idx on projects(status);

alter table projects enable row level security;

create policy "Owners can manage their projects" on projects
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

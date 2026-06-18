-- Organizations for multi-tenant projects (org_id on projects)
-- Run in Supabase SQL editor if projects.org_id FK errors occur.

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

create index if not exists organization_members_user_id_idx on organization_members(user_id);

-- Add org_id when projects was created from the owner_id-only migration
alter table projects add column if not exists org_id uuid references organizations(id);
create index if not exists projects_org_id_idx on projects(org_id);

-- Backfill one organization per project owner missing org_id
do $$
declare
  rec record;
  new_org_id uuid;
begin
  for rec in
    select distinct p.owner_id, u.email
    from projects p
    left join auth.users u on u.id = p.owner_id
    where p.org_id is null
  loop
    select om.org_id into new_org_id
    from organization_members om
    where om.user_id = rec.owner_id
    limit 1;

    if new_org_id is null then
      insert into organizations (name, owner_id)
      values (
        coalesce(split_part(rec.email, '@', 1), 'user') || '''s workspace',
        rec.owner_id
      )
      returning id into new_org_id;

      insert into organization_members (org_id, user_id, role)
      values (new_org_id, rec.owner_id, 'owner')
      on conflict do nothing;
    end if;

    update projects
    set org_id = new_org_id
    where owner_id = rec.owner_id and org_id is null;
  end loop;
end $$;

alter table organizations enable row level security;
alter table organization_members enable row level security;

drop policy if exists "Members can view their organizations" on organizations;
create policy "Members can view their organizations" on organizations
  for select using (
    exists (
      select 1 from organization_members om
      where om.org_id = organizations.id and om.user_id = auth.uid()
    )
    or owner_id = auth.uid()
  );

drop policy if exists "Members can view memberships" on organization_members;
create policy "Members can view memberships" on organization_members
  for select using (user_id = auth.uid());

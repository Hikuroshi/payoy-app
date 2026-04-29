create extension if not exists pgcrypto with schema extensions;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'owner' check (role in ('admin', 'owner', 'cashier')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

drop policy if exists "Users can read own data" on public.users;
create policy "Users can read own data"
on public.users
for select
to authenticated
using ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    'owner'
  )
  on conflict (id) do update
  set name = excluded.name,
      updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'admin@payoy.id',
  extensions.crypt('password', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"name":"Admin Payoy"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do update
set email = excluded.email,
    encrypted_password = excluded.encrypted_password,
    email_confirmed_at = excluded.email_confirmed_at,
    raw_app_meta_data = excluded.raw_app_meta_data,
    raw_user_meta_data = excluded.raw_user_meta_data,
    updated_at = now();

insert into auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
)
select
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001',
  '{"sub":"00000000-0000-4000-8000-000000000001","email":"admin@payoy.id","email_verified":true,"phone_verified":false}'::jsonb,
  'email',
  now(),
  now(),
  now()
where not exists (
  select 1
  from auth.identities
  where provider = 'email'
    and provider_id = '00000000-0000-4000-8000-000000000001'
);

insert into public.users (id, name, role)
values (
  '00000000-0000-4000-8000-000000000001',
  'Admin Payoy',
  'admin'
)
on conflict (id) do update
set name = excluded.name,
    role = excluded.role,
    updated_at = now();

create table if not exists public.restaurant_tables (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  number text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, number)
);

create table if not exists public.foods (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists restaurant_tables_owner_id_idx
on public.restaurant_tables (owner_id);

create index if not exists foods_owner_id_idx
on public.foods (owner_id);

create index if not exists foods_owner_available_idx
on public.foods (owner_id, is_available);

alter table public.restaurant_tables enable row level security;
alter table public.foods enable row level security;

drop policy if exists "Tables are readable for menu" on public.restaurant_tables;
create policy "Tables are readable for menu"
on public.restaurant_tables
for select
to anon, authenticated
using (true);

drop policy if exists "Owners can manage own tables" on public.restaurant_tables;
create policy "Owners can manage own tables"
on public.restaurant_tables
for all
to authenticated
using (
  owner_id = (select auth.uid())
  and exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and users.role = 'owner'
  )
)
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and users.role = 'owner'
  )
);

drop policy if exists "Available foods are readable for menu" on public.foods;
create policy "Available foods are readable for menu"
on public.foods
for select
to anon, authenticated
using (is_available);

drop policy if exists "Owners can manage own foods" on public.foods;
create policy "Owners can manage own foods"
on public.foods
for all
to authenticated
using (
  owner_id = (select auth.uid())
  and exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and users.role = 'owner'
  )
)
with check (
  owner_id = (select auth.uid())
  and exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and users.role = 'owner'
  )
);

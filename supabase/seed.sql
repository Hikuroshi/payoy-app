create extension if not exists pgcrypto with schema extensions;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  owner_id uuid references public.users(id) on delete set null,
  role text not null default 'owner' check (role in ('admin', 'owner', 'cashier')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users
add column if not exists owner_id uuid references public.users(id) on delete set null;

alter table public.users enable row level security;

drop policy if exists "Users can read own data" on public.users;
create policy "Users can read own data"
on public.users
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Owners can read own cashiers" on public.users;
create policy "Owners can read own cashiers"
on public.users
for select
to authenticated
using (
  owner_id = (select auth.uid())
  and role = 'cashier'
);

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
    owner_id = null,
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

create table if not exists public.food_categories (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, name)
);

create table if not exists public.foods (
  id uuid primary key default extensions.gen_random_uuid(),
  owner_id uuid not null references public.users(id) on delete cascade,
  category_id uuid references public.food_categories(id) on delete set null,
  name text not null,
  description text,
  image_path text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.foods
add column if not exists image_path text;

alter table public.foods
add column if not exists category_id uuid references public.food_categories(id) on delete set null;

create index if not exists restaurant_tables_owner_id_idx
on public.restaurant_tables (owner_id);

create index if not exists food_categories_owner_id_idx
on public.food_categories (owner_id);

create index if not exists food_categories_owner_name_idx
on public.food_categories (owner_id, name);

create index if not exists foods_owner_id_idx
on public.foods (owner_id);

create index if not exists foods_category_id_idx
on public.foods (category_id);

create index if not exists foods_owner_available_idx
on public.foods (owner_id, is_available);

create index if not exists users_owner_role_idx
on public.users (owner_id, role);

alter table public.restaurant_tables enable row level security;
alter table public.food_categories enable row level security;
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

drop policy if exists "Food categories are readable for menu" on public.food_categories;
create policy "Food categories are readable for menu"
on public.food_categories
for select
to anon, authenticated
using (true);

drop policy if exists "Owners can manage own food categories" on public.food_categories;
create policy "Owners can manage own food categories"
on public.food_categories
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

create table if not exists public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  code text not null unique,
  owner_id uuid not null references public.users(id) on delete cascade,
  table_id uuid not null references public.restaurant_tables(id) on delete cascade,
  table_number text not null,
  payment_method text not null check (payment_method in ('QRIS', 'E-Wallet')),
  status text not null default 'waiting_payment' check (status in ('waiting_payment', 'paid', 'processing', 'done', 'cancelled')),
  subtotal numeric(12, 2) not null default 0 check (subtotal >= 0),
  admin_fee numeric(12, 2) not null default 0 check (admin_fee >= 0),
  tax numeric(12, 2) not null default 0 check (tax >= 0),
  total numeric(12, 2) not null default 0 check (total >= 0),
  paid_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  food_id uuid references public.foods(id) on delete set null,
  food_name text not null,
  note text,
  price numeric(12, 2) not null default 0 check (price >= 0),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_owner_status_created_idx
on public.orders (owner_id, status, created_at desc);

create index if not exists orders_table_id_idx
on public.orders (table_id);

create index if not exists order_items_order_id_idx
on public.order_items (order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Customers can create orders" on public.orders;
create policy "Customers can create orders"
on public.orders
for insert
to anon, authenticated
with check (status in ('waiting_payment', 'paid'));

drop policy if exists "Customers can mark orders paid" on public.orders;
create policy "Customers can mark orders paid"
on public.orders
for update
to anon, authenticated
using (status = 'waiting_payment')
with check (status = 'paid');

drop policy if exists "Staff can read orders" on public.orders;
create policy "Staff can read orders"
on public.orders
for select
to authenticated
using (
  exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and (
        users.role = 'admin'
        or (users.role = 'owner' and orders.owner_id = users.id)
        or (users.role = 'cashier' and orders.owner_id = users.owner_id)
      )
  )
);

drop policy if exists "Staff can update orders" on public.orders;
create policy "Staff can update orders"
on public.orders
for update
to authenticated
using (
  exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and (
        users.role = 'admin'
        or (users.role = 'owner' and orders.owner_id = users.id)
        or (users.role = 'cashier' and orders.owner_id = users.owner_id)
      )
  )
)
with check (
  exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and (
        users.role = 'admin'
        or (users.role = 'owner' and orders.owner_id = users.id)
        or (users.role = 'cashier' and orders.owner_id = users.owner_id)
      )
  )
);

drop policy if exists "Customers can create order items" on public.order_items;
create policy "Customers can create order items"
on public.order_items
for insert
to anon, authenticated
with check (true);

drop policy if exists "Staff can read order items" on public.order_items;
create policy "Staff can read order items"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    join public.users on users.id = (select auth.uid())
    where orders.id = order_items.order_id
      and (
        users.role = 'admin'
        or (users.role = 'owner' and orders.owner_id = users.id)
        or (users.role = 'cashier' and orders.owner_id = users.owner_id)
      )
  )
);

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'menu_image',
  'menu_image',
  true,
  1048576,
  array['image/*']
)
on conflict (id) do update
set public = true,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Menu images are readable" on storage.objects;
create policy "Menu images are readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'menu_image');

drop policy if exists "Owners can upload menu images" on storage.objects;
create policy "Owners can upload menu images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'menu_image'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.users
    where users.id = (select auth.uid())
      and users.role = 'owner'
  )
);

drop policy if exists "Owners can update menu images" on storage.objects;
create policy "Owners can update menu images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'menu_image'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'menu_image'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Owners can delete menu images" on storage.objects;
create policy "Owners can delete menu images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'menu_image'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

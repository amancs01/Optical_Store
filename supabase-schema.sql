create extension if not exists "pgcrypto";

create table if not exists admin_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text,
  role text default 'admin',
  created_at timestamp default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  is_active boolean default true,
  created_at timestamp default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  brand text,
  category text,
  gender text,
  frame_type text,
  shape text,
  material text,
  color text,
  price numeric not null default 0,
  discount_price numeric,
  stock_quantity integer default 0,
  image_url text,
  is_active boolean default true,
  is_featured boolean default false,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  city text,
  delivery_address text not null,
  payment_method text default 'Cash on Delivery',
  payment_status text default 'pending',
  order_status text default 'pending',
  subtotal numeric default 0,
  delivery_fee numeric default 0,
  total_amount numeric default 0,
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null,
  unit_price numeric not null,
  total_price numeric not null,
  selected_color text,
  created_at timestamp default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  branch text,
  booking_date date,
  booking_time text,
  message text,
  status text default 'pending',
  created_at timestamp default now()
);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  message text not null,
  status text default 'new',
  created_at timestamp default now()
);

alter table admin_profiles enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table bookings enable row level security;
alter table contact_messages enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_profiles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Public can read active categories" on categories;
create policy "Public can read active categories" on categories for select using (is_active = true);

drop policy if exists "Public can read active products" on products;
create policy "Public can read active products" on products for select using (is_active = true);

drop policy if exists "Public can create orders" on orders;
create policy "Public can create orders" on orders for insert with check (true);

drop policy if exists "Public can create order items" on order_items;
create policy "Public can create order items" on order_items for insert with check (true);

drop policy if exists "Public can track orders" on orders;
create policy "Public can track orders" on orders for select using (true);

drop policy if exists "Public can read order items for tracking" on order_items;
create policy "Public can read order items for tracking" on order_items for select using (true);

drop policy if exists "Public can create bookings" on bookings;
create policy "Public can create bookings" on bookings for insert with check (true);

drop policy if exists "Public can create contact messages" on contact_messages;
create policy "Public can create contact messages" on contact_messages for insert with check (true);

drop policy if exists "Admins can read admin profiles" on admin_profiles;
create policy "Admins can read admin profiles" on admin_profiles for select using (is_admin());

drop policy if exists "Admins can manage categories" on categories;
create policy "Admins can manage categories" on categories for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins can manage products" on products;
create policy "Admins can manage products" on products for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins can manage orders" on orders;
create policy "Admins can manage orders" on orders for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins can manage order items" on order_items;
create policy "Admins can manage order items" on order_items for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins can manage bookings" on bookings;
create policy "Admins can manage bookings" on bookings for all using (is_admin()) with check (is_admin());

drop policy if exists "Admins can manage messages" on contact_messages;
create policy "Admins can manage messages" on contact_messages for all using (is_admin()) with check (is_admin());

insert into categories (name, slug, image_url) values
  ('Eyeglasses', 'eyeglasses', null),
  ('Sunglasses', 'sunglasses', null),
  ('Contact Lenses', 'contact-lenses', null),
  ('Kids Frames', 'kids-frames', null)
on conflict (slug) do nothing;

insert into products (name, slug, description, brand, category, gender, frame_type, shape, material, color, price, discount_price, stock_quantity, image_url, is_active, is_featured) values
  ('Aarav Classic Black Frame', 'aarav-classic-black-frame', 'Lightweight daily eyeglasses with a polished black finish and comfortable nose bridge.', 'ClearView', 'Eyeglasses', 'Unisex', 'Full Rim', 'Rectangle', 'Acetate', 'Black', 3200, 2800, 18, 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=900&q=80', true, true),
  ('Himalaya Brown Round Frame', 'himalaya-brown-round-frame', 'Rounded acetate frame with a warm brown tone for soft everyday styling.', 'Vista Nepal', 'Eyeglasses', 'Women', 'Full Rim', 'Round', 'Acetate', 'Brown', 3600, null, 12, 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=900&q=80', true, true),
  ('Urban UV Aviator Sunglasses', 'urban-uv-aviator-sunglasses', 'UV-protected aviator sunglasses with a durable metal frame.', 'SunPeak', 'Sunglasses', 'Men', 'Aviator', 'Aviator', 'Metal', 'Gold', 4200, 3600, 10, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80', true, true),
  ('Lalitpur Blue Light Screen Glasses', 'lalitpur-blue-light-screen-glasses', 'Blue light friendly frame for long screen sessions at work or study.', 'ClearView', 'Eyeglasses', 'Unisex', 'Full Rim', 'Square', 'TR90', 'Matte Navy', 2800, 2400, 22, 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=900&q=80', true, true),
  ('Kids Flexi Red Frame', 'kids-flexi-red-frame', 'Flexible kids frame designed for comfort, safety, and daily school use.', 'TinySight', 'Kids Frames', 'Kids', 'Full Rim', 'Rectangle', 'TR90', 'Red', 2600, null, 15, 'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=900&q=80', true, false),
  ('Daily Comfort Contact Lens', 'daily-comfort-contact-lens', 'Soft daily contact lenses with a comfortable finish for routine use.', 'LensCare', 'Contact Lenses', 'Unisex', 'Rimless', 'Lens', 'Hydrogel', 'Clear', 1800, 1600, 30, 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=900&q=80', true, false)
on conflict (slug) do nothing;

-- Storage note:
-- Create a public Supabase Storage bucket named product-images for admin product uploads.
-- In Storage policies, allow authenticated admins to upload/update/delete, and allow public read access.

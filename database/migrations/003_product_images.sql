create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  image_url text not null,
  alt_text text,
  sort_order integer default 0,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create index if not exists product_images_product_id_idx
on public.product_images (product_id);

create index if not exists product_images_product_id_sort_order_idx
on public.product_images (product_id, sort_order);

alter table public.product_images enable row level security;

drop policy if exists "Public can read active product images" on public.product_images;
create policy "Public can read active product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_active = true
  )
);

drop policy if exists "Admins can manage product images" on public.product_images;
create policy "Admins can manage product images"
on public.product_images
for all
using (public.is_admin())
with check (public.is_admin());

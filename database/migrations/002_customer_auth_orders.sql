alter table public.orders
add column if not exists user_id uuid references auth.users(id);

drop policy if exists "Public can track orders" on public.orders;
drop policy if exists "Public can read order items for tracking" on public.order_items;

drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders"
on public.orders
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Customers can read own order items" on public.order_items;
create policy "Customers can read own order items"
on public.order_items
for select
using (
  public.is_admin()
  or exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
    and orders.user_id = auth.uid()
  )
);

-- Existing public insert policies for guest checkout should remain in place.
-- Existing admin management policies should remain in place.

create or replace function public.track_order(search_query text)
returns setof public.orders
language sql
security definer
set search_path = public
as $$
  select *
  from public.orders
  where order_number = search_query
     or customer_phone = search_query
  order by created_at desc
  limit 1;
$$;

grant execute on function public.track_order(text) to anon, authenticated;

-- Guest order tracking now uses the track_order RPC instead of a broad public select policy.

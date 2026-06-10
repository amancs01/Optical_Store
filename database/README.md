# Database Migrations

Run the SQL files in `database/migrations` in order from the Supabase SQL Editor:

1. `001_initial_schema.sql`
2. `002_customer_auth_orders.sql`
3. `003_product_images.sql`

`database/migrations` is the source of truth for future Supabase copy-paste setup. No duplicate root SQL setup files are required.

Guidelines:

- Review SQL before running it in production.
- Back up production data before applying structural changes.
- Do not run destructive SQL such as `drop table` without an explicit backup and rollback plan.
- The current migrations use non-destructive patterns where practical, including `create table if not exists`, `add column if not exists`, and policy replacement by name.
- Supabase CLI migration automation can be added later if the project needs automated environment promotion.

Product images:

- `products.image_url` remains the main storefront thumbnail used by product cards and existing products.
- `product_images` stores optional product detail gallery images ordered by `sort_order`.
- Run migrations in order so `product_images` can reference the existing `products` table and reuse the existing `is_admin()` RLS helper.

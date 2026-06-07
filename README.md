# Titan Opticals

Premium eyewear ecommerce site for Titan Opticals in Kichapokhari, New Road, Kathmandu. The app supports product browsing, cart, Cash on Delivery checkout, order tracking, eye-checkup bookings, contact messages, customer accounts, My Orders, and a protected admin dashboard.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Vercel

## Folder Structure

- `app/`: App Router pages and layouts.
- `components/layout/`: Customer shell, navbar, footer, WhatsApp, bottom nav.
- `components/admin/`: Admin guard/layout/product form UI.
- `components/product/`: Product card and add-to-cart UI.
- `components/cart/`: Cart provider and cart state.
- `components/providers/`: Shared app providers such as `AuthProvider`.
- `components/ui/`: Reusable UI primitives and skeletons.
- `services/`: Supabase data access and mutations.
- `lib/supabase/`: Supabase browser client setup.
- `lib/`: Constants, SEO, auth compatibility exports, formatting utilities.
- `types/`: Shared TypeScript models.
- `database/migrations/`: Ordered SQL setup/migration files for Supabase.

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Never add a Supabase service role key to frontend code or public environment variables.

## Supabase Setup

Run migrations manually in the Supabase SQL Editor:

1. `database/migrations/001_initial_schema.sql`
2. `database/migrations/002_customer_auth_orders.sql`

The root SQL files are kept for compatibility, but `database/migrations` is the organized source for setup. Create a public Storage bucket named `product-images` and configure policies for public reads plus authenticated admin uploads/updates/deletes.

## Auth And Admin

Customer auth uses Supabase Auth with the public anon key. Shared auth/admin state lives in `components/providers/AuthProvider.tsx`.

Admin access is determined by `public.admin_profiles` with `role = 'admin'`. Admin routes are protected by `components/admin/AdminGuard.tsx`; logged-out users are redirected to login and non-admin users are redirected away from `/admin`.

To create an admin:

```sql
insert into admin_profiles (user_id, email, role)
values ('AUTH_USER_UUID', 'admin@example.com', 'admin');
```

## Data Access

Supabase queries should live in service files:

- `services/productService.ts`
- `services/orderService.ts`
- `services/authService.ts`
- `services/adminService.ts`
- `services/bookingService.ts`
- `services/contactService.ts`
- `services/uploadService.ts`

UI components should receive props or call service functions; shared components such as `ProductCard` should not fetch their own data.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before deploy or handoff:

```bash
npm run lint
npm run build
```

## Deploy On Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the public environment variables.
4. Run Supabase migrations and add products/admin users.
5. Deploy.

## Route Checklist

Customer routes include `/`, `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/track-order`, `/book-eye-checkup`, `/contact`, `/account`, `/account/orders`, policy pages, login, and register.

Admin routes include `/admin/login`, `/admin`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, `/admin/orders`, `/admin/bookings`, `/admin/messages`, and `/admin/logout`.

## Performance Notes

See `PERFORMANCE_NOTES.md` for the API-call audit, optimizations made, remaining limitations, and future scaling suggestions.

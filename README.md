# Titan Opticals

Premium eyewear e-commerce website for Titan Opticals, located at Kichapokhari, New Road, opposite NMB Bank. The app includes polished customer shopping pages, localStorage cart, Cash on Delivery checkout, order tracking, eye-checkup booking, contact messages, customer accounts, and a protected Supabase-powered admin dashboard.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, and Storage
- Vercel

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Do not add a Supabase service role key to the frontend.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase-schema.sql`.
3. For existing projects that already ran the original schema, run `customer-auth-orders.sql` to add optional customer account order history support.
4. Create a public Storage bucket named `product-images`.
5. Add Storage policies for public read and authenticated admin upload/update/delete.
6. Create an admin Auth user with email/password.
7. Add that user to `admin_profiles`:

```sql
insert into admin_profiles (user_id, email)
values ('AUTH_USER_UUID', 'admin@example.com');
```

The app uses the public anon key only. Row Level Security policies in `supabase-schema.sql` allow public product browsing, public order/booking/message creation, and admin-only management through `admin_profiles`.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before handing the project to a client or deploying, run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

All three commands should pass.

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository in Vercel.
3. Add the three public environment variables.
4. Confirm the Supabase schema has been run and sample products exist.
5. Deploy.

The project is Vercel-deployable as a standard Next.js App Router application. No service role key or localhost-only setting is required.

## Admin Access

Admin routes require a signed-in Supabase Auth user. Unauthenticated visitors are redirected to `/admin/login`. The admin login route is intentionally hidden from public navigation and footer links, but remains directly accessible to staff.

To create an admin:

1. Create a user in Supabase Auth.
2. Copy the user's UUID.
3. Insert it into `admin_profiles` using the SQL example above.
4. Sign in at `/admin/login`.

## Route Checklist

Customer routes:

- `/`
- `/products`
- `/products/[slug]`
- `/cart`
- `/checkout`
- `/track-order`
- `/book-eye-checkup`
- `/contact`
- `/about`
- `/shipping-policy`
- `/return-policy`
- `/privacy-policy`
- `/terms`

Admin routes:

- `/admin/login`
- `/admin`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/orders`
- `/admin/bookings`
- `/admin/messages`
- `/admin/logout`

## Included Features

- Premium home page with hero, trust badges, categories, featured products, checkup CTA, delivery support, and store visit CTA
- Product listing with search, filters, sorting, skeleton loading, and branded empty state
- Product detail pages with breadcrumb, premium image/fallback treatment, availability, trust notes, WhatsApp help, and similar products
- localStorage cart
- Mobile-friendly cart quantity controls and immediate cart count updates
- Cash on Delivery checkout with validation, order confirmation details, and order item summary
- Order tracking by order number or phone
- Eye-checkup booking form with date and time-slot validation
- Contact page, Google Maps link, social links, and message form
- Static policy pages
- Supabase Auth admin login/logout
- Optional customer login/register and My Orders pages
- Floating WhatsApp support button on customer-facing pages
- Improved SEO metadata, sitemap, and robots configuration
- Admin dashboard metrics
- Admin product add/edit/delete with confirmation, safer slug handling, and Storage image upload
- Admin order detail visibility, booking management, and message management

WhatsApp is the primary customer support channel for launch. The Gmail address in configuration is the client-provided business email; a professional domain email is recommended after domain purchase.

## Phase 2

- See `PHASE_2_FEATURES.md` for deferred upgrades such as online payments, automation, reviews, wishlist, product galleries, professional email, coupons, invoices, advanced inventory, SEO content, analytics, and server-side pagination.

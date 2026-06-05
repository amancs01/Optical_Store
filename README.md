# Titan Opticals

Market-ready MVP eyewear e-commerce website for Titan Opticals, located at Kichapokhari, New Road, opposite NMB Bank. The app includes customer shopping pages, localStorage cart, Cash on Delivery checkout, order tracking, eye-checkup booking, contact messages, and a protected Supabase-powered admin dashboard.

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

Admin routes require a signed-in Supabase Auth user. Unauthenticated visitors are redirected to `/admin/login`.

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

- Home page with hero, categories, featured products, checkup CTA, and trust section
- Product listing with search and filters
- Product detail pages with similar products
- localStorage cart
- Cash on Delivery checkout that creates orders and order items
- Order tracking by order number or phone
- Eye-checkup booking form
- Contact page and message form
- Static policy pages
- Supabase Auth admin login/logout
- Optional customer login/register and My Orders pages
- Admin dashboard metrics
- Admin product add/edit/delete with Storage image upload
- Admin order, booking, and message management

## Phase 2

- Online payments
- SMS or WhatsApp automation
- Coupon system
- Customer reviews
- Prescription upload workflow
- Advanced inventory reporting

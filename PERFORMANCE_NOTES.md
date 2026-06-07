# Performance Notes

## Redundant Calls Found

- `Navbar`, account pages, admin guard, and admin pages all depended on user/admin status. Previously each `useCurrentUser()` call could trigger its own `supabase.auth.getUser()` and `admin_profiles` lookup.
- Customer order pages called `supabase.auth.getUser()` directly before loading customer orders.
- Admin dashboard fetched full products, orders, bookings, and messages just to calculate counts.
- Product cards were prop-only and did not fetch data, which is the correct architecture.
- Product listing already fetched active products once and filtered client-side; this remains the right approach for the current small catalog.

## Optimized

- Added `components/providers/AuthProvider.tsx` as a single shared client auth/admin state source.
- Moved auth helpers into `services/authService.ts`.
- Moved admin role/profile helpers and dashboard stats into `services/adminService.ts`.
- Updated navbar, account pages, admin guard, and admin shell to use shared auth/admin state instead of independent role checks.
- Updated customer order pages to use the shared authenticated user and fetch only their own order data.
- Replaced admin dashboard full-table fetches with Supabase count queries using `select("id", { count: "exact", head: true })`.
- Split contact-message data access into `services/contactService.ts`; booking data remains in `services/bookingService.ts`.
- Shop filters and sorting use memoized client-side derived lists after one product fetch.

## Service Ownership

- `services/productService.ts`: product listing, detail, similar products, admin product CRUD.
- `services/orderService.ts`: checkout order creation, tracking, customer orders, admin orders, order status updates.
- `services/authService.ts`: current user, sign in, sign up, sign out.
- `services/adminService.ts`: admin profile checks, admin guard helpers, dashboard count stats.
- `services/bookingService.ts`: booking creation and admin booking management.
- `services/contactService.ts`: contact message creation and admin message management.
- `services/uploadService.ts`: Supabase Storage upload/public URL helpers.

## Known Remaining Limitations

- Admin list pages still fetch full rows because they display full row data. That is appropriate until data volume grows.
- Product listing filters client-side. This is fast for a small catalog, but should become server-side pagination/search when product count grows substantially.
- Auth role state is client-side because this project currently uses the browser Supabase client. Middleware/server auth can be added later if stronger server-side route enforcement is required.
- React Strict Mode can show duplicate effects in development. Use production build or network request timing carefully before treating duplicate dev calls as real production duplication.

## How To Test Network Calls

1. Run `npm run dev`.
2. Open browser DevTools.
3. Go to the Network tab and filter for Supabase requests.
4. Visit `/`, `/products`, `/account`, and `/admin`.
5. Confirm product list fetches once per page load and filters do not refetch on every keystroke.
6. Confirm admin dashboard uses count requests instead of downloading all dashboard table rows.

## Future Suggestions

- Add Supabase RPC such as `get_admin_dashboard_stats()` if dashboard counts need to become one database round trip.
- Add server-side pagination for `/products` once catalog size grows.
- Consider React Query or SWR only if cross-page cache invalidation becomes difficult.
- Add Supabase CLI migrations for automated deploy workflows.

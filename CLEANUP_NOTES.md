# Cleanup Notes

## Files Removed

- Removed unused Next starter SVG assets:
  - `public/next.svg`
  - `public/vercel.svg`
  - `public/file.svg`
  - `public/globe.svg`
  - `public/window.svg`
- Removed unreferenced generated images:
  - `public/images/01_hero_luxury_store_models.png`
  - `public/images/hero-eyewear-showroom.png`
  - `public/images/cta-eye-consultation.png`
- Removed unused duplicate auth type file:
  - `types/user.ts`

## Duplicate Code Consolidated

- Consolidated product availability label/class logic into `lib/utils.ts`:
  - `getAvailabilityStatus`
  - `getAvailabilityDetailStatus`
- Removed local duplicate availability helpers from `ProductCard` and product detail page.
- Removed unused product service helper exports that were not imported anywhere:
  - `ProductFilterInput`
  - `getProductsByFilters`
  - `getProductCategories`
- Removed unused product types:
  - `ProductFormInput`
  - `Category`

## Intentionally Kept

- Root SQL files remain:
  - `supabase-schema.sql`
  - `customer-auth-orders.sql`

  They duplicate the organized files under `database/migrations`, but are kept for backward compatibility and existing handoff references. `database/migrations` is the preferred location going forward.

- `app/contact/layout.tsx` and `app/products/layout.tsx` are kept because they provide route metadata.
- `PHASE_2_FEATURES.md` and `CLAUDE.md` are kept because they may be project handoff/context files even though the app does not import them.
- All remaining files in `public/images` are referenced by app code and were kept.

## Remaining Suggestions

- If the project grows, consider splitting `types/order.ts` into `types/order.ts`, `types/booking.ts`, and `types/contact.ts`.
- Keep future generated marketing images out of `public/images` until they are actually referenced by app code.
- When adding shared helpers, wait until they are used by at least one caller or document why they are intentionally public API.

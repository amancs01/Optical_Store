import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms",
  description:
    "Read the terms for using the Titan Optical website to browse products, place orders, book eye checkups, and contact the store.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Terms</h1>
      <div className="mt-6 space-y-5 leading-8 text-slate-600">
        <p>
          By using the Titan Optical website, customers agree to use the site for browsing products, placing genuine
          orders, booking eye checkups, and contacting the store.
        </p>
        <p>
          Product availability, prices, colors, offers, and stock may change without prior notice. We do our best to keep
          website information accurate, but final order confirmation may depend on store stock and staff verification.
        </p>
        <p>
          Orders may be confirmed by phone or WhatsApp before dispatch. Customers are responsible for entering a correct
          phone number, delivery address, city, and order details. Delivery can be delayed if the address is incomplete or
          the customer cannot be reached.
        </p>
        <p>
          Delivery is currently available within Nepal. Delivery is free inside Kathmandu Valley. Outside Kathmandu
          Valley, delivery is NPR 120 for orders below NPR 2,500 and free for orders of NPR 2,500 or more.
        </p>
        <p>
          Returns, exchanges, and refunds are handled according to our Return Policy. Prescription lens and hygiene-related
          items may have additional limits because they are prepared or handled specifically for the customer.
        </p>
        <p>
          For questions about orders, product availability, policies, or store service, contact Titan Optical at{" "}
          <a className="font-semibold text-emerald-700" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> or{" "}
          <a className="font-semibold text-emerald-700" href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phoneDisplay}</a>.
        </p>
      </div>
    </main>
  );
}

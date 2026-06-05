import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Shipping Policy",
  description:
    "Read Titan Opticals shipping details for Kathmandu Valley delivery, courier delivery across Nepal, and prescription lens order timing.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Shipping Policy</h1>
      <div className="mt-6 space-y-6 leading-8 text-slate-600">
        <p>
          Titan Opticals provides free delivery inside Kathmandu Valley, covering Kathmandu, Lalitpur, and Bhaktapur.
          Orders received before 4:00 PM are prepared for same-day dispatch whenever stock and delivery timing allow.
          Orders placed later in the day may be dispatched on the following day.
        </p>
        <p>
          For addresses outside Kathmandu Valley, we deliver across Nepal through courier partners. Delivery time is
          usually 2 to 5 business days, depending on the destination and courier route. Any delivery charge may be shown
          at checkout or confirmed by our team before dispatch.
        </p>
        <p>
          Prescription lens orders can take an additional 1 to 3 business days because lenses need to be prepared,
          checked, and fitted correctly before shipping.
        </p>
        <p>
          Customers can track their purchase using the order number provided after checkout. Eyewear products are packed
          carefully, and protective cases are used whenever appropriate to reduce the chance of damage during handling.
        </p>
        <p>
          Courier partners may attempt delivery more than once. If delivery cannot be completed because of an incorrect
          address, unavailable customer, or unreachable phone number, Titan Opticals may contact the customer to arrange
          redelivery or receive further instructions.
        </p>
        <p>
          We currently ship only within Nepal. For special delivery questions, contact us at{" "}
          <a className="font-semibold text-emerald-700" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> or{" "}
          <a className="font-semibold text-emerald-700" href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phoneDisplay}</a>.
        </p>
      </div>
    </main>
  );
}

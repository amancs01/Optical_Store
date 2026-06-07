import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Return Policy",
  description:
    "Review Titan Optical return, exchange, and refund guidance for eyewear, frames, lenses, and delivered orders.",
  path: "/return-policy",
});

export default function ReturnPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Return Policy</h1>
      <div className="mt-6 space-y-6 leading-8 text-slate-600">
        <p>
          Titan Optical accepts eligible return requests within 7 days from the delivery date. Items must be unused,
          clean, and returned in the condition in which they were received.
        </p>
        <section>
          <h2 className="text-xl font-bold text-slate-950">Items eligible for return</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Unused frames in original condition.</li>
            <li>Original packaging and accessories, including case, cloth, and booklet where provided.</li>
            <li>Unopened contact lens boxes returned within 7 days.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-bold text-slate-950">Items not eligible for return</h2>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>Frames that have already been fitted with custom prescription lenses.</li>
            <li>Opened contact lens packs for hygiene and safety reasons.</li>
            <li>Products damaged after use or mishandling.</li>
            <li>Final sale or clearance items.</li>
          </ul>
        </section>
        <p>
          To request a return, contact Titan Optical by WhatsApp or email within 7 days. Please share your order number
          and the reason for return. Our team will confirm whether the item should be picked up or dropped off at the
          store. The product should be packed with all original accessories.
        </p>
        <p>
          After inspection, an approved refund or exchange is usually processed within about 5 business days. Refunds are
          made through the original payment method when possible. Cash on Delivery orders may be refunded through bank
          transfer or a digital wallet such as Khalti or eSewa after the customer provides the needed details.
        </p>
        <p>
          If an item arrives damaged or defective, contact us within 48 hours and include clear photos. After checking
          the issue, Titan Optical may arrange a replacement, exchange, or another suitable solution.
        </p>
        <p>
          Return support: <a className="font-semibold text-emerald-700" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>{" "}
          or <a className="font-semibold text-emerald-700" href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}>WhatsApp {SITE_CONFIG.whatsapp}</a>.
        </p>
      </div>
    </main>
  );
}

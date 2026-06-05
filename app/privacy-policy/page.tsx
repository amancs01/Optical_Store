import { SITE_CONFIG } from "@/lib/constants";

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">Privacy Policy</h1>
      <div className="mt-6 space-y-5 leading-8 text-slate-600">
        <p>
          Titan Opticals collects only the information needed to serve customers properly. This may include name, phone
          number, email address, delivery address, order details, eye checkup booking details, and prescription details if
          a customer chooses to provide them.
        </p>
        <p>
          We use this information to process orders, arrange delivery, respond to customer questions, manage eye checkup
          requests, and share order updates. We do not sell customer information to third parties.
        </p>
        <p>
          Payment-related information is handled only as needed for order confirmation and refund support. Titan Opticals
          does not ask for or store sensitive wallet, card, or banking passwords.
        </p>
        <p>
          Customer information may be stored in the website system used for orders, bookings, and messages. Access should
          be limited to authorized store staff who need the information to complete customer service tasks.
        </p>
        <p>
          For privacy questions or correction requests, contact us at{" "}
          <a className="font-semibold text-teal-700" href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a> or{" "}
          <a className="font-semibold text-teal-700" href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phoneDisplay}</a>.
        </p>
      </div>
    </main>
  );
}

import { SITE_CONFIG } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn about Titan Opticals, a New Road optical store offering eyewear, sunglasses, lenses, and eye-care support in Kathmandu.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm font-bold uppercase text-teal-700">About us</p>
      <h1 className="mt-2 animate-fade-up text-4xl font-black">{SITE_CONFIG.name}</h1>
      <div className="mt-6 space-y-5 leading-8 text-slate-600">
        <p>
          Titan Opticals is an optical store located at {SITE_CONFIG.address}. The store serves customers looking for
          dependable eyewear, sunglasses, contact lenses, and eye-care related services in the New Road area.
        </p>
        <p>
          Our focus is simple: help customers find quality frames, practical lens options, UV-protected sunglasses, and
          affordable choices that match everyday needs. The website also makes it easier to browse products, place an
          order, and request an eye checkup without needing to visit first.
        </p>
        <p>
          Visit the store between {SITE_CONFIG.openingHours}, call {SITE_CONFIG.phoneDisplay}, or message us on WhatsApp
          at {SITE_CONFIG.whatsapp} for product availability, delivery support, or appointment help.
        </p>
      </div>
    </main>
  );
}

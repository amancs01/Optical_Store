import Image from "next/image";
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
    <main className="bg-[#fffaf2]">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[0.9fr_1.1fr] md:items-center lg:px-8">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">About us</p>
          <h1 className="mt-2 animate-fade-up text-4xl font-black text-slate-950">{SITE_CONFIG.name}</h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
            A polished New Road optical store for premium frames, sunglasses, contact lenses, and practical eye-care support.
          </p>
          <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 bg-[#fffaf2]/60 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Location</p>
              <p className="mt-2 font-semibold">{SITE_CONFIG.address}</p>
            </div>
            <div className="rounded-md border border-slate-200 bg-[#fffaf2]/60 p-4 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Store hours</p>
              <p className="mt-2 font-semibold">{SITE_CONFIG.openingHours}</p>
            </div>
          </div>
        </div>
        <div className="relative min-h-[240px] overflow-hidden rounded-md border border-slate-200 bg-[#fffaf2]/60 shadow-sm sm:min-h-[360px]">
          <Image
            src="/images/02_store_interior_luxury_eyewear.png"
            alt="Luxury eyewear store interior at Titan Opticals in New Road"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 54vw"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            ["Eyewear", "Quality frames and lens-ready styles for everyday use."],
            ["Sunglasses", "UV-protected options for bright Kathmandu days."],
            ["Eye care", "Checkup booking, contact lens guidance, and appointment help."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-md border border-slate-200 bg-[#fffaf2]/60 p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

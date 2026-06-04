import { ArrowRight, CalendarCheck, ShieldCheck, Truck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getFeaturedProducts } from "@/services/productService";
import type { Product } from "@/types/product";

export default async function HomePage() {
  let products: Product[] = [];

  if (isSupabaseConfigured) {
    try {
      products = await getFeaturedProducts();
    } catch {
      products = [];
    }
  }

  return (
    <div className="bg-white">
      <section className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase text-teal-700">{SITE_CONFIG.location}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            Clearer vision, sharper style.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Shop quality eyeglasses, sunglasses, lenses, and book a professional eye checkup from a trusted Kathmandu optical store.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/products">
              Shop eyewear <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/book-eye-checkup" variant="secondary">
              Book eye checkup
            </LinkButton>
          </div>
        </div>
        <div className="overflow-hidden rounded-md bg-slate-100 shadow-sm">
          <div className="aspect-[4/3] bg-[linear-gradient(135deg,#e0f2fe,#f8fafc_45%,#ccfbf1)] p-8">
            <div className="grid h-full place-items-center rounded-md border border-white/80 bg-white/60 text-center">
              <div>
                <p className="text-sm font-bold uppercase text-slate-500">Premium optical care</p>
                <p className="mt-3 text-5xl font-black text-slate-950">Frames, lenses, checkups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Eyeglasses", "Daily frames for work, study, and screen time."],
            ["Sunglasses", "UV protection with polished everyday style."],
            ["Contact Lenses", "Comfortable lens options with store guidance."],
          ].map(([title, text]) => (
            <a key={title} href={`/products?category=${encodeURIComponent(title)}`} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-400">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-slate-600">{text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">Featured</p>
            <h2 className="mt-2 text-3xl font-black">Best picks from the store</h2>
          </div>
          <LinkButton href="/products" variant="secondary">View all</LinkButton>
        </div>
        {products.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            Add sample products in Supabase to show featured eyewear here.
          </div>
        )}
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
          <div>
            <h2 className="text-3xl font-black">Need an eye checkup?</h2>
            <p className="mt-3 max-w-2xl text-slate-300">Book a convenient appointment and get frame recommendations after your checkup.</p>
          </div>
          <LinkButton href="/book-eye-checkup" variant="secondary">
            <CalendarCheck className="h-4 w-4" /> Book now
          </LinkButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          [ShieldCheck, "Trusted optical guidance", "Frame and lens support from store staff."],
          [Truck, "Local delivery", "Cash on Delivery available for Kathmandu orders."],
          [CalendarCheck, "Easy appointments", "Book eye checkups without phone back-and-forth."],
        ].map(([Icon, title, text]) => (
          <div key={String(title)} className="rounded-md border border-slate-200 bg-white p-5">
            <Icon className="h-6 w-6 text-teal-700" />
            <h3 className="mt-4 font-bold">{String(title)}</h3>
            <p className="mt-2 text-sm text-slate-600">{String(text)}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

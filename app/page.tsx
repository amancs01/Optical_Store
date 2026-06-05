import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Eye, Glasses, ShieldCheck, Sun, Truck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getFeaturedProducts } from "@/services/productService";
import { formatCurrency, getSalePrice } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import type { Product } from "@/types/product";

const categories = [
  {
    title: "Eyeglasses",
    text: "Quality frames for daily use, screen time, and prescription needs.",
    icon: Glasses,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-100",
  },
  {
    title: "Sunglasses",
    text: "UV-protection styles selected for bright Kathmandu days.",
    icon: Sun,
    color: "bg-amber-50 text-amber-800 border-amber-200",
    iconBg: "bg-amber-100",
  },
  {
    title: "Contact Lenses",
    text: "Comfortable lens options with practical store guidance.",
    icon: Eye,
    color: "bg-sky-50 text-sky-800 border-sky-200",
    iconBg: "bg-sky-100",
  },
];

export const metadata = pageMetadata({
  title: "Premium Eyewear in New Road, Kathmandu",
  description:
    "Shop eyeglasses, sunglasses, contact lenses, and book eye checkups at Titan Opticals in Kichapokhari, New Road.",
  path: "/",
});

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
        <div className="animate-fade-up">
          <p className="text-sm font-bold uppercase text-teal-700">{SITE_CONFIG.location}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl font-black leading-tight text-slate-950 sm:text-6xl">
            Premium eyewear in New Road, Kathmandu.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            {SITE_CONFIG.name} offers eyeglasses, sunglasses, contact lenses, and eye checkup booking from Kichapokhari, New Road. Order online with Cash on Delivery and free delivery inside Kathmandu Valley.
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
        <HeroVisual products={products} />
      </section>

      <section className="animate-fade-up-delay-1 border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {categories.map((cat) => (
            <a
              key={cat.title}
              href={`/products?category=${encodeURIComponent(cat.title)}`}
              className={`rounded-md border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cat.color}`}
            >
              <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full ${cat.iconBg}`}>
                <cat.icon className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold">{cat.title}</h2>
              <p className="mt-2 text-sm opacity-80">{cat.text}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="animate-fade-up-delay-2 mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-teal-700">Featured</p>
            <h2 className="mt-2 text-3xl font-black">Featured picks from Titan Opticals</h2>
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
            <p className="mt-3 max-w-2xl text-slate-300">Book a convenient eye checkup and get help choosing lenses and frames that fit your needs.</p>
          </div>
          <LinkButton href="/book-eye-checkup" variant="secondary">
            <CalendarCheck className="h-4 w-4" /> Book now
          </LinkButton>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          [ShieldCheck, "Quality frames and UV protection", "Choose from polished eyewear options with support from store staff."],
          [Truck, "Free Valley delivery", "Free delivery inside Kathmandu Valley with Cash on Delivery order placement."],
          [CalendarCheck, "Eye checkup booking", "Request an appointment online and let the team contact you."],
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

function HeroVisual({ products }: { products: Product[] }) {
  const heroProducts = products.slice(0, 3);

  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-md border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5,#ffffff_48%,#e0f2fe)] p-4 shadow-sm sm:p-6">
      <div className="absolute right-6 top-6 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase text-emerald-800 shadow-sm">
        {SITE_CONFIG.name}
      </div>
      <div className="grid h-full content-end gap-4 pt-14">
        {heroProducts.length ? (
          <div className="grid gap-4 sm:grid-cols-3">
            {heroProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={`group overflow-hidden rounded-md border border-white/80 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md ${index === 1 ? "sm:-mt-8" : ""}`}
              >
                <div className="relative aspect-[4/5] bg-emerald-50">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 33vw, 220px" />
                  ) : (
                    <div className="grid h-full place-items-center bg-[linear-gradient(145deg,#064e3b,#059669)] text-white">
                      <Glasses className="h-12 w-12" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="line-clamp-1 text-sm font-bold text-slate-950">{product.name}</p>
                  <p className="mt-1 text-xs font-semibold text-emerald-700">{formatCurrency(getSalePrice(product))}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid min-h-[300px] place-items-center rounded-md border border-white/80 bg-[linear-gradient(145deg,#064e3b,#065f46_40%,#059669)] p-8 text-center text-white shadow-sm">
            <div>
              <Glasses className="mx-auto h-24 w-24" aria-hidden="true" />
              <p className="mt-6 text-sm font-bold uppercase tracking-wide text-emerald-100">{SITE_CONFIG.name}</p>
              <p className="mt-2 font-serif text-3xl font-black">Premium eyewear for New Road, Kathmandu.</p>
            </div>
          </div>
        )}
        <div className="rounded-md bg-slate-950/90 p-4 text-white">
          <p className="text-sm font-semibold text-emerald-100">Kichapokhari, opposite NMB Bank</p>
          <p className="mt-1 text-2xl font-black">Try refined frames with practical eye-care guidance.</p>
        </div>
      </div>
    </div>
  );
}

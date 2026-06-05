import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Eye, Glasses, MessageCircle, Search, ShieldCheck, Sparkles, Square, Sun, Truck } from "lucide-react";
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
    <div className="bg-[#fffaf2]">
      <section className="mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 lg:grid lg:min-h-[72vh] lg:grid-cols-[1fr_0.95fr] lg:items-center lg:gap-10 lg:px-8 lg:py-12">
        <div className="animate-fade-up">
          <p className="text-xs font-black uppercase tracking-wide text-teal-700">New Road, Kathmandu</p>
          <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            See clearly. Look refined.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Premium eyeglasses, sunglasses, contact lenses, and eye checkup booking from Kichapokhari, opposite NMB Bank.
          </p>
          <div className="mt-5 flex gap-3">
            <LinkButton href="/products" className="flex-1 sm:flex-none">
              Shop eyewear <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/book-eye-checkup" variant="secondary" className="flex-1 sm:flex-none">
              Book checkup
            </LinkButton>
          </div>
        </div>

        <form action="/products" className="mt-6 grid grid-cols-[88px_1fr_auto] overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm lg:mt-8">
          <select name="category" aria-label="Category" className="border-r border-slate-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-800">
            <option value="">All</option>
            {categories.map((cat) => <option key={cat.title} value={cat.title}>{cat.title}</option>)}
          </select>
          <input name="search" placeholder="Search eyewear" className="min-h-12 min-w-0 px-3 text-sm outline-none" />
          <button className="grid min-h-12 w-12 place-items-center bg-emerald-700 text-white" aria-label="Search products">
            <Search className="h-5 w-5" />
          </button>
        </form>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:mt-5">
          {[...categories, { title: "Eye Checkup", icon: CalendarCheck, href: "/book-eye-checkup" }].map((item) => {
            const Icon = item.icon;
            const href = "href" in item ? item.href : `/products?category=${encodeURIComponent(item.title)}`;

            return (
              <Link key={item.title} href={href} className="inline-flex flex-none items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
                <Icon className="h-4 w-4 text-emerald-700" />
                {item.title}
              </Link>
            );
          })}
        </div>

        <div className="mt-5 lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:mt-0">
          <HeroVisual products={products} />
        </div>
      </section>

      <section className="animate-fade-up-delay-1 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase text-teal-700">Top categories</p>
            <h2 className="mt-1 text-xl font-black">Shop by category</h2>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
          {categories.map((cat) => (
            <Link key={cat.title} href={`/products?category=${encodeURIComponent(cat.title)}`} className="rounded-md border border-slate-200 bg-white p-2 shadow-sm">
              <div className={`grid aspect-square place-items-center rounded-md ${cat.iconBg}`}>
                <cat.icon className="h-7 w-7" />
              </div>
              <p className="mt-2 line-clamp-1 text-center text-xs font-black text-slate-900">{cat.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="animate-fade-up-delay-2 mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-teal-700">Popular picks</p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">Featured eyewear</h2>
          </div>
          <LinkButton href="/products" variant="secondary">View all</LinkButton>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            {products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
            Add sample products in Supabase to show featured eyewear here.
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["Featured", "Top Selling", "New Arrivals"].map((label, index) => (
            <span key={label} className={`rounded-full px-4 py-2 text-xs font-black ${index === 0 ? "bg-emerald-700 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`}>
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="mb-4">
          <p className="text-xs font-black uppercase text-teal-700">Shop by shape</p>
          <h2 className="mt-1 text-xl font-black">Find your frame style</h2>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            [Sparkles, "Aviator"],
            [Square, "Rectangle"],
            [Eye, "Round"],
            [Glasses, "Square"],
          ].map(([Icon, label]) => (
            <Link key={String(label)} href={`/products?frame=${encodeURIComponent(String(label))}`} className="grid justify-items-center gap-2 rounded-md bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] font-bold text-slate-700">{String(label)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-7 sm:px-6 md:grid-cols-4 lg:px-8">
        {[
          [Truck, "Free delivery", "Inside Kathmandu Valley"],
          [CalendarCheck, "Eye checkup", "Booking available"],
          [ShieldCheck, "Quality frames", "Curated eyewear"],
          [MessageCircle, "WhatsApp support", "Fast help"],
        ].map(([Icon, title, text]) => (
          <div key={String(title)} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <Icon className="h-5 w-5 text-teal-700" />
            <h3 className="mt-3 text-sm font-black">{String(title)}</h3>
            <p className="mt-1 text-xs text-slate-600">{String(text)}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
        <div className="rounded-md bg-slate-950 p-5 text-white">
          <h2 className="text-2xl font-black">Need help choosing your frame?</h2>
          <p className="mt-2 text-sm text-slate-300">Message Titan Opticals for practical frame and lens guidance.</p>
          <div className="mt-5 flex gap-3">
            <LinkButton href={`https://wa.me/977${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hello Titan Opticals, I need help choosing eyewear.")}`} className="flex-1">
              WhatsApp us
            </LinkButton>
            <LinkButton href="/book-eye-checkup" variant="secondary" className="flex-1">
              Book checkup
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroVisual({ products }: { products: Product[] }) {
  const heroProducts = products.slice(0, 3);

  return (
    <div className="relative min-h-[300px] overflow-hidden rounded-md border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5,#ffffff_48%,#e0f2fe)] p-3 shadow-sm sm:min-h-[420px] sm:p-6">
      <div className="absolute right-6 top-6 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase text-emerald-800 shadow-sm">
        {SITE_CONFIG.name}
      </div>
      <div className="grid h-full content-end gap-4 pt-14">
        {heroProducts.length ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
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
                <div className="p-2 sm:p-3">
                  <p className="line-clamp-1 text-xs font-bold text-slate-950 sm:text-sm">{product.name}</p>
                  <p className="mt-1 text-[11px] font-semibold text-emerald-700 sm:text-xs">{formatCurrency(getSalePrice(product))}</p>
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
        <div className="rounded-md bg-slate-950/90 p-3 text-white sm:p-4">
          <p className="text-sm font-semibold text-emerald-100">Kichapokhari, opposite NMB Bank</p>
          <p className="mt-1 text-xl font-black sm:text-2xl">Try refined frames with practical eye-care guidance.</p>
        </div>
      </div>
    </div>
  );
}

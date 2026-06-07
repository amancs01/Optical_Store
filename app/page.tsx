import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck, Eye, Glasses, MessageCircle, Search, ShieldCheck, Sun, Truck } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { ProductCard } from "@/components/product/ProductCard";
import { FRAME_SHAPES, SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getFeaturedProducts } from "@/services/productService";
import { pageMetadata } from "@/lib/seo";
import type { Product } from "@/types/product";

const categories = [
  {
    title: "Eyeglasses",
    icon: Glasses,
    href: "/products?category=Eyeglasses",
    image: "/images/04_pastel_glasses_product_shot.png",
    alt: "Pastel eyeglasses product display at Titan Optical",
  },
  {
    title: "Sunglasses",
    icon: Sun,
    href: "/products?category=Sunglasses",
    image: "/images/05_marble_sunglasses_display.png",
    alt: "Premium sunglasses displayed on marble at Titan Optical",
  },
  {
    title: "Kids Frames",
    icon: Glasses,
    href: "/products?category=Kids%20Frames",
    image: "/images/04_pastel_glasses_product_shot.png",
    alt: "Soft color eyeglasses suitable for kids frames",
  },
  {
    title: "Contact Lenses",
    icon: Eye,
    href: "/products?category=Contact%20Lenses",
    image: "/images/03_contact_lens_care_flatlay.png",
    alt: "Contact lens care essentials arranged neatly",
  },
];

const quickLinks = [
  ...categories,
  {
    title: "Free Eye Checkup",
    icon: CalendarCheck,
    href: "/book-eye-checkup",
    image: "/images/08_eye_exam_consultation.png",
    alt: "Eye exam consultation at Titan Optical",
  },
];

type CategoryDropdownItem = {
  label: string;
  href: string;
  image?: string;
};

const categoryDropdowns: Record<string, CategoryDropdownItem[]> = {
  Eyeglasses: [
    { label: "Men", href: "/products?category=Eyeglasses&gender=Men", image: "/images/dropdowns/eyeglasses-men.png" },
    { label: "Women", href: "/products?category=Eyeglasses&gender=Women", image: "/images/dropdowns/eyeglasses-women.png" },
    { label: "Unisex", href: "/products?category=Eyeglasses&gender=Unisex", image: "/images/dropdowns/eyeglasses-unisex.png" },
  ],
  Sunglasses: [
    { label: "Men", href: "/products?category=Sunglasses&gender=Men", image: "/images/dropdowns/sunglasses-men.png" },
    { label: "Women", href: "/products?category=Sunglasses&gender=Women", image: "/images/dropdowns/sunglasses-women.png" },
    { label: "Unisex", href: "/products?category=Sunglasses&gender=Unisex", image: "/images/dropdowns/sunglasses-men.png" },
  ],
  "Kids Frames": [
    { label: "1-5 years", href: "/products?category=Kids%20Frames&age=1-5", image: "/images/dropdowns/kids-1-5.png" },
    { label: "6-8 years", href: "/products?category=Kids%20Frames&age=6-8", image: "/images/dropdowns/kids-6-8.png" },
    { label: "8-12 years", href: "/products?category=Kids%20Frames&age=8-12", image: "/images/dropdowns/kids-8-12.png" },
    { label: "12-17 years", href: "/products?category=Kids%20Frames&age=12-17", image: "/images/dropdowns/kids-12-17.png" },
  ],
};

const shapeCards = FRAME_SHAPES.map((shape, index) => ({
  title: shape,
  href: `/products?shape=${encodeURIComponent(shape)}`,
  image: [
    "/images/11_gold_aviator_sunglasses.png",
    "/images/04_pastel_glasses_product_shot.png",
    "/images/10_dark_tortoiseshell_frame_product.png",
    "/images/09_dual_frame_display.png",
    "/images/05_marble_sunglasses_display.png",
    "/images/category-sunglasses.png",
  ][index],
}));

const serviceHighlights = [
  { icon: Truck, title: "Free delivery", text: "Inside Kathmandu Valley" },
  { icon: CalendarCheck, title: "Free eye checkup", text: "Booking available" },
  { icon: ShieldCheck, title: "Cash on Delivery", text: "Pay at delivery" },
  { icon: MessageCircle, title: "WhatsApp support", text: "Fast help" },
];

export const metadata = pageMetadata({
  title: "Premium Eyewear in New Road, Kathmandu",
  description:
    "Shop eyeglasses, sunglasses, contact lenses, and book a free eye checkup at Titan Optical in Kichapokhari, New Road.",
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
      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-8 pt-6 sm:px-6 lg:min-h-[72vh] lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-10 lg:px-8 lg:py-12">
        <div className="animate-fade-up self-center">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">New Road, Kathmandu</p>
          <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
            See clearly. Look refined.
          </h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">
            Premium eyewear, practical eye-care support, and curated frames from Kichapokhari, opposite NMB Bank.
          </p>
          <div className="mt-5 flex gap-3">
            <LinkButton href="/products" className="flex-1 sm:flex-none">
              Shop eyewear <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/book-eye-checkup" variant="secondary" className="flex-1 sm:flex-none">
              Free Eye Checkup
            </LinkButton>
          </div>
        </div>
        <div className="lg:col-start-2 lg:row-start-1">
          <HeroVisual />
        </div>
      </section>

      <FadeIn delay={0} className="relative z-40 overflow-visible">
        <section className="relative z-40 mx-auto max-w-7xl overflow-visible px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_minmax(360px,520px)] sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Top categories</p>
              <h2 className="mt-1 text-xl font-bold">Shop the essentials</h2>
            </div>
            <form action="/products" className="grid grid-cols-[76px_1fr_48px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition focus-within:border-emerald-200 focus-within:ring-2 focus-within:ring-emerald-100">
              <select name="category" aria-label="Category" className="min-h-12 border-0 border-r border-slate-200 bg-white px-2 text-sm font-bold text-slate-800 outline-none focus:border-slate-200 focus:outline-none focus:ring-0">
                <option value="">All</option>
                {categories.map((cat) => <option key={cat.title} value={cat.title}>{cat.title}</option>)}
              </select>
              <input name="search" placeholder="Search eyewear" className="min-h-12 min-w-0 border-0 px-3 text-sm outline-none focus:outline-none focus:ring-0" />
              <button className="grid min-h-12 place-items-center bg-emerald-700 text-white transition hover:bg-emerald-800" aria-label="Search products">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
          <div className="relative z-50 grid grid-cols-2 gap-3 overflow-visible sm:grid-cols-3 lg:grid-cols-5">
            {quickLinks.map((cat) => (
              <TopCategoryCard key={cat.title} category={cat} />
            ))}
          </div>
        </section>
      </FadeIn>

      <FadeIn delay={100} className="relative z-10">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Popular picks</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Featured eyewear</h2>
            </div>
            <LinkButton href="/products" variant="secondary">View all</LinkButton>
          </div>
          {products.length ? (
            <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
              Add sample products in Supabase to show featured eyewear here.
            </div>
          )}
        </section>
      </FadeIn>

      <FadeIn delay={100}>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Frame shapes</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Shop by frame shape</h2>
              <p className="mt-2 text-sm text-slate-600">Find frames that match your face and style.</p>
            </div>
            <Link href="/products" className="text-sm font-bold text-emerald-800 hover:text-emerald-950">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {shapeCards.map((shape) => (
              <Link key={shape.title} href={shape.href} className="group overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm hover:border-emerald-200 hover:shadow-md">
                <div className="relative aspect-[4/3] overflow-hidden bg-emerald-50">
                  <Image
                    src={shape.image}
                    alt={`${shape.title} frame shape`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <p className="text-sm font-bold text-slate-950">{shape.title}</p>
                  <ArrowRight className="h-4 w-4 flex-none text-emerald-700" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-xl bg-slate-950 text-white shadow-sm md:grid-cols-[1fr_0.9fr]">
          <div className="relative min-h-[190px] md:order-2 md:min-h-[300px]">
            <Image
              src="/images/08_eye_exam_consultation.png"
              alt="Eye checkup consultation with Titan Optical"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
            />
          </div>
          <div className="p-5 sm:p-7 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-200">Free eye checkup</p>
            <h2 className="mt-2 max-w-md text-2xl font-bold sm:text-3xl">Pair better frames with practical eye-care support.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
              Book a visit, then let the team help you choose lenses, frames, and care options with confidence.
            </p>
            <div className="mt-5 flex gap-3">
              <LinkButton href="/book-eye-checkup" className="flex-1 sm:flex-none">
                Free Eye Checkup
              </LinkButton>
              <LinkButton href={`https://wa.me/977${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hello Titan Optical, I need help choosing eyewear.")}`} variant="secondary" className="flex-1 sm:flex-none">
                WhatsApp us
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-xl border border-slate-200 bg-[#fffaf2]/60 shadow-sm md:grid-cols-[0.95fr_1.05fr]">
          <div className="relative min-h-[190px] md:min-h-[320px]">
            <Image
              src="/images/09_dual_frame_display.png"
              alt="Two premium eyewear frames displayed as a featured collection"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="grid content-center p-5 sm:p-7 md:p-8">
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Store experience</p>
            <h2 className="mt-2 max-w-md text-2xl font-bold text-slate-950 sm:text-3xl">Visit a polished New Road optical space.</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Try frame shapes in person, get practical guidance, and choose lenses with support from the Titan Optical team.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <LinkButton href="/about" variant="secondary">
                Visit store <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton href={SITE_CONFIG.googleMapsUrl} variant="secondary">
                Location
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      <FadeIn delay={100}>
        <section className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
          {serviceHighlights.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-md border border-slate-200 bg-[#fffaf2]/60 p-4 shadow-sm">
              <Icon className="h-5 w-5 text-emerald-700" />
              <h3 className="mt-3 text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-slate-600">{text}</p>
            </div>
          ))}
        </section>
      </FadeIn>

      <FadeIn delay={0}>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-3 md:grid-cols-3">
            <VisualStoryCard
              href="/about"
              image="/images/02_store_interior_luxury_eyewear.png"
              alt="Luxury eyewear store interior at Titan Optical"
              eyebrow="Store visit"
              title="See the collection in person."
            />
            <VisualStoryCard
              href={`https://wa.me/977${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hello Titan Optical, I need frame guidance.")}`}
              image="/images/07_store_staff_frame_fitting.png"
              alt="Titan Optical staff helping a customer with frame fitting"
              eyebrow="Frame guidance"
              title="Get personal help choosing a flattering fit."
            />
            <VisualStoryCard
              href="/products"
              image="/images/06_style_guide_and_care_collage.png"
              alt="Eyewear style guide and frame care collage"
              eyebrow="Care guide"
              title="Keep lenses clear and frames looking premium."
            />
          </div>
        </section>
      </FadeIn>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-emerald-800 px-5 py-8 text-white shadow-sm sm:px-8 md:flex md:items-center md:justify-between md:gap-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-100">Need help choosing?</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Message us or book your free eye checkup.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-emerald-50">
              Share your frame preferences on WhatsApp, or book a visit for practical eye-care support before choosing lenses.
            </p>
          </div>
          <div className="mt-5 flex gap-3 md:mt-0">
            <LinkButton href={`https://wa.me/977${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hello Titan Optical, I need help choosing eyewear.")}`} variant="secondary" className="flex-1 sm:flex-none">
              WhatsApp
            </LinkButton>
            <LinkButton href="/book-eye-checkup" className="flex-1 bg-slate-950 hover:bg-slate-900 sm:flex-none">
              Free Eye Checkup
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm sm:min-h-[380px] lg:min-h-[520px]">
      <Image
        src="/images/hero-optical-store-product-scene.png"
        alt="Premium eyewear display at Titan Optical"
        width={1400}
        height={1050}
        priority={true}
        className="absolute inset-0 h-full w-full object-cover"
        sizes="(max-width: 1024px) 100vw, 54vw"
      />
    </div>
  );
}

function TopCategoryCard({ category }: { category: (typeof quickLinks)[number] }) {
  const dropdownItems = categoryDropdowns[category.title];
  const CategoryIcon = category.icon;

  return (
    <div className="group relative overflow-visible">
      <Link
        href={category.href}
        className="block overflow-hidden rounded-xl border border-slate-200 bg-[#fffaf2]/60 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md motion-reduce:hover:translate-y-0"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-emerald-50">
          <Image
            src={category.image}
            alt={category.alt}
            fill
            className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
        <div className="flex items-center justify-between gap-2 px-3 py-3">
          <p className="line-clamp-1 text-sm font-semibold text-slate-900">{category.title}</p>
          <ArrowRight className="h-4 w-4 flex-none text-emerald-700" />
        </div>
      </Link>

      {dropdownItems ? (
        <>
        <div className="absolute left-0 top-full z-[9998] hidden h-2 w-full bg-transparent lg:block" aria-hidden="true" />
        <div className="pointer-events-none invisible absolute left-0 top-[calc(100%+0.375rem)] z-[9999] hidden w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white opacity-0 shadow-2xl shadow-slate-950/20 transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 lg:block">
          {dropdownItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-[76px] items-center gap-3 border-b border-slate-100 bg-white px-3 py-3 text-sm font-bold text-slate-800 transition last:border-b-0 hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span className="relative h-14 w-14 flex-none overflow-hidden rounded-xl border border-slate-100 bg-emerald-50">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-emerald-700">
                    <CategoryIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                )}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        </>
      ) : null}
    </div>
  );
}

function VisualStoryCard({
  href,
  image,
  alt,
  eyebrow,
  title,
}: {
  href: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <Link href={href} className="group overflow-hidden rounded-xl border border-slate-200 bg-[#fffaf2]/60 shadow-sm">
      <div className="relative aspect-[5/3] overflow-hidden rounded-t-xl bg-emerald-50">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{eyebrow}</p>
        <h3 className="mt-2 text-base font-semibold leading-snug text-slate-950">{title}</h3>
      </div>
    </Link>
  );
}

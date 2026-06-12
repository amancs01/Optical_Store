import Link from "next/link";
import type { Metadata } from "next";
import { cache } from "react";
import { CalendarCheck, MessageCircle, Truck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchaseControls } from "@/components/product/ProductPurchaseControls";
import { StateMessage } from "@/components/ui/StateMessage";
import { formatCurrency, getAvailabilityDetailStatus, getSalePrice } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getProductBySlug, getSimilarProducts } from "@/services/productService";
import { SITE_CONFIG } from "@/lib/constants";
import { absoluteUrl } from "@/lib/seo";

const getProductBySlugCached = cache(getProductBySlug);
const getSimilarProductsCached = cache(getSimilarProducts);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  if (!isSupabaseConfigured) {
    return {
      title: "Product",
      description: SITE_CONFIG.description,
    };
  }

  try {
    const product = await getProductBySlugCached(slug);
    const description = product.description || `Shop ${product.name} at Titan Optical in New Road, Kathmandu.`;

    return {
      title: product.name,
      description,
      alternates: {
        canonical: absoluteUrl(`/products/${product.slug}`),
      },
      openGraph: {
        title: `${product.name} | ${SITE_CONFIG.name}`,
        description,
        url: absoluteUrl(`/products/${product.slug}`),
        siteName: SITE_CONFIG.name,
        type: "website",
        locale: "en_NP",
        images: product.image_url
          ? [{ url: product.image_url, alt: product.name }]
          : [{ url: absoluteUrl(SITE_CONFIG.logoPath), width: 512, height: 512, alt: SITE_CONFIG.name }],
      },
    };
  } catch {
    return {
      title: "Product not found",
      description: "This Titan Optical product is unavailable.",
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured) {
    return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables to view product details." /></div>;
  }

  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlugCached(slug);
  } catch {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <StateMessage
          title="Product not found"
          message="This product is unavailable or has not been added in Supabase yet."
        />
      </div>
    );
  }

  const similar = await getSimilarProductsCached(product.category, product.id).catch(() => []);
  const availability = getAvailabilityDetailStatus(product.stock_quantity);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-36 pt-6 sm:px-6 md:pb-6 lg:px-8">
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 sm:text-sm" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-emerald-800">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-emerald-800">Products</Link>
        <span>/</span>
        <span className="text-slate-900">{product.name}</span>
      </nav>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery product={product} />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{product.brand || product.category}</p>
          <h1 className="mt-2 text-3xl font-black leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-2xl font-black">{formatCurrency(getSalePrice(product))}</p>
            {product.discount_price ? <p className="text-slate-500 line-through">{formatCurrency(product.price)}</p> : null}
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">{product.description || "A refined optical frame selected for comfort, durability, and everyday style."}</p>
          <dl className="mt-5 grid grid-cols-2 gap-2 text-sm sm:gap-3">
            {[
              ["Category", product.category],
              ["Frame type", product.frame_type],
              ["Shape", product.shape],
              ["Material", product.material],
              ["Color", product.color],
              ["Gender", product.gender],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-[#fffaf2]/60 p-3">
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="mt-1 font-semibold">{value || "Available in store"}</dd>
              </div>
            ))}
          </dl>
          <p className={`mt-5 inline-flex rounded-full px-3 py-1 text-sm font-bold ${availability.className}`}>
            {availability.label}
          </p>
          <ProductPurchaseControls product={product} />
          <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
            {[
              [Truck, "Free Valley delivery", SITE_CONFIG.deliveryNote, "/shipping-policy"],
              [MessageCircle, "Need help choosing?", "Message us on WhatsApp for frame guidance.", `https://wa.me/977${SITE_CONFIG.whatsapp}?text=${encodeURIComponent("Hello Titan Optical, I need help choosing eyewear.")}`],
              [CalendarCheck, "Free eye checkup available", "Reserve a visit before choosing lenses.", "/book-eye-checkup"],
            ].map(([Icon, title, text, href]) => (
              <a key={String(title)} href={String(href)} className="rounded-md border border-slate-200 bg-[#fffaf2]/60 p-3 text-sm shadow-sm hover:border-emerald-200 sm:p-4">
                <Icon className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                <p className="mt-3 font-semibold text-slate-950">{String(title)}</p>
                <p className="mt-1 text-slate-600">{String(text)}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
      {similar.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">Similar products</h2>
          <div className="mt-5 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {similar.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

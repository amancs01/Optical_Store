import Image from "next/image";
import Link from "next/link";
import { Glasses } from "lucide-react";
import { formatCurrency, getSalePrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const availability = getAvailabilityLabel(product.stock_quantity);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition md:hover:-translate-y-0.5 md:hover:border-emerald-200 md:hover:shadow-md motion-reduce:hover:translate-y-0">
      <Link href={`/products/${product.slug}`} className="group block bg-slate-100">
        <div className="relative aspect-square overflow-hidden sm:aspect-[4/3]">
          {product.discount_price ? (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Sale
            </span>
          ) : null}
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition duration-500 md:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />
          ) : (
            <ProductImageFallback name={product.name} />
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-2.5 sm:p-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{product.brand || product.category}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-950 hover:underline">
            {product.name}
          </Link>
        </div>
        <div className="grid min-h-[3.5rem] content-start gap-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-sm font-black text-slate-950 sm:text-base">{formatCurrency(getSalePrice(product))}</p>
            {product.discount_price ? (
              <p className="text-xs text-slate-500 line-through">{formatCurrency(product.price)}</p>
            ) : null}
          </div>
          <p className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-bold ${availability.className}`}>{availability.label}</p>
        </div>
        <div className="mt-auto pt-1">
          <AddToCartButton product={product} compact />
        </div>
      </div>
    </article>
  );
}

function getAvailabilityLabel(stock: number) {
  if (stock <= 0) return { label: "Out of stock", className: "bg-rose-50 text-rose-700" };
  if (stock <= 3) return { label: "Limited stock", className: "bg-amber-50 text-amber-700" };
  return { label: "Available", className: "bg-emerald-50 text-emerald-700" };
}

export function ProductImageFallback({ name }: { name: string }) {
  return (
    <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#064e3b,#059669_55%,#d1fae5)] p-4 text-center text-white">
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 sm:h-14 sm:w-14">
          <Glasses className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-emerald-50">Titan Opticals</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-white/90">{name}</p>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Glasses } from "lucide-react";
import { formatCurrency, getSalePrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  const availability = getAvailabilityLabel(product.stock_quantity);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition md:hover:-translate-y-1 md:hover:border-emerald-200 md:hover:shadow-md motion-reduce:hover:translate-y-0">
      <Link href={`/products/${product.slug}`} className="group block bg-slate-100">
        <div className="relative aspect-[4/3]">
          {product.discount_price ? (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-emerald-700 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Sale
            </span>
          ) : null}
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover transition duration-500 md:group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100" sizes="(max-width: 768px) 50vw, 33vw" />
          ) : (
            <ProductImageFallback name={product.name} />
          )}
        </div>
      </Link>
      <div className="grid gap-2 p-3 sm:gap-3 sm:p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{product.brand || product.category}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-slate-950 hover:underline sm:text-base">
            {product.name}
          </Link>
        </div>
        <div className="grid gap-2">
          <div>
            <p className="font-black text-slate-950">{formatCurrency(getSalePrice(product))}</p>
            {product.discount_price ? (
              <p className="text-xs text-slate-500 line-through">{formatCurrency(product.price)}</p>
            ) : null}
          </div>
          <p className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-bold ${availability.className}`}>{availability.label}</p>
        </div>
        <AddToCartButton product={product} />
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
    <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#064e3b,#059669_55%,#d1fae5)] p-6 text-center text-white">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
          <Glasses className="h-9 w-9" aria-hidden="true" />
        </div>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-wide text-emerald-50">Titan Opticals</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-white/90">{name}</p>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Glasses } from "lucide-react";
import { formatCurrency, getSalePrice } from "@/lib/utils";
import type { Product } from "@/types/product";
import { AddToCartButton } from "@/components/product/AddToCartButton";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <Link href={`/products/${product.slug}`} className="block bg-slate-100">
        <div className="relative aspect-[4/3]">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <ProductImageFallback name={product.name} />
          )}
        </div>
      </Link>
      <div className="grid gap-3 p-4">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">{product.brand || product.category}</p>
          <Link href={`/products/${product.slug}`} className="mt-1 block font-semibold text-slate-950 hover:underline">
            {product.name}
          </Link>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-bold text-slate-950">{formatCurrency(getSalePrice(product))}</p>
            {product.discount_price ? (
              <p className="text-xs text-slate-500 line-through">{formatCurrency(product.price)}</p>
            ) : null}
          </div>
          <p className="text-xs font-medium text-slate-500">{product.stock_quantity} in stock</p>
        </div>
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

export function ProductImageFallback({ name }: { name: string }) {
  return (
    <div className="grid h-full place-items-center bg-[linear-gradient(135deg,#064e3b,#059669_55%,#d1fae5)] p-6 text-center text-white">
      <div>
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/15 ring-1 ring-white/30">
          <Glasses className="h-9 w-9" aria-hidden="true" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-wide text-emerald-50">Titan Opticals</p>
        <p className="mt-1 line-clamp-2 text-sm font-semibold text-white/90">{name}</p>
      </div>
    </div>
  );
}

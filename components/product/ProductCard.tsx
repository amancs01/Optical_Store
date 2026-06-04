import Image from "next/image";
import Link from "next/link";
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
            <div className="flex h-full items-center justify-center text-sm text-slate-500">No image</div>
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

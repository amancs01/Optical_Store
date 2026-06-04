import Image from "next/image";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { ProductCard } from "@/components/product/ProductCard";
import { StateMessage } from "@/components/ui/StateMessage";
import { formatCurrency, getSalePrice } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getProductBySlug, getSimilarProducts } from "@/services/productService";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isSupabaseConfigured) {
    return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables to view product details." /></div>;
  }

  const { slug } = await params;
  let product;
  try {
    product = await getProductBySlug(slug);
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

  const similar = await getSimilarProducts(product.category, product.id).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-100">
          <div className="relative aspect-square">
            {product.image_url ? <Image src={product.image_url} alt={product.name} fill className="object-cover" /> : <div className="grid h-full place-items-center text-slate-500">No image</div>}
          </div>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-teal-700">{product.brand || product.category}</p>
          <h1 className="mt-2 text-4xl font-black">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-2xl font-black">{formatCurrency(getSalePrice(product))}</p>
            {product.discount_price ? <p className="text-slate-500 line-through">{formatCurrency(product.price)}</p> : null}
          </div>
          <p className="mt-4 leading-7 text-slate-600">{product.description || "A refined optical frame selected for comfort, durability, and everyday style."}</p>
          <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
            {[
              ["Category", product.category],
              ["Frame type", product.frame_type],
              ["Shape", product.shape],
              ["Material", product.material],
              ["Color", product.color],
              ["Gender", product.gender],
            ].map(([label, value]) => (
              <div key={label} className="rounded-md border border-slate-200 bg-white p-3">
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold">{value || "Available in store"}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-sm font-semibold text-slate-600">{product.stock_quantity > 0 ? `${product.stock_quantity} pieces in stock` : "Out of stock"}</p>
          <div className="mt-5 max-w-sm"><AddToCartButton product={product} /></div>
        </div>
      </div>
      {similar.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-black">Similar products</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {similar.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}

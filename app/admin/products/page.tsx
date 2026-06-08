"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button, LinkButton } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { deleteProduct, getAllProductsForAdmin } from "@/services/productService";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { useCurrentUser } from "@/lib/auth/admin";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useCurrentUser();

  function load() {
    setLoading(true);
    setError("");
    getAllProductsForAdmin()
      .then(setProducts)
      .catch((err) => {
        setProducts([]);
        setError(err instanceof Error ? err.message : "Products could not load.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isAdmin) return;
    window.queueMicrotask(load);
  }, [isAdmin]);
  const visible = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [products, search]);

  async function confirmDelete(product: Product) {
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;
    await deleteProduct(product.id);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Products</h1>
        <div className="flex flex-wrap items-center gap-3">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="w-56 rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
          <LinkButton href="/admin/products/new">Add product</LinkButton>
        </div>
      </div>
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Products could not load" message={error} /></div> : null}
      {!loading && !error && !visible.length ? <div className="mt-5"><StateMessage title="No products found" message="Add a product or change the search term." /></div> : null}
      {!loading && !error && visible.length ? <div className="mt-5 overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="w-16 p-3 pr-1">Image</th><th className="pl-1">Name</th><th>Price</th><th className="text-center">Stock</th><th className="text-center">Actions</th></tr></thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id} className="border-t border-slate-200">
                <td className="w-16 p-3 pr-1"><ProductThumbnail product={product} /></td><td className="pl-1 font-semibold">{product.name}</td><td>{formatCurrency(product.discount_price || product.price)}</td><td className="text-center">{product.stock_quantity}</td>
                <td className="p-3 text-center"><div className="inline-flex items-center gap-1"><Link href={`/admin/products/${product.id}/edit`} className="inline-flex h-7 w-7 items-center justify-center rounded-md text-teal-700 transition hover:bg-teal-50" aria-label="Edit product"><Pencil className="h-3.5 w-3.5" /></Link><Button variant="danger" className="h-7 min-h-0 w-7 px-0" onClick={() => confirmDelete(product)} aria-label="Delete product"><Trash2 className="h-3.5 w-3.5" /></Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> : null}
    </AdminLayout>
  );
}

function ProductThumbnail({ product }: { product: Product }) {
  if (!product.image_url) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-center text-[9px] leading-tight text-slate-400 sm:h-12 sm:w-12">
        No image
      </div>
    );
  }

  return (
    <Image
      src={product.image_url}
      alt={product.name}
      width={48}
      height={48}
      className="h-10 w-10 rounded-md border border-slate-200 bg-slate-50 object-cover sm:h-12 sm:w-12"
      sizes="48px"
    />
  );
}

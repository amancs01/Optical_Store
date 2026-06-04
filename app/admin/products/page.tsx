"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { deleteProduct, getAllProductsForAdmin } from "@/services/productService";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    window.queueMicrotask(load);
  }, []);
  const visible = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())), [products, search]);

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Products</h1>
        <LinkButton href="/admin/products/new">Add product</LinkButton>
      </div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" className="mt-5 w-full rounded-md border border-slate-200 px-3 py-2" />
      {loading ? <p className="mt-5 text-sm text-slate-600">Loading products...</p> : null}
      {error ? <div className="mt-5"><StateMessage title="Products could not load" message={error} /></div> : null}
      {!loading && !error && !visible.length ? <div className="mt-5"><StateMessage title="No products found" message="Add a product or change the search term." /></div> : null}
      <div className="mt-5 overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {visible.map((product) => (
              <tr key={product.id} className="border-t border-slate-200">
                <td className="p-3 font-semibold">{product.name}</td><td>{formatCurrency(product.discount_price || product.price)}</td><td>{product.stock_quantity}</td><td>{product.is_active ? "Active" : "Inactive"}</td>
                <td className="flex gap-2 p-3"><Link href={`/admin/products/${product.id}/edit`} className="font-semibold text-teal-700">Edit</Link><Button variant="danger" className="min-h-8 px-3" onClick={() => deleteProduct(product.id).then(load)}>Delete</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

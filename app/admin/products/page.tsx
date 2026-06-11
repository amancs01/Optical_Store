"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LinkButton } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { Pagination } from "@/components/ui/Pagination";
import { StateMessage } from "@/components/ui/StateMessage";
import { deleteProduct, getAllProductsForAdmin } from "@/services/productService";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { useAdminStatus } from "@/lib/auth/admin";

const PAGE_SIZE = 7;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { isAdmin } = useAdminStatus();

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
  const totalPages = Math.ceil(visible.length / PAGE_SIZE);
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function confirmDelete(product: Product) {
    const confirmed = window.confirm(`Delete "${product.name}"? This cannot be undone.`);
    if (!confirmed) return;
    await deleteProduct(product.id);
    load();
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h1 className="text-3xl font-black">Products</h1>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 sm:w-56 sm:flex-none" />
          <LinkButton href="/admin/products/new">+ Add</LinkButton>
          <button onClick={load}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            title="Refresh">↻</button>
        </div>
      </div>
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Products could not load" message={error} /></div> : null}
      {!loading && !error && !visible.length ? <div className="mt-5"><StateMessage title="No products found" message="Add a product or change the search term." /></div> : null}
      {!loading && !error && visible.length ? <>
        {/* Desktop table - hidden on mobile */}
        <div className="mt-5 hidden overflow-x-auto rounded-xl border border-slate-200 bg-white sm:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="w-16 p-3 pr-1">Image</th>
                <th className="py-3 pl-1">Name</th>
                <th className="py-3">Category</th>
                <th className="py-3">Price</th>
                <th className="py-3 text-center">Stock</th>
                <th className="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((product) => (
                <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="w-16 p-3 pr-1"><ProductThumbnail product={product} /></td>
                  <td className="py-3 pl-1 font-semibold">{product.name}</td>
                  <td className="py-3 text-slate-600">{product.category || "—"}</td>
                  <td className="py-3">{formatCurrency(product.discount_price || product.price)}</td>
                  <td className="py-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      product.stock_quantity <= 0 ? "bg-rose-100 text-rose-700" :
                      product.stock_quantity <= 3 ? "bg-amber-100 text-amber-700" :
                      "bg-emerald-100 text-emerald-700"
                    }`}>{product.stock_quantity}</span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-2">
                      <Link href={`/admin/products/${product.id}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-teal-700 hover:bg-teal-50"
                        aria-label="Edit product"><Pencil className="h-4 w-4" /></Link>
                      <button onClick={() => confirmDelete(product)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-rose-600 hover:bg-rose-50"
                        aria-label="Delete product"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card list - hidden on sm and above */}
        <div className="mt-4 grid gap-3 sm:hidden">
          {paginated.map((product) => (
            <div key={product.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
              <ProductThumbnail product={product} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-950">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category || "—"}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{formatCurrency(product.discount_price || product.price)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    product.stock_quantity <= 0 ? "bg-rose-100 text-rose-700" :
                    product.stock_quantity <= 3 ? "bg-amber-100 text-amber-700" :
                    "bg-emerald-100 text-emerald-700"
                  }`}>Stock: {product.stock_quantity}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/admin/products/${product.id}/edit`}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-teal-700 hover:bg-teal-50"
                  aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
                <button onClick={() => confirmDelete(product)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50"
                  aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </> : null}
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

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { StateMessage } from "@/components/ui/StateMessage";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeletons";
import { CATEGORIES, FRAME_TYPES, GENDERS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getActiveProducts } from "@/services/productService";
import { getSalePrice } from "@/lib/utils";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(() => ({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    gender: searchParams.get("gender") || "",
    frame: searchParams.get("frame") || "",
    sort: searchParams.get("sort") || "newest",
  }));

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getActiveProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[], [products]);
  const visible = useMemo(() => {
    const term = filters.search.toLowerCase();
    const filtered = products.filter((product) => (
      (!term || product.name.toLowerCase().includes(term)) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.brand || product.brand === filters.brand) &&
      (!filters.gender || product.gender === filters.gender) &&
      (!filters.frame || product.frame_type === filters.frame)
    ));

    return [...filtered].sort((a, b) => {
      if (filters.sort === "price-low") return getSalePrice(a) - getSalePrice(b);
      if (filters.sort === "price-high") return getSalePrice(b) - getSalePrice(a);
      if (filters.sort === "name") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filters, products]);

  function resetFilters() {
    updateFilters({ search: "", category: "", brand: "", gender: "", frame: "", sort: "newest" });
  }

  function updateFilters(newFilters: typeof filters) {
    setFilters(newFilters);
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(newFilters).filter(([, value]) => value && value !== "newest")),
    ).toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-wide text-teal-700">Titan Opticals collection</p>
        <h1 className="mt-1 animate-fade-up text-3xl font-black sm:text-4xl">Shop eyewear</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Search and filter premium frames, sunglasses, and contact lenses.</p>
      </div>

      <div className="mb-5 rounded-md border border-slate-200 bg-white shadow-sm">
        <button
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold md:hidden"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <span>Filters & sort</span>
          <span>{filtersOpen ? "▲" : "▼"}</span>
        </button>
        <div className={`grid gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4 ${filtersOpen ? "block" : "hidden"} md:grid`}>
          <input aria-label="Search products" placeholder="Search products" value={filters.search} onChange={(e) => updateFilters({ ...filters, search: e.target.value })} className="rounded-md border border-slate-200 px-3 py-2" />
          <Select label="Category" value={filters.category} options={CATEGORIES} onChange={(value) => updateFilters({ ...filters, category: value })} />
          <Select label="Brand" value={filters.brand} options={brands} onChange={(value) => updateFilters({ ...filters, brand: value })} />
          <Select label="Gender" value={filters.gender} options={GENDERS} onChange={(value) => updateFilters({ ...filters, gender: value })} />
          <Select label="Frame" value={filters.frame} options={FRAME_TYPES} onChange={(value) => updateFilters({ ...filters, frame: value })} />
          <Select label="Sort" value={filters.sort} options={["Newest", "Price: Low to High", "Price: High to Low", "Name A-Z"]} values={["newest", "price-low", "price-high", "name"]} onChange={(value) => updateFilters({ ...filters, sort: value })} />
          <button type="button" onClick={resetFilters} className="min-h-10 rounded-md border border-emerald-200 px-3 text-sm font-semibold text-emerald-900 hover:bg-emerald-50">
            Reset filters
          </button>
        </div>
      </div>

      {!isSupabaseConfigured ? (
        <StateMessage title="Supabase is not configured" message="Add the public Supabase variables and run the schema to load products." />
      ) : loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <StateMessage title="Products could not load" message={error} />
      ) : visible.length ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
          <p className="text-sm font-bold uppercase text-emerald-700">No matches</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">No frames match your filters yet.</h2>
          <p className="mt-2 text-sm text-slate-600">Try another category or message us on WhatsApp for help finding a similar style.</p>
        </div>
      )}
    </div>
  );
}

function Select({ label, value, options, values, onChange }: { label: string; value: string; options: string[]; values?: string[]; onChange: (value: string) => void }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2">
      <option value="">{label}</option>
      {options.map((option, index) => (
        <option key={option} value={values?.[index] || option}>{option}</option>
      ))}
    </select>
  );
}

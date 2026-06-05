"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { StateMessage } from "@/components/ui/StateMessage";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeletons";
import { CATEGORIES, FRAME_TYPES, GENDERS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getActiveProducts } from "@/services/productService";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(() => ({
    search: "",
    category: typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("category") || "",
    brand: "",
    gender: "",
    frame: "",
  }));

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    getActiveProducts()
      .then(setProducts)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load products."))
      .finally(() => setLoading(false));
  }, []);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[], [products]);
  const visible = products.filter((product) => {
    const term = filters.search.toLowerCase();
    return (
      (!term || product.name.toLowerCase().includes(term)) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.brand || product.brand === filters.brand) &&
      (!filters.gender || product.gender === filters.gender) &&
      (!filters.frame || product.frame_type === filters.frame)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black">Shop eyewear</h1>
        <p className="mt-3 text-slate-600">Filter frames by brand, fit, category, and stock.</p>
      </div>

      <div className="mb-6 grid gap-3 rounded-md border border-slate-200 bg-white p-4 md:grid-cols-5">
        <input aria-label="Search products" placeholder="Search products" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="rounded-md border border-slate-200 px-3 py-2" />
        <Select label="Category" value={filters.category} options={CATEGORIES} onChange={(value) => setFilters({ ...filters, category: value })} />
        <Select label="Brand" value={filters.brand} options={brands} onChange={(value) => setFilters({ ...filters, brand: value })} />
        <Select label="Gender" value={filters.gender} options={GENDERS} onChange={(value) => setFilters({ ...filters, gender: value })} />
        <Select label="Frame" value={filters.frame} options={FRAME_TYPES} onChange={(value) => setFilters({ ...filters, frame: value })} />
      </div>

      {!isSupabaseConfigured ? (
        <StateMessage title="Supabase is not configured" message="Add the public Supabase variables and run the schema to load products." />
      ) : loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <StateMessage title="Products could not load" message={error} />
      ) : visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
          <p className="text-sm font-bold uppercase text-emerald-700">No matches</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">No eyewear matches those filters.</h2>
          <p className="mt-2 text-sm text-slate-600">Try clearing one filter or searching by frame style, brand, or category.</p>
        </div>
      )}
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2">
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  );
}

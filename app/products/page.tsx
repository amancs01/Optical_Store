"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { StateMessage } from "@/components/ui/StateMessage";
import { ProductGridSkeleton } from "@/components/ui/LoadingSkeletons";
import { CATEGORIES, FRAME_SHAPES, FRAME_TYPES, GENDERS } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { getActiveProducts } from "@/services/productService";
import { cn, getSalePrice } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductFilters = {
  search: string;
  category: string;
  brand: string;
  gender: string;
  frame_type: string;
  shape: string;
  material: string;
  lens: string;
  type: string;
  age: string;
  price: string;
  sort: string;
};

type FilterKey = keyof ProductFilters;
type SelectOption = {
  label: string;
  value: string;
};

const categoryTabs = ["All", ...CATEGORIES];
const mobileCategoryTabs = ["All", "Eyeglasses", "Sunglasses", "Kids Frames", "Contact Lenses"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-low" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" },
];
const priceRanges = [
  { label: "Under NPR 2,000", value: "0-2000", min: 0, max: 2000 },
  { label: "NPR 2,000 - 5,000", value: "2000-5000", min: 2000, max: 5000 },
  { label: "NPR 5,000 - 10,000", value: "5000-10000", min: 5000, max: 10000 },
  { label: "Above NPR 10,000", value: "10000-", min: 10000, max: Number.POSITIVE_INFINITY },
];
const mobilePriceRanges = [
  { label: "Under NPR 1,500", value: "0-1500", min: 0, max: 1500 },
  { label: "NPR 1,500-3,000", value: "1500-3000", min: 1500, max: 3000 },
  { label: "NPR 3,000+", value: "3000-", min: 3000, max: Number.POSITIVE_INFINITY },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const [sortSheetOpen, setSortSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const filters = useMemo(() => filtersFromParams(searchParams), [searchParams]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;

    getActiveProducts()
      .then((activeProducts) => {
        if (active) setProducts(activeProducts);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Could not load products.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    function closeSheets(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSortSheetOpen(false);
        setFilterSheetOpen(false);
      }
    }

    document.addEventListener("keydown", closeSheets);
    return () => document.removeEventListener("keydown", closeSheets);
  }, []);

  const brands = useMemo(() => Array.from(new Set(products.map((p) => p.brand).filter(Boolean))) as string[], [products]);
  const shapes = useMemo(
    () => Array.from(new Set([...FRAME_SHAPES, ...products.map((p) => p.shape).filter(Boolean)])) as string[],
    [products],
  );
  const materials = useMemo(() => Array.from(new Set(products.map((p) => p.material).filter(Boolean))) as string[], [products]);

  const visible = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const searchable = [product.name, product.brand, product.category, product.shape].filter(Boolean).join(" ").toLowerCase();

      return (
        (!term || searchable.includes(term)) &&
        (!filters.category || product.category === filters.category) &&
        (!filters.brand || product.brand === filters.brand) &&
        (!filters.gender || product.gender === filters.gender) &&
        (!filters.frame_type || product.frame_type === filters.frame_type) &&
        (!filters.shape || product.shape === filters.shape) &&
        (!filters.material || product.material === filters.material) &&
        matchesPriceRange(product, filters.price)
      );
    });

    return [...filtered].sort((a, b) => {
      if (filters.sort === "price-low") return getSalePrice(a) - getSalePrice(b);
      if (filters.sort === "price-high") return getSalePrice(b) - getSalePrice(a);
      if (filters.sort === "name-desc") return b.name.localeCompare(a.name);
      if (filters.sort === "name" || filters.sort === "name-asc") return a.name.localeCompare(b.name);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [filters, products]);

  const hasFilters = Boolean(filters.search || filters.category || filters.brand || filters.gender || filters.frame_type || filters.shape || filters.material || filters.lens || filters.type || filters.age || filters.price);
  const filterMenus: Array<{
    label: string;
    field: FilterKey;
    value: string;
    options: SelectOption[];
  }> = [
    { label: "Brand", field: "brand", value: filters.brand, options: toOptions(brands) },
    { label: "Gender", field: "gender", value: filters.gender, options: toOptions(GENDERS) },
    { label: "Frame Type", field: "frame_type", value: filters.frame_type, options: toOptions(FRAME_TYPES) },
    { label: "Shape", field: "shape", value: filters.shape, options: toOptions(shapes) },
    { label: "Material", field: "material", value: filters.material, options: toOptions(materials) },
    { label: "Price", field: "price", value: filters.price, options: priceRanges.map(({ label, value }) => ({ label, value })) },
  ];
  const mobileFilterGroups: Array<{
    label: string;
    field: FilterKey;
    options: SelectOption[];
  }> = [
    ...(brands.length ? [{ label: "Brand", field: "brand" as const, options: toOptions(brands) }] : []),
    { label: "Category", field: "category", options: toOptions(["Eyeglasses", "Sunglasses", "Kids Frames", "Contact Lenses"]) },
    { label: "Gender", field: "gender", options: toOptions(["Men", "Women", "Unisex"]) },
    { label: "Frame Type", field: "frame_type", options: toOptions(["Full Rim", "Half Rim", "Rimless"]) },
    { label: "Shape", field: "shape", options: toOptions(["Rectangle", "Square", "Cat Eye", "Oval", "Round", "Aviator", "Wayfarer"]) },
    { label: "Material", field: "material", options: toOptions(["Metal", "Acetate", "Titanium", "TR90"]) },
    { label: "Price Range", field: "price", options: mobilePriceRanges.map(({ label, value }) => ({ label, value })) },
  ];

  function resetFilters() {
    updateFilters({ search: "", category: "", brand: "", gender: "", frame_type: "", shape: "", material: "", lens: "", type: "", age: "", price: "", sort: "newest" });
  }

  function updateFilters(newFilters: ProductFilters) {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(newFilters).filter(([, value]) => value && value !== "newest")),
    ).toString();
    router.replace(query ? `/products?${query}` : "/products", { scroll: false });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Titan Optical collection</p>
        <h1 className="mt-1 animate-fade-up text-3xl font-black sm:text-4xl">Shop eyewear</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Search and filter premium frames, sunglasses, and contact lenses.</p>
      </div>

      <div className="mb-5 md:hidden">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            aria-label="Search products"
            placeholder="Search products"
            value={filters.search}
            onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm shadow-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSortSheetOpen(true)}
            className="inline-flex h-11 items-center justify-between rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 shadow-sm"
          >
            <span className="truncate">Sort: {mobileSortLabel(filters.sort)}</span>
            <ChevronDown className="h-4 w-4 flex-none text-slate-500" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setFilterSheetOpen(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 text-sm font-bold text-emerald-900 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
          </button>
        </div>

        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {mobileCategoryTabs.map((category) => {
            const value = category === "All" ? "" : category;
            const active = filters.category === value;

            return (
              <button
                key={category}
                type="button"
                onClick={() => updateFilters({ ...filters, category: value })}
                className={cn(
                  "h-9 flex-none whitespace-nowrap rounded-full border px-3 text-xs font-bold transition",
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 bg-white text-slate-700",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:block">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_210px_auto] lg:items-center">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              aria-label="Search products"
              placeholder="Search products"
              value={filters.search}
              onChange={(e) => updateFilters({ ...filters, search: e.target.value })}
              className="h-11 w-full rounded-lg border border-slate-200 bg-[#fffaf2]/50 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-600 focus:bg-white focus:ring-2 focus:ring-emerald-100"
            />
          </label>
          <FilterMenu
            label="Sort"
            value={filters.sort}
            options={sortOptions}
            onChange={(value) => updateFilters({ ...filters, sort: value })}
            prefix="Sort"
            buttonClassName="w-full justify-between rounded-lg"
          />
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-4 text-sm font-bold text-emerald-900 transition hover:bg-emerald-50"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset filters
          </button>
        </div>

        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {categoryTabs.map((category) => {
            const value = category === "All" ? "" : category;
            const active = filters.category === value;
            return (
              <button
                key={category}
                type="button"
                onClick={() => updateFilters({ ...filters, category: value })}
                className={cn(
                  "h-9 flex-none rounded-full border px-3 text-xs font-bold transition",
                  active
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {filterMenus.map((menu) => (
            <FilterMenu
              key={menu.field}
              label={menu.label}
              value={menu.value}
              options={menu.options}
              onChange={(value) => updateFilters({ ...filters, [menu.field]: value })}
            />
          ))}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <p>{loading ? "Loading collection..." : `${visible.length} ${visible.length === 1 ? "frame" : "frames"} found`}</p>
          {hasFilters ? (
            <div className="hidden flex-wrap gap-1.5 md:flex">
              {activeFilterLabels(filters).map((label) => (
                <span key={label} className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900">
                  {label}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {hasFilters ? (
          <button type="button" onClick={resetFilters} className="font-bold text-emerald-800 hover:text-emerald-950">
            Clear all
          </button>
        ) : null}
      </div>

      {!isSupabaseConfigured ? (
        <StateMessage title="Supabase is not configured" message="Add the public Supabase variables and run the schema to load products." />
      ) : loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <StateMessage title="Products could not load" message={error} />
      ) : visible.length ? (
        <div className="grid grid-cols-2 items-stretch gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">No matches</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950">No frames match your filters.</h2>
          <p className="mt-2 text-sm text-slate-600">Try another category or message us on WhatsApp.</p>
        </div>
      )}

      {sortSheetOpen ? (
        <MobileSheet title="Sort by" onClose={() => setSortSheetOpen(false)}>
          <div className="grid gap-2 p-4">
            {sortOptions.map((option) => {
              const active = filters.sort === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    updateFilters({ ...filters, sort: option.value });
                    setSortSheetOpen(false);
                  }}
                  className={cn(
                    "flex h-11 items-center justify-between rounded-xl border px-3 text-left text-sm font-bold",
                    active
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-200 bg-white text-slate-800",
                  )}
                >
                  {option.label}
                  {active ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </MobileSheet>
      ) : null}

      {filterSheetOpen ? (
        <MobileSheet
          title="Filters"
          onClose={() => setFilterSheetOpen(false)}
          headerAction={
            <button type="button" onClick={resetFilters} className="text-sm font-bold text-emerald-800">
              Reset
            </button>
          }
        >
          <div className="grid gap-5 p-4 pb-24">
            {mobileFilterGroups.map((group) => (
              <div key={group.label}>
                <h2 className="text-xs font-black uppercase tracking-wide text-slate-500">{group.label}</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {group.options.map((option) => {
                    const active = filters[group.field] === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateFilters({ ...filters, [group.field]: active ? "" : option.value })}
                        className={cn(
                          "h-9 rounded-full border px-3 text-xs font-bold transition",
                          active
                            ? "border-emerald-700 bg-emerald-700 text-white"
                            : "border-slate-200 bg-white text-slate-700",
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="sticky bottom-0 grid grid-cols-2 gap-2 border-t border-slate-200 bg-white p-4">
            <button type="button" onClick={resetFilters} className="h-11 rounded-xl border border-slate-200 text-sm font-bold text-slate-800">
              Reset filters
            </button>
            <button type="button" onClick={() => setFilterSheetOpen(false)} className="h-11 rounded-xl bg-emerald-700 text-sm font-bold text-white">
              Apply filters
            </button>
          </div>
        </MobileSheet>
      ) : null}
    </div>
  );
}

function filtersFromParams(searchParams: { get: (key: string) => string | null }): ProductFilters {
  return {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    gender: searchParams.get("gender") || "",
    frame_type: searchParams.get("frame_type") || searchParams.get("frame") || "",
    shape: searchParams.get("shape") || "",
    material: searchParams.get("material") || "",
    lens: searchParams.get("lens") || "",
    type: searchParams.get("type") || "",
    age: searchParams.get("age") || "",
    price: searchParams.get("price") || "",
    sort: searchParams.get("sort") || "newest",
  };
}

function matchesPriceRange(product: Product, value: string) {
  if (!value) return true;
  const range = [...priceRanges, ...mobilePriceRanges].find((item) => item.value === value);
  if (!range) return true;
  const price = getSalePrice(product);
  return price >= range.min && price <= range.max;
}

function toOptions(options: string[]): SelectOption[] {
  return options.map((option) => ({ label: option, value: option }));
}

function activeFilterLabels(filters: ProductFilters) {
  return [
    filters.search ? `Search: ${filters.search}` : "",
    filters.category,
    filters.brand ? `Brand: ${filters.brand}` : "",
    filters.gender ? `Gender: ${filters.gender}` : "",
    filters.frame_type ? `Frame: ${filters.frame_type}` : "",
    filters.shape ? `Shape: ${filters.shape}` : "",
    filters.material ? `Material: ${filters.material}` : "",
    filters.price ? `Price: ${[...priceRanges, ...mobilePriceRanges].find((range) => range.value === filters.price)?.label || filters.price}` : "",
  ].filter(Boolean);
}

function mobileSortLabel(value: string) {
  if (value === "price-low") return "Price Low -> High";
  if (value === "price-high") return "Price High -> Low";
  if (value === "name-asc") return "Name A-Z";
  if (value === "name-desc") return "Name Z-A";
  return "Newest";
}

function MobileSheet({
  title,
  children,
  onClose,
  headerAction,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  headerAction?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[9999] md:hidden" role="presentation">
      <button
        type="button"
        aria-label="Close sheet"
        className="absolute inset-0 bg-slate-950/30"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="false"
        aria-label={title}
        className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 pb-3 pt-2">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-200" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <h1 className="text-base font-black text-slate-950">{title}</h1>
              {headerAction}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 flex-none place-items-center rounded-full border border-slate-200 text-slate-700"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}

function FilterMenu({
  label,
  value,
  options,
  onChange,
  prefix,
  buttonClassName,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  prefix?: string;
  buttonClassName?: string;
}) {
  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label || label;

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-10 flex-none items-center justify-center gap-2 rounded-full border px-3 text-sm font-bold outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-200",
            value
              ? "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
              : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900",
            buttonClassName,
          )}
          aria-label={label}
        >
          <span className="max-w-[170px] truncate">
            {prefix ? `${prefix}: ${displayLabel}` : value ? `${label}: ${displayLabel}` : label}
          </span>
          <ChevronDown className="h-4 w-4 flex-none" aria-hidden="true" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          side="bottom"
          sideOffset={8}
          avoidCollisions={false}
          className="z-[9999] max-h-64 min-w-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-950/10 outline-none"
        >
          {!prefix ? (
            <DropdownMenu.Item
              onSelect={() => onChange("")}
              className={cn(
                "flex h-9 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm font-semibold text-slate-700 outline-none transition hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900",
                !value && "bg-emerald-50 text-emerald-900",
              )}
            >
              <span>{`All ${label}`}</span>
              {!value ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
            </DropdownMenu.Item>
          ) : null}
          {options.map((option) => {
            const active = value === option.value;

            return (
              <DropdownMenu.Item
                key={option.value}
                onSelect={() => onChange(option.value)}
                disabled={!option.value}
                className={cn(
                  "flex h-9 cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-sm font-semibold text-slate-700 outline-none transition hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900 disabled:pointer-events-none disabled:opacity-50",
                  active && "bg-emerald-50 text-emerald-900",
                )}
              >
                <span>{option.label}</span>
                {active ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

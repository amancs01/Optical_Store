import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSalePrice(product: { price: number; discount_price?: number | null }) {
  return product.discount_price && product.discount_price > 0
    ? product.discount_price
    : product.price;
}

export function getAvailabilityStatus(stock: number) {
  if (stock <= 0) return { label: "Out of stock", className: "bg-rose-50 text-rose-700" };
  if (stock <= 3) return { label: "Limited stock", className: "bg-amber-50 text-amber-700" };
  return { label: "Available", className: "bg-emerald-50 text-emerald-700" };
}

export function getAvailabilityDetailStatus(stock: number) {
  const status = getAvailabilityStatus(stock);
  return {
    ...status,
    label: stock > 3 ? "Available in store" : status.label,
  };
}

export function generateOrderNumber() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `OS-${stamp}-${suffix}`;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FREE_DELIVERY_THRESHOLD, OUTSIDE_VALLEY_DELIVERY_CHARGE } from "@/lib/constants";

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

export function isInsideKathmanduValley(location?: { city?: string | null; delivery_address?: string | null } | string | null) {
  const value = typeof location === "string"
    ? location
    : [location?.city, location?.delivery_address].filter(Boolean).join(" ");
  const normalized = value.toLowerCase();

  return ["kathmandu", "ktm", "lalitpur", "patan", "bhaktapur", "kirtipur"].some((place) =>
    normalized.includes(place),
  );
}

export function getDeliverySummary(
  subtotal: number,
  location?: { city?: string | null; delivery_address?: string | null } | string | null,
) {
  const locationKnown = Boolean(typeof location === "string" ? location.trim() : location?.city || location?.delivery_address);
  const insideValley = locationKnown && isInsideKathmanduValley(location);
  const qualifiesForFreeDelivery = insideValley || subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = !locationKnown ? null : qualifiesForFreeDelivery ? 0 : OUTSIDE_VALLEY_DELIVERY_CHARGE;
  const amountUntilFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return {
    deliveryFee,
    total: subtotal + (deliveryFee || 0),
    qualifiesForFreeDelivery,
    insideValley,
    locationKnown,
    amountUntilFreeDelivery,
  };
}

export function generateOrderNumber() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `OS-${stamp}-${suffix}`;
}

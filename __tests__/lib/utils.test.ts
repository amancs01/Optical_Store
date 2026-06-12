import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  slugify,
  getSalePrice,
  getAvailabilityStatus,
  getAvailabilityDetailStatus,
  generateOrderNumber,
  getDeliverySummary,
  isInsideKathmanduValley,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves tailwind conflicts", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("handles undefined and null", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});

describe("formatCurrency", () => {
  it("formats a number as NPR", () => {
    const result = formatCurrency(3200);
    expect(result).toContain("3,200");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toContain("0");
  });

  it("handles null", () => {
    expect(formatCurrency(null)).toContain("0");
  });

  it("handles undefined", () => {
    expect(formatCurrency(undefined)).toContain("0");
  });

  it("rounds to zero decimal places", () => {
    const result = formatCurrency(99.9);
    expect(result).not.toContain(".");
  });
});

describe("slugify", () => {
  it("converts to lowercase", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(slugify("a b c")).toBe("a-b-c");
  });

  it("removes non-alphanumeric characters", () => {
    expect(slugify("hello! world?")).toBe("hello-world");
  });

  it("trims leading/trailing hyphens", () => {
    expect(slugify("--hello--")).toBe("hello");
  });

  it("trims whitespace", () => {
    expect(slugify("  hello  ")).toBe("hello");
  });

  it("handles empty string", () => {
    expect(slugify("")).toBe("");
  });
});

describe("getSalePrice", () => {
  it("returns discount_price when valid", () => {
    expect(getSalePrice({ price: 100, discount_price: 80 })).toBe(80);
  });

  it("returns price when discount_price is null", () => {
    expect(getSalePrice({ price: 100, discount_price: null })).toBe(100);
  });

  it("returns price when discount_price is undefined", () => {
    expect(getSalePrice({ price: 100 })).toBe(100);
  });

  it("returns price when discount_price is zero", () => {
    expect(getSalePrice({ price: 100, discount_price: 0 })).toBe(100);
  });

  it("returns price when discount_price is negative", () => {
    expect(getSalePrice({ price: 100, discount_price: -10 })).toBe(100);
  });
});

describe("getAvailabilityStatus", () => {
  it("returns out of stock for zero", () => {
    expect(getAvailabilityStatus(0).label).toBe("Out of stock");
    expect(getAvailabilityStatus(0).className).toContain("rose");
  });

  it("returns out of stock for negative", () => {
    expect(getAvailabilityStatus(-1).label).toBe("Out of stock");
  });

  it("returns limited stock for 1-3", () => {
    expect(getAvailabilityStatus(1).label).toBe("Limited stock");
    expect(getAvailabilityStatus(2).label).toBe("Limited stock");
    expect(getAvailabilityStatus(3).label).toBe("Limited stock");
    expect(getAvailabilityStatus(1).className).toContain("amber");
  });

  it("returns available for > 3", () => {
    expect(getAvailabilityStatus(4).label).toBe("Available");
    expect(getAvailabilityStatus(100).label).toBe("Available");
    expect(getAvailabilityStatus(4).className).toContain("emerald");
  });
});

describe("getAvailabilityDetailStatus", () => {
  it('returns "Available in store" for stock > 3', () => {
    expect(getAvailabilityDetailStatus(10).label).toBe("Available in store");
  });

  it("delegates to getAvailabilityStatus for low stock", () => {
    expect(getAvailabilityDetailStatus(0).label).toBe("Out of stock");
    expect(getAvailabilityDetailStatus(2).label).toBe("Limited stock");
  });
});

describe("generateOrderNumber", () => {
  it("starts with OS-", () => {
    expect(generateOrderNumber()).toMatch(/^OS-/);
  });

  it("contains date in YYYYMMDD format", () => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    expect(generateOrderNumber()).toContain(today);
  });

  it("ends with a 4-digit suffix", () => {
    expect(generateOrderNumber()).toMatch(/OS-\d{8}-\d{4}$/);
  });

  it("generates unique numbers", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });
});

describe("delivery summary", () => {
  it("keeps delivery free inside Kathmandu Valley below the threshold", () => {
    const delivery = getDeliverySummary(1000, { city: "Kathmandu", delivery_address: "New Road" });
    expect(delivery.deliveryFee).toBe(0);
    expect(delivery.total).toBe(1000);
    expect(delivery.insideValley).toBe(true);
  });

  it("charges outside valley delivery below the threshold", () => {
    const delivery = getDeliverySummary(1000, { city: "Pokhara", delivery_address: "Lakeside" });
    expect(delivery.deliveryFee).toBe(120);
    expect(delivery.total).toBe(1120);
    expect(delivery.qualifiesForFreeDelivery).toBe(false);
  });

  it("keeps outside valley delivery free at the threshold", () => {
    const delivery = getDeliverySummary(2500, { city: "Pokhara", delivery_address: "Lakeside" });
    expect(delivery.deliveryFee).toBe(0);
    expect(delivery.total).toBe(2500);
    expect(delivery.qualifiesForFreeDelivery).toBe(true);
  });

  it("does not choose a delivery fee when location is unknown", () => {
    const delivery = getDeliverySummary(1000);
    expect(delivery.deliveryFee).toBeNull();
    expect(delivery.total).toBe(1000);
    expect(delivery.locationKnown).toBe(false);
  });

  it("detects Kathmandu Valley cities", () => {
    expect(isInsideKathmanduValley("Lalitpur")).toBe(true);
    expect(isInsideKathmanduValley("Bhaktapur")).toBe(true);
    expect(isInsideKathmanduValley("Pokhara")).toBe(false);
  });
});

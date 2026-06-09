import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, renderHook, act, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/types/product";

const sampleProduct: Product = {
  id: "p1", name: "Test Frame", slug: "test-frame", description: null,
  brand: "Test", category: "Eyeglasses", gender: "Men", frame_type: "Full Rim",
  shape: "Rectangle", material: "Metal", color: "Black",
  price: 5000, discount_price: null, stock_quantity: 10,
  image_url: "/test.jpg", is_active: true, is_featured: false,
  created_at: "2025-01-01T00:00:00Z", updated_at: null,
};

function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

function flushMicrotasks() {
  return act(() => new Promise((r) => window.queueMicrotask(r)));
}

describe("CartProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  describe("useCart hook", () => {
    it("throws when used outside provider", () => {
      expect(() => renderHook(() => useCart())).toThrow("useCart must be used inside CartProvider");
    });
  });

  describe("addProduct", () => {
    it("adds a product to the cart", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe("Test Frame");
    });

    it("increments quantity when same product added twice", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.addProduct(sampleProduct));
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].quantity).toBe(2);
    });

    it("uses sale price when discount exists", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct({ ...sampleProduct, discount_price: 4000 }));
      expect(result.current.items[0].price).toBe(4000);
    });

    it("calculates count as sum of quantities", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.addProduct(sampleProduct));
      expect(result.current.count).toBe(2);
    });
  });

  describe("increment", () => {
    it("increments item quantity", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.increment("p1"));
      expect(result.current.items[0].quantity).toBe(2);
    });
  });

  describe("decrement", () => {
    it("decrements item quantity", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.decrement("p1"));
      expect(result.current.items[0].quantity).toBe(1);
    });

    it("removes item when quantity reaches 0", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.decrement("p1"));
      expect(result.current.items).toHaveLength(0);
    });
  });

  describe("remove", () => {
    it("removes item from cart", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.remove("p1"));
      expect(result.current.items).toHaveLength(0);
    });
  });

  describe("clear", () => {
    it("clears all items", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.addProduct({ ...sampleProduct, id: "p2", name: "Second" }));
      act(() => result.current.clear());
      expect(result.current.items).toHaveLength(0);
      expect(result.current.count).toBe(0);
    });
  });

  describe("subtotal", () => {
    it("calculates subtotal from items", () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      act(() => result.current.addProduct({ ...sampleProduct, id: "p2", name: "Second", price: 3000 }));
      expect(result.current.subtotal).toBe(8000);
    });

    it("subtotal is 0 for empty cart", () => {
      const { result } = renderCart();
      expect(result.current.subtotal).toBe(0);
    });
  });

  describe("hydrated", () => {
    it("starts as false", () => {
      const { result } = renderCart();
      expect(result.current.hydrated).toBe(false);
    });

    it("becomes true after mount", async () => {
      const { result } = renderCart();
      await flushMicrotasks();
      expect(result.current.hydrated).toBe(true);
    });
  });

  describe("persistence", () => {
    it("persists items to localStorage", async () => {
      const { result } = renderCart();
      act(() => result.current.addProduct(sampleProduct));
      await flushMicrotasks();
      const saved = JSON.parse(window.localStorage.getItem("optical-store-cart") || "[]");
      expect(saved).toHaveLength(1);
      expect(saved[0].productId).toBe("p1");
    });

    it("restores items from localStorage on mount", async () => {
      window.localStorage.setItem("optical-store-cart", JSON.stringify([{
        productId: "p1", name: "Saved", slug: "saved", imageUrl: null, price: 5000, quantity: 2,
      }]));
      const { result } = renderCart();
      await flushMicrotasks();
      expect(result.current.items).toHaveLength(1);
      expect(result.current.items[0].name).toBe("Saved");
    });

    it("handles corrupted localStorage gracefully", () => {
      window.localStorage.setItem("optical-store-cart", "not-json");
      const { result } = renderCart();
      expect(result.current.items).toEqual([]);
    });
  });
});

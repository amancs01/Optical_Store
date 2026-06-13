import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFrom, mockChain, mockRpc } = vi.hoisted(() => {
  const chain: Record<string, any> = {
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  return {
    mockFrom: vi.fn(() => chain),
    mockChain: chain,
    mockRpc: vi.fn(),
  };
});

vi.mock("@/lib/supabase/client", () => ({
  requireSupabase: () => ({ from: mockFrom, rpc: mockRpc, auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) } }),
  isSupabaseConfigured: true,
  supabase: {},
}));

vi.mock("@/services/productImageService", () => ({
  getProductImages: vi.fn().mockResolvedValue([]),
}));

const fakeProduct = {
  id: "1", name: "Test Frame", slug: "test-frame", description: null,
  brand: "Titan", category: "Eyeglasses", gender: "Men", frame_type: "Full Rim",
  shape: "Rectangle", material: "Metal", color: "Black",
  price: 5000, discount_price: null, stock_quantity: 10,
  image_url: "/test.jpg", is_active: true, is_featured: false,
  created_at: "2025-01-01T00:00:00Z", updated_at: null,
};

import {
  getActiveProducts,
  getFeaturedProducts,
  getProductBySlug,
  getSimilarProducts,
  getAllProductsForAdmin,
  getProductById,
  saveProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productService";

describe("productService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("getActiveProducts", () => {
    it("returns active products", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.order.mockResolvedValue({ data: [fakeProduct], error: null });
      const result = await getActiveProducts();
      expect(result).toEqual([fakeProduct]);
      expect(mockFrom).toHaveBeenCalledWith("products");
      expect(mockChain.eq).toHaveBeenCalledWith("is_active", true);
    });

    it("throws on error", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.order.mockResolvedValue({ data: null, error: new Error("DB error") });
      await expect(getActiveProducts()).rejects.toThrow("DB error");
    });
  });

  describe("getFeaturedProducts", () => {
    it("returns featured products with default limit", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.order.mockReturnThis();
      mockChain.limit.mockResolvedValue({ data: [fakeProduct], error: null });
      const result = await getFeaturedProducts();
      expect(result).toHaveLength(1);
      expect(mockChain.limit).toHaveBeenCalledWith(10);
    });

    it("respects custom limit", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.order.mockReturnThis();
      mockChain.limit.mockResolvedValue({ data: [], error: null });
      await getFeaturedProducts(5);
      expect(mockChain.limit).toHaveBeenCalledWith(5);
    });
  });

  describe("getProductBySlug", () => {
    it("returns a product by slug", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: fakeProduct, error: null });
      const result = await getProductBySlug("test-frame");
      expect(result).toEqual({ ...fakeProduct, images: [] });
    });
  });

  describe("getSimilarProducts", () => {
    it("returns similar products excluding current", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.neq.mockReturnThis();
      mockChain.limit.mockResolvedValue({ data: [fakeProduct], error: null });
      const result = await getSimilarProducts("Eyeglasses", "999");
      expect(result).toHaveLength(1);
      expect(mockChain.neq).toHaveBeenCalledWith("id", "999");
    });

    it("returns empty array when category is null", async () => {
      const result = await getSimilarProducts(null, "1");
      expect(result).toEqual([]);
    });
  });

  describe("getAllProductsForAdmin", () => {
    it("returns all products including inactive", async () => {
      mockChain.select.mockReturnThis();
      mockChain.order.mockResolvedValue({ data: [fakeProduct, { ...fakeProduct, id: "2", is_active: false }], error: null });
      const result = await getAllProductsForAdmin();
      expect(result).toHaveLength(2);
    });
  });

  describe("getProductById", () => {
    it("returns product by id", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: fakeProduct, error: null });
      const result = await getProductById("1");
      expect(result).toEqual({ ...fakeProduct, images: [] });
    });
  });

  describe("saveProduct", () => {
    it("inserts a new product", async () => {
      mockChain.insert.mockReturnThis();
      mockChain.select.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: fakeProduct, error: null });
      const result = await saveProduct({ name: "New Frame", price: 3000 });
      expect(result).toEqual(fakeProduct);
      expect(mockChain.insert).toHaveBeenCalled();
    });

    it("generates slug from name if not provided", async () => {
      mockChain.insert.mockReturnThis();
      mockChain.select.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: fakeProduct, error: null });
      await saveProduct({ name: "New Product" });
      const payload = mockChain.insert.mock.calls[0][0];
      expect(payload.slug).toContain("new-product");
    });
  });

  describe("updateProduct", () => {
    it("updates an existing product", async () => {
      mockChain.update.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.select.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: fakeProduct, error: null });
      const result = await updateProduct("1", { price: 6000 });
      expect(result).toEqual(fakeProduct);
      expect(mockChain.update).toHaveBeenCalled();
    });
  });

  describe("deleteProduct", () => {
    it("archives a product by id", async () => {
      mockChain.update.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.select.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: { ...fakeProduct, is_active: false }, error: null });

      await expect(deleteProduct("1")).resolves.toEqual({ archived: true, data: { ...fakeProduct, is_active: false } });
      expect(mockFrom).toHaveBeenCalledWith("products");
      expect(mockChain.update).toHaveBeenCalledWith(expect.objectContaining({ is_active: false }));
      expect(mockChain.eq).toHaveBeenCalledWith("id", "1");
      expect(mockChain.delete).not.toHaveBeenCalled();
    });

    it("throws on archive errors", async () => {
      mockChain.update.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.select.mockReturnThis();
      mockChain.single.mockResolvedValue({ data: null, error: new Error("Archive failed") });

      await expect(deleteProduct("1")).rejects.toThrow("Archive failed");
    });
  });
});

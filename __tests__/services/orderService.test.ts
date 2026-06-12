import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFrom, mockChain, mockRpc, mockGetUser } = vi.hoisted(() => {
  const chain: Record<string, any> = {
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return {
    mockFrom: vi.fn(() => chain),
    mockChain: chain,
    mockRpc: vi.fn(),
    mockGetUser: vi.fn(),
  };
});

vi.mock("@/lib/supabase/client", () => ({
  requireSupabase: () => ({ from: mockFrom, rpc: mockRpc, auth: { getUser: mockGetUser } }),
  supabase: { from: mockFrom, rpc: mockRpc, auth: { getUser: mockGetUser } },
  isSupabaseConfigured: true,
}));

const fakeOrder = {
  id: "o1", user_id: "u1", order_number: "OS-20250101-1234",
  customer_name: "John", customer_phone: "9800000000", customer_email: null,
  city: "Kathmandu", delivery_address: "Street", payment_method: "Cash on Delivery",
  payment_status: "pending", order_status: "pending",
  subtotal: 5000, delivery_fee: 0, total_amount: 5000,
  notes: null, created_at: "2025-01-01T00:00:00Z", updated_at: null,
};

import { createOrder, trackOrder, getOrders, getCustomerOrders, getCustomerOrderByNumber, updateOrderStatus } from "@/services/orderService";

describe("orderService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("createOrder", () => {
    it("creates an order with items", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      mockChain.single.mockResolvedValue({ data: fakeOrder, error: null });
      const items = [{ productId: "p1", name: "Frame", slug: "f", imageUrl: null, price: 5000, quantity: 1 }];
      const input = { customer_name: "John", customer_phone: "9800000000", delivery_address: "Street" };
      const result = await createOrder(input, items);
      expect(result).toEqual(fakeOrder);
    });

    it("throws if order insert fails", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      mockChain.single.mockResolvedValue({ data: null, error: new Error("Insert failed") });
      const items = [{ productId: "p1", name: "Frame", slug: "f", imageUrl: null, price: 5000, quantity: 1 }];
      const input = { customer_name: "John", customer_phone: "9800000000", delivery_address: "Street" };
      await expect(createOrder(input, items)).rejects.toThrow("Insert failed");
    });

    it("generates order number in correct format", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      mockChain.single.mockResolvedValue({ data: fakeOrder, error: null });
      const items = [{ productId: "p1", name: "Frame", slug: "f", imageUrl: null, price: 5000, quantity: 1 }];
      const input = { customer_name: "John", customer_phone: "9800000000", city: "Pokhara", delivery_address: "Street" };
      const result = await createOrder(input, items);
      expect(result.order_number).toMatch(/^OS-\d{8}-\d{4}$/);
    });

    it("keeps delivery free inside Kathmandu Valley below the threshold", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      mockChain.single.mockResolvedValue({ data: fakeOrder, error: null });
      const items = [{ productId: "p1", name: "Frame", slug: "f", imageUrl: null, price: 1000, quantity: 1 }];
      const input = { customer_name: "John", customer_phone: "9800000000", city: "Kathmandu", delivery_address: "Street" };
      await createOrder(input, items);
      const payload = mockChain.insert.mock.calls[0][0];
      expect(payload.subtotal).toBe(1000);
      expect(payload.delivery_fee).toBe(0);
      expect(payload.total_amount).toBe(1000);
    });

    it("adds delivery charge outside Kathmandu Valley below the threshold", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      mockChain.single.mockResolvedValue({ data: fakeOrder, error: null });
      const items = [{ productId: "p1", name: "Frame", slug: "f", imageUrl: null, price: 1000, quantity: 1 }];
      const input = { customer_name: "John", customer_phone: "9800000000", city: "Pokhara", delivery_address: "Street" };
      await createOrder(input, items);
      const payload = mockChain.insert.mock.calls[0][0];
      expect(payload.subtotal).toBe(1000);
      expect(payload.delivery_fee).toBe(120);
      expect(payload.total_amount).toBe(1120);
    });

    it("keeps delivery free when subtotal reaches threshold", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "u1" } } });
      mockChain.single.mockResolvedValue({ data: fakeOrder, error: null });
      const items = [{ productId: "p1", name: "Frame", slug: "f", imageUrl: null, price: 2500, quantity: 1 }];
      const input = { customer_name: "John", customer_phone: "9800000000", delivery_address: "Street" };
      await createOrder(input, items);
      const payload = mockChain.insert.mock.calls[0][0];
      expect(payload.subtotal).toBe(2500);
      expect(payload.delivery_fee).toBe(0);
      expect(payload.total_amount).toBe(2500);
    });
  });

  describe("trackOrder", () => {
    it("returns order when found", async () => {
      mockRpc.mockResolvedValue({ data: [fakeOrder], error: null });
      const result = await trackOrder("OS-20250101-1234");
      expect(result).toEqual(fakeOrder);
      expect(mockRpc).toHaveBeenCalledWith("track_order", { search_query: "OS-20250101-1234" });
    });

    it("returns null when not found", async () => {
      mockRpc.mockResolvedValue({ data: [], error: null });
      const result = await trackOrder("invalid");
      expect(result).toBeNull();
    });
  });

  describe("getOrders", () => {
    it("returns all orders with items", async () => {
      mockChain.select.mockReturnThis();
      mockChain.order.mockResolvedValue({ data: [fakeOrder], error: null });
      const result = await getOrders();
      expect(result).toHaveLength(1);
      expect(mockChain.select).toHaveBeenCalledWith("*, order_items(*, products(id, name, image_url))");
    });
  });

  describe("getCustomerOrders", () => {
    it("returns customer orders filtered by user_id", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.order.mockResolvedValue({ data: [fakeOrder], error: null });
      const result = await getCustomerOrders("u1");
      expect(mockChain.eq).toHaveBeenCalledWith("user_id", "u1");
    });
  });

  describe("getCustomerOrderByNumber", () => {
    it("returns order by user id and order number", async () => {
      mockChain.select.mockReturnThis();
      mockChain.eq.mockReturnThis();
      mockChain.maybeSingle.mockResolvedValue({ data: fakeOrder, error: null });
      const result = await getCustomerOrderByNumber("u1", "OS-1234");
      expect(result).toEqual(fakeOrder);
    });
  });

  describe("updateOrderStatus", () => {
    it("updates order status", async () => {
      mockChain.update.mockReturnThis();
      mockChain.eq.mockResolvedValue({ error: null });
      await expect(updateOrderStatus("o1", "shipped")).resolves.toBeUndefined();
    });
  });
});

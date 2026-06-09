import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFrom, mockChain } = vi.hoisted(() => {
  const chain: Record<string, any> = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
  return { mockFrom: vi.fn(() => chain), mockChain: chain };
});

vi.mock("@/lib/supabase/client", () => ({
  requireSupabase: () => ({ from: mockFrom }),
  isSupabaseConfigured: true,
  supabase: {},
}));

const fakeBooking = {
  id: "b1", name: "Jane", phone: "9800000000", branch: null,
  booking_date: "2025-06-15", booking_time: "14:00",
  message: null, status: "pending", created_at: "2025-01-01T00:00:00Z",
};

import { createBooking, getAdminBookings, updateBookingStatus } from "@/services/bookingService";

describe("bookingService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("createBooking", () => {
    it("creates a new booking", async () => {
      mockChain.single.mockResolvedValue({ data: fakeBooking, error: null });
      const result = await createBooking({ name: "Jane", phone: "9800000000" });
      expect(result).toEqual(fakeBooking);
    });

    it("throws on error", async () => {
      mockChain.single.mockResolvedValue({ data: null, error: new Error("Insert failed") });
      await expect(createBooking({ name: "J", phone: "9" })).rejects.toThrow("Insert failed");
    });

    it("passes optional fields", async () => {
      mockChain.single.mockResolvedValue({ data: fakeBooking, error: null });
      await createBooking({ name: "J", phone: "9", branch: "Branch A", booking_date: "2025-06-15", booking_time: "14:00", message: "Test" });
      const payload = mockChain.insert.mock.calls[0][0];
      expect(payload.branch).toBe("Branch A");
      expect(payload.message).toBe("Test");
    });
  });

  describe("getAdminBookings", () => {
    it("returns all bookings ordered by date", async () => {
      mockChain.order.mockResolvedValue({ data: [fakeBooking], error: null });
      const result = await getAdminBookings();
      expect(result).toHaveLength(1);
      expect(mockChain.order).toHaveBeenCalledWith("created_at", { ascending: false });
    });

    it("returns empty array when no bookings", async () => {
      mockChain.order.mockResolvedValue({ data: [], error: null });
      const result = await getAdminBookings();
      expect(result).toEqual([]);
    });
  });

  describe("updateBookingStatus", () => {
    it("updates booking status", async () => {
      mockChain.eq.mockResolvedValue({ error: null });
      await expect(updateBookingStatus("b1", "confirmed")).resolves.toBeUndefined();
      expect(mockChain.update).toHaveBeenCalledWith({ status: "confirmed" });
    });
  });
});

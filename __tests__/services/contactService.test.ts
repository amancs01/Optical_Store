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

const fakeMessage = {
  id: "m1", name: "Alice", phone: "9800000000", email: null,
  message: "I need help with lenses", status: "unread", created_at: "2025-01-01T00:00:00Z",
};

import { createContactMessage, getAdminMessages, updateMessageStatus } from "@/services/contactService";

describe("contactService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("createContactMessage", () => {
    it("creates a contact message", async () => {
      mockChain.single.mockResolvedValue({ data: fakeMessage, error: null });
      const result = await createContactMessage({ name: "Alice", message: "Help" });
      expect(result).toEqual(fakeMessage);
    });

    it("throws on error", async () => {
      mockChain.single.mockResolvedValue({ data: null, error: new Error("DB error") });
      await expect(createContactMessage({ name: "A", message: "H" })).rejects.toThrow("DB error");
    });

    it("passes optional email and phone", async () => {
      mockChain.single.mockResolvedValue({ data: fakeMessage, error: null });
      await createContactMessage({ name: "A", message: "H", phone: "123", email: "a@b.com" });
      const payload = mockChain.insert.mock.calls[0][0];
      expect(payload.phone).toBe("123");
      expect(payload.email).toBe("a@b.com");
    });
  });

  describe("getAdminMessages", () => {
    it("returns all messages ordered by date", async () => {
      mockChain.order.mockResolvedValue({ data: [fakeMessage], error: null });
      const result = await getAdminMessages();
      expect(result).toHaveLength(1);
    });
  });

  describe("updateMessageStatus", () => {
    it("updates message status", async () => {
      mockChain.eq.mockResolvedValue({ error: null });
      await expect(updateMessageStatus("m1", "read")).resolves.toBeUndefined();
    });
  });
});

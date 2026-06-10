import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSupabaseObj } = vi.hoisted(() => {
  const chain: Record<string, any> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    order: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  };
  return {
    mockSupabaseObj: { from: vi.fn(() => chain), auth: { getUser: vi.fn() } },
  };
});

vi.mock("@/lib/supabase/client", () => ({
  requireSupabase: () => mockSupabaseObj,
  supabase: mockSupabaseObj,
  isSupabaseConfigured: true,
}));

import { getAdminProfileForUser, getCurrentUserRole, isCurrentUserAdmin, requireAdmin, getAdminDashboardStats } from "@/services/adminService";

describe("adminService", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  describe("getAdminProfileForUser", () => {
    it("returns admin profile when found", async () => {
      const profile = { user_id: "u1", email: "admin@test.com", role: "admin" };
      mockSupabaseObj.from().maybeSingle.mockResolvedValue({ data: profile, error: null });
      const result = await getAdminProfileForUser("u1");
      expect(result).toEqual(profile);
    });

    it("returns null when not admin", async () => {
      mockSupabaseObj.from().maybeSingle.mockResolvedValue({ data: null, error: null });
      const result = await getAdminProfileForUser("u1");
      expect(result).toBeNull();
    });
  });

  describe("getCurrentUserRole", () => {
    it("returns non-admin when user not logged in", async () => {
      mockSupabaseObj.auth.getUser.mockResolvedValue({ data: { user: null } });
      const result = await getCurrentUserRole();
      expect(result.user).toBeNull();
      expect(result.isAdmin).toBe(false);
    });

    it("returns admin when user has admin profile", async () => {
      const user = { id: "u1", email: "admin@test.com" };
      mockSupabaseObj.auth.getUser.mockResolvedValue({ data: { user } });
      mockSupabaseObj.from().maybeSingle.mockResolvedValue({ data: { user_id: "u1", email: "admin@test.com", role: "admin" }, error: null });
      const result = await getCurrentUserRole();
      expect(result.user).toEqual(user);
      expect(result.isAdmin).toBe(true);
    });
  });

  describe("isCurrentUserAdmin", () => {
    it("returns false when not logged in", async () => {
      mockSupabaseObj.auth.getUser.mockResolvedValue({ data: { user: null } });
      const result = await isCurrentUserAdmin();
      expect(result).toBe(false);
    });
  });

  describe("requireAdmin", () => {
    it("throws when not logged in", async () => {
      mockSupabaseObj.auth.getUser.mockResolvedValue({ data: { user: null } });
      await expect(requireAdmin()).rejects.toThrow("Admin access required");
    });
  });

  describe("getAdminDashboardStats", () => {
    it("returns aggregated dashboard stats", async () => {
      const countResult = { data: null, error: null, count: 5 };
      const thenable = {
        then: (resolve: any) => resolve(countResult),
        eq: vi.fn().mockReturnThis(),
      };
      mockSupabaseObj.from().select.mockReturnValue(thenable);
      const stats = await getAdminDashboardStats();
      expect(stats.products).toBe(5);
      expect(stats.pending).toBe(5);
      expect(stats.bookings).toBe(5);
      expect(stats.messages).toBe(5);
    });
  });
});

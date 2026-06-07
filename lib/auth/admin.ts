"use client";

export {
  getAdminProfileForUser,
  getCurrentUserRole,
  isCurrentUserAdmin,
  requireAdmin,
  type AdminProfile,
  type CurrentUserRole,
} from "@/services/adminService";
export { useAuth as useCurrentUser, useAuth as useAdminStatus } from "@/components/providers/AuthProvider";

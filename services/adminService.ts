import type { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/services/authService";
import { requireSupabase, supabase } from "@/lib/supabase/client";

export type AdminProfile = {
  user_id: string;
  email: string | null;
  role: string | null;
};

export type CurrentUserRole = {
  user: User | null;
  isAdmin: boolean;
  adminProfile: AdminProfile | null;
};

export type AdminDashboardStats = {
  products: number;
  pending: number;
  bookings: number;
  messages: number;
};

export async function getAdminProfileForUser(userId: string): Promise<AdminProfile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id,email,role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return null;
  return (data as AdminProfile | null) || null;
}

export async function getCurrentUserRole(): Promise<CurrentUserRole> {
  const user = await getCurrentUser();
  if (!user) return { user: null, isAdmin: false, adminProfile: null };

  const adminProfile = await getAdminProfileForUser(user.id);
  return {
    user,
    isAdmin: Boolean(adminProfile),
    adminProfile,
  };
}

export async function isCurrentUserAdmin() {
  const { isAdmin } = await getCurrentUserRole();
  return isAdmin;
}

export async function requireAdmin() {
  const role = await getCurrentUserRole();
  if (!role.user || !role.isAdmin) throw new Error("Admin access required.");
  return role;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const client = requireSupabase();

  const [
    products,
    pendingOrders,
    pendingBookings,
    newMessages,
  ] = await Promise.all([
    client.from("products").select("id", { count: "exact", head: true }),
    client.from("orders").select("id", { count: "exact", head: true }).eq("order_status", "pending"),
    client.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending"),
    client.from("contact_messages").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);

  const error = products.error || pendingOrders.error || pendingBookings.error || newMessages.error;
  if (error) throw error;

  return {
    products: products.count || 0,
    pending: pendingOrders.count || 0,
    bookings: pendingBookings.count || 0,
    messages: newMessages.count || 0,
  };
}

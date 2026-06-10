"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DashboardSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { getAdminDashboardStats, type AdminDashboardStats } from "@/services/adminService";
import { useCurrentUser } from "@/lib/auth/admin";

export default function AdminPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({ products: 0, pending: 0, bookings: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useCurrentUser();

  useEffect(() => {
    if (!isAdmin) return;
    getAdminDashboardStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : "Dashboard data could not load."))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">Dashboard</h1>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="mt-5"><StateMessage title="Dashboard could not load" message={error} /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Total products", stats.products],
            ["Pending orders", stats.pending],
            ["Bookings", stats.bookings],
            ["Messages", stats.messages],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-slate-200 bg-white p-5">
              <p className="text-sm font-semibold text-slate-500">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

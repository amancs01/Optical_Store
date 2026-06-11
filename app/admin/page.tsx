"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  const statCards = [
    {
      label: "Total products",
      value: stats.products,
      color: "border-slate-200 bg-white",
      valueColor: "text-slate-950",
      href: "/admin/products",
      hint: "Tap to manage",
    },
    {
      label: "Pending orders",
      value: stats.pending,
      color: stats.pending > 0 ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white",
      valueColor: stats.pending > 0 ? "text-amber-700" : "text-slate-950",
      href: "/admin/orders",
      hint: stats.pending > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "Pending bookings",
      value: stats.bookings,
      color: stats.bookings > 0 ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white",
      valueColor: stats.bookings > 0 ? "text-sky-700" : "text-slate-950",
      href: "/admin/bookings",
      hint: stats.bookings > 0 ? "Needs attention" : "All clear",
    },
    {
      label: "New messages",
      value: stats.messages,
      color: stats.messages > 0 ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-white",
      valueColor: stats.messages > 0 ? "text-rose-700" : "text-slate-950",
      href: "/admin/messages",
      hint: stats.messages > 0 ? "Unread" : "All read",
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Dashboard</h1>
        <button
          onClick={() => { setLoading(true); getAdminDashboardStats().then(setStats).catch((err) => setError(err instanceof Error ? err.message : "Could not reload.")).finally(() => setLoading(false)); }}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95"
          title="Refresh"
        >
          ↻ Refresh
        </button>
      </div>
      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="mt-5"><StateMessage title="Dashboard could not load" message={error} /></div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map(({ label, value, color, valueColor, href, hint }) => (
            <Link key={label} href={href}
              className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md active:scale-95 ${color}`}>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
              <p className={`mt-2 text-4xl font-black ${valueColor}`}>{value}</p>
              <p className="mt-2 text-xs font-semibold text-slate-400">{hint} →</p>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

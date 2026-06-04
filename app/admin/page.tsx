"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StateMessage } from "@/components/ui/StateMessage";
import { getBookings, getContactMessages } from "@/services/bookingService";
import { getOrders } from "@/services/orderService";
import { getAllProductsForAdmin } from "@/services/productService";

export default function AdminPage() {
  const [stats, setStats] = useState({ products: 0, active: 0, pending: 0, bookings: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getAllProductsForAdmin(), getOrders(), getBookings(), getContactMessages()])
      .then(([products, orders, bookings, messages]) =>
        setStats({
          products: products.length,
          active: products.filter((p) => p.is_active).length,
          pending: orders.filter((o) => o.order_status === "pending").length,
          bookings: bookings.filter((b) => b.status === "pending").length,
          messages: messages.filter((m) => m.status === "new").length,
        }),
      )
      .catch((err) => setError(err instanceof Error ? err.message : "Dashboard data could not load."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-black">Dashboard</h1>
      {loading ? <p className="mt-5 text-sm text-slate-600">Loading dashboard...</p> : null}
      {error ? <div className="mt-5"><StateMessage title="Dashboard could not load" message={error} /></div> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Total products", stats.products],
          ["Active products", stats.active],
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
    </AdminLayout>
  );
}

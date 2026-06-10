"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { StateMessage } from "@/components/ui/StateMessage";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/orderStatus";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";
import { useAdminStatus } from "@/lib/auth/admin";

const PAGE_SIZE = 5;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { order_items?: OrderItem[] })[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const { isAdmin } = useAdminStatus();

  function load() {
    setLoading(true);
    setError("");
    return getOrders()
      .then(setOrders)
      .catch((err) => {
        setOrders([]);
        setError(err instanceof Error ? err.message : "Orders could not load.");
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!isAdmin) return;
    window.queueMicrotask(load);
  }, [isAdmin]);
  const visible = filter ? orders.filter((order) => order.order_status === filter) : orders;
  const totalPages = Math.ceil(visible.length / PAGE_SIZE);
  const paginated = visible.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Orders</h1>
        <Select value={filter} onValueChange={(v) => { setFilter(v); setPage(1); }} placeholder="All statuses" items={ORDER_STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} className="w-44" />
      </div>
      {!loading && !error && orders.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total orders", value: orders.length },
            { label: "Pending", value: orders.filter((order) => order.order_status === "pending").length },
            { label: "Confirmed", value: orders.filter((order) => order.order_status === "confirmed").length },
            { label: "Revenue", value: formatCurrency(orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)) },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-md border border-slate-200 bg-white p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
              <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
            </div>
          ))}
        </div>
      )}
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Orders could not load" message={error} /></div> : null}
      {!loading && !error && !visible.length ? <div className="mt-5"><StateMessage title="No orders found" message="New checkout orders will appear here." /></div> : null}
      <div className="mt-5 grid gap-4">
        {paginated.map((order) => (
          <div key={order.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="font-black">{order.order_number}</h2>
                <p className="text-sm text-slate-600">{order.customer_name} - {order.customer_phone}</p>
                {order.customer_email ? <p className="text-sm text-slate-600">{order.customer_email}</p> : null}
                <p className="text-sm text-slate-600">{order.delivery_address}{order.city ? `, ${order.city}` : ""}</p>
                <p className="mt-1 text-xs font-semibold uppercase text-slate-500">
                  {new Date(order.created_at).toLocaleString("en-NP", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
              <div className="w-full space-y-2 sm:w-auto sm:text-right">
                <p className="font-black">{formatCurrency(order.total_amount)}</p>
                <p className="text-xs font-semibold text-slate-500">{order.payment_method} · {formatOrderStatus(order.payment_status)}</p>
                <Select
                  ariaLabel={`Update status for ${order.order_number}`}
                  value={order.order_status}
                  disabled={!!updating[order.id]}
                  onValueChange={(newStatus) => {
                    setUpdating((prev) => ({ ...prev, [order.id]: true }));
                    updateOrderStatus(order.id, newStatus).catch(() => null).then(() => load()).finally(() => setUpdating((prev) => ({ ...prev, [order.id]: false })));
                  }}
                  items={ORDER_STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
                  className={updating[order.id] ? "opacity-60" : ""}
                />
              </div>
            </div>
            <div className="mt-3 overflow-hidden rounded-md border border-slate-200">
              <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-10 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase text-slate-500 sm:grid">
                <span>Item</span>
                <span>Qty</span>
                <span>Unit</span>
                <span>Total</span>
              </div>
              {(order.order_items || []).length ? (
                <div className="divide-y divide-slate-200">
                  {(order.order_items || []).map((item) => (
                    <div key={item.id} className="grid gap-1 px-3 py-2 text-sm sm:grid-cols-[1fr_auto_auto_auto] sm:gap-3">
                      <span className="font-semibold text-slate-800">{item.product_name}</span>
                      <span className="text-slate-600 sm:text-slate-950">Qty {item.quantity}</span>
                      <span className="text-slate-600 sm:text-slate-950">{formatCurrency(item.unit_price)}</span>
                      <span className="font-bold">{formatCurrency(item.total_price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="p-3 text-sm text-slate-600">No order items are attached to this order.</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </AdminLayout>
  );
}

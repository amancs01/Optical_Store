"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { formatOrderStatus } from "@/lib/orderStatus";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { order_items?: OrderItem[] })[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<Record<string, boolean>>({});

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
    window.queueMicrotask(load);
  }, []);
  const visible = filter ? orders.filter((order) => order.order_status === filter) : orders;

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black">Orders</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
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
        {visible.map((order) => (
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
              <div className="w-full sm:w-auto sm:text-right">
                <p className="font-black">{formatCurrency(order.total_amount)}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{order.payment_method} · {formatOrderStatus(order.payment_status)}</p>
                <select
                  aria-label={`Update status for ${order.order_number}`}
                  value={order.order_status}
                  disabled={!!updating[order.id]}
                  onChange={async (e) => {
                    const newStatus = e.target.value;
                    setUpdating((prev) => ({ ...prev, [order.id]: true }));
                    await updateOrderStatus(order.id, newStatus).catch(() => null);
                    await load();
                    setUpdating((prev) => ({ ...prev, [order.id]: false }));
                  }}
                  className={`mt-2 h-11 w-full rounded-md border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto ${updating[order.id] ? "opacity-60" : ""}`}
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 rounded-md border border-slate-200">
              <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold uppercase text-slate-500">
                <span>Item</span>
                <span>Qty</span>
                <span>Unit</span>
                <span>Total</span>
              </div>
              {(order.order_items || []).length ? (
                <div className="divide-y divide-slate-200">
                  {(order.order_items || []).map((item) => (
                    <div key={item.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-3 py-2 text-sm">
                      <span className="font-semibold text-slate-800">{item.product_name}</span>
                      <span>{item.quantity}</span>
                      <span>{formatCurrency(item.unit_price)}</span>
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
    </AdminLayout>
  );
}

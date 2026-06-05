"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { getOrders, updateOrderStatus } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { order_items?: OrderItem[] })[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    setError("");
    getOrders()
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
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Orders could not load" message={error} /></div> : null}
      {!loading && !error && !visible.length ? <div className="mt-5"><StateMessage title="No orders found" message="New checkout orders will appear here." /></div> : null}
      <div className="mt-5 grid gap-4">
        {visible.map((order) => (
          <div key={order.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div><h2 className="font-black">{order.order_number}</h2><p className="text-sm text-slate-600">{order.customer_name} - {order.customer_phone}</p><p className="text-sm text-slate-600">{order.delivery_address}</p></div>
              <div className="w-full sm:w-auto sm:text-right"><p className="font-black">{formatCurrency(order.total_amount)}</p><select aria-label={`Update status for ${order.order_number}`} value={order.order_status} onChange={(e) => updateOrderStatus(order.id, e.target.value).then(load)} className="mt-2 h-11 w-full rounded-md border border-slate-200 px-3 py-2 text-sm sm:w-auto">{ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
            </div>
            <div className="mt-3 border-t border-slate-200 pt-3 text-sm text-slate-600">
              {(order.order_items || []).map((item) => <p key={item.id}>{item.product_name} x {item.quantity}</p>)}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

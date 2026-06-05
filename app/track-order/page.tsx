"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatOrderStatus } from "@/lib/orderStatus";
import { formatCurrency } from "@/lib/utils";
import { trackOrder } from "@/services/orderService";
import type { Order, OrderItem } from "@/types/order";

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<(Order & { order_items?: OrderItem[] }) | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setOrder(null);
    try {
      const result = await trackOrder(query.trim());
      if (!result) setMessage("No matching order found.");
      setOrder(result);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not track order.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
      <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Titan Opticals</p>
      <h1 className="mt-1 text-3xl font-black sm:text-4xl">Track order</h1>
      <form onSubmit={submit} className="mt-5 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <input value={query} onChange={(e) => setQuery(e.target.value)} required placeholder="Order number or phone number" className="min-h-11 flex-1 rounded-md border border-slate-200 px-3" />
        <Button disabled={loading || !isSupabaseConfigured}>{loading ? "Checking..." : "Track"}</Button>
      </form>
      {!isSupabaseConfigured ? <div className="mt-6"><StateMessage title="Supabase is not configured" message="Add Supabase variables before tracking orders." /></div> : null}
      {message ? <div className="mt-6"><StateMessage title="Order status" message={message} /></div> : null}
      {order ? (
        <div className="mt-6 rounded-md border border-slate-200 bg-[#fffaf2]/60 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Order number</p>
              <h2 className="mt-1 text-2xl font-black">{order.order_number}</h2>
              <div className={`mt-3 inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${order.order_status === "cancelled" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
                Current status: {formatOrderStatus(order.order_status)}
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-slate-500">Total</p>
              <p className="mt-1 text-xl font-black">{formatCurrency(order.total_amount)}</p>
              {order.created_at ? (
                <p className="mt-2 text-sm text-slate-500">
                  Ordered on {new Date(order.created_at).toLocaleDateString("en-NP", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              ) : null}
            </div>
          </div>
          <OrderStatusTimeline orderStatus={order.order_status} />
          <p className="mt-5 text-sm text-slate-600">Delivery address: {order.delivery_address}</p>
        </div>
      ) : null}
    </div>
  );
}

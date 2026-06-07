"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderStatusTimeline } from "@/components/order/OrderStatusTimeline";
import { LinkButton } from "@/components/ui/Button";
import { ProductDetailSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { formatOrderStatus } from "@/lib/orderStatus";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { getCustomerOrderByNumber } from "@/services/orderService";
import { useCurrentUser } from "@/lib/auth/admin";
import type { Order, OrderItem } from "@/types/order";

export default function CustomerOrderDetailPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const router = useRouter();
  const [order, setOrder] = useState<(Order & { order_items?: OrderItem[] }) | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useCurrentUser();

  useEffect(() => {
    if (authLoading || !isSupabaseConfigured) return;
    if (!user) {
      router.replace("/login?redirectTo=/account/orders");
      return;
    }

    let active = true;
    params
      .then(({ orderNumber }) => getCustomerOrderByNumber(user.id, orderNumber))
      .then((customerOrder) => {
        if (!active) return;
        setOrder(customerOrder);
        if (!customerOrder) setError("We could not find this order in your account.");
      })
      .catch(() => {
        if (active) setError("We could not load this order right now. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, params, router, user]);

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables to view order details." /></div>;
  if (authLoading || loading) return <ProductDetailSkeleton />;
  if (!user) return <p className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-600">Redirecting to login...</p>;
  if (error || !order) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Order unavailable" message={error || "This order is not available."} /><LinkButton href="/account/orders" className="mt-5">Back to my orders</LinkButton></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/account/orders" className="text-sm font-bold text-emerald-700">Back to my orders</Link>
      <div className="mt-5 rounded-md border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Order number</p>
            <h1 className="mt-1 text-3xl font-black">{order.order_number}</h1>
            <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-sm font-bold ${order.order_status === "cancelled" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>
              Current status: {formatOrderStatus(order.order_status)}
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-black">{formatCurrency(order.total_amount)}</p>
            <p className="mt-2 text-sm text-slate-500">Ordered on {new Date(order.created_at).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}</p>
          </div>
        </div>
        <OrderStatusTimeline orderStatus={order.order_status} />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <section>
            <h2 className="text-lg font-bold">Items</h2>
            <div className="mt-3 grid gap-3">
              {(order.order_items || []).length ? (
                order.order_items?.map((item) => (
                  <div key={item.id} className="flex justify-between gap-4 rounded-md border border-slate-200 p-3 text-sm">
                    <div>
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-slate-500">Qty {item.quantity} x {formatCurrency(item.unit_price)}</p>
                    </div>
                    <p className="font-bold">{formatCurrency(item.total_price)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">No order items are available for this order.</p>
              )}
            </div>
          </section>
          <aside className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-bold">Delivery</h2>
            <p className="mt-2 text-sm text-slate-600">{order.delivery_address}</p>
            {order.city ? <p className="mt-1 text-sm text-slate-600">{order.city}</p> : null}
            <div className="mt-4 border-t border-slate-200 pt-4 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><strong>{formatCurrency(order.subtotal)}</strong></div>
              <div className="mt-2 flex justify-between"><span>Delivery</span><strong>{formatCurrency(order.delivery_fee)}</strong></div>
              <div className="mt-3 flex justify-between text-base"><span>Total</span><strong>{formatCurrency(order.total_amount)}</strong></div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

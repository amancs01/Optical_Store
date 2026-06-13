"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { formatOrderStatus } from "@/lib/orderStatus";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { getCustomerOrders } from "@/services/orderService";
import { useCurrentUser } from "@/lib/auth/admin";
import type { Order } from "@/types/order";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useCurrentUser();

  useEffect(() => {
    if (authLoading || !isSupabaseConfigured) return;
    if (!user) {
      router.replace("/login?returnTo=/account/orders");
      return;
    }

    let active = true;
    getCustomerOrders(user.id)
      .then((customerOrders) => {
        if (active) setOrders(customerOrders);
      })
      .catch(() => {
        if (active) setError("We could not load your orders right now. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [authLoading, router, user]);

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-4xl px-4 py-7"><StateMessage title="Supabase is not configured" message="Add Supabase variables to view orders." /></div>;
  if (authLoading || loading) return <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8"><ListSkeleton rows={4} /></div>;
  if (!user) return <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8"><ListSkeleton rows={4} /></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Account</p>
          <h1 className="mt-1 text-3xl font-black">My Orders</h1>
        </div>
        <LinkButton href="/products" variant="secondary">Continue shopping</LinkButton>
      </div>
      {error ? <div className="mt-6"><StateMessage title="Orders could not load" message={error} /></div> : null}
      {!error && !orders.length ? (
        <div className="mt-6">
          <StateMessage title="No orders yet" message="Orders placed while signed in will appear here." />
        </div>
      ) : null}
      {orders.length ? (
        <div className="mt-6 grid gap-3 md:hidden">
          {orders.map((order) => (
            <Link key={order.id} href={`/account/orders/${order.order_number}`} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-950">{order.order_number}</p>
                  <p className="mt-1 text-xs text-slate-500">{new Date(order.created_at).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{formatOrderStatus(order.order_status)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="font-bold text-slate-950">{formatCurrency(order.total_amount)}</p>
                <span className="text-sm font-bold text-emerald-700">Track</span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
      {orders.length ? (
        <div className="mt-6 hidden overflow-x-auto rounded-md border border-slate-200 bg-white md:block">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-3">Order</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200">
                  <td className="p-3 font-bold">{order.order_number}</td>
                  <td>{new Date(order.created_at).toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{formatOrderStatus(order.order_status)}</span></td>
                  <td className="font-bold">{formatCurrency(order.total_amount)}</td>
                  <td><Link className="font-bold text-emerald-700" href={`/account/orders/${order.order_number}`}>Track</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

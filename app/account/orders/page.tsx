"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { formatOrderStatus } from "@/lib/orderStatus";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { getCustomerOrders } from "@/services/orderService";
import type { Order } from "@/types/order";

export default function MyOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.replace("/login?redirectTo=/account/orders");
        return;
      }

      setUser(data.user);
      try {
        const customerOrders = await getCustomerOrders(data.user.id);
        setOrders(customerOrders);
      } catch (err) {
        console.error("Customer orders failed to load:", err);
        setError("We could not load your orders right now. Please try again.");
      } finally {
        setLoading(false);
      }
    });
  }, [router]);

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-4xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables to view orders." /></div>;
  if (loading) return <p className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-600">Loading orders...</p>;
  if (!user) return <p className="mx-auto max-w-4xl px-4 py-10 text-sm text-slate-600">Redirecting to login...</p>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-bold uppercase text-teal-700">Account</p>
          <h1 className="mt-2 text-3xl font-black">My Orders</h1>
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
        <div className="mt-6 overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
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
                  <td><span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800">{formatOrderStatus(order.order_status)}</span></td>
                  <td className="font-bold">{formatCurrency(order.total_amount)}</td>
                  <td><Link className="font-bold text-teal-700" href={`/account/orders/${order.order_number}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

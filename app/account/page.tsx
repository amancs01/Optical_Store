"use client";

import { useRouter } from "next/navigation";
import { LayoutDashboard, LogOut, Package, ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/auth/admin";

export default function AccountPage() {
  const router = useRouter();
  const { user, isAdmin, loading, signOut } = useCurrentUser();

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirectTo=/account");
  }, [loading, router, user]);

  async function logout() {
    await signOut();
    router.push("/");
  }

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-3xl px-4 py-7"><StateMessage title="Supabase is not configured" message="Add Supabase variables to use customer accounts." /></div>;
  if (loading) return <p className="mx-auto max-w-3xl px-4 py-7 text-sm text-slate-600">Loading account...</p>;
  if (!user) return <p className="mx-auto max-w-3xl px-4 py-7 text-sm text-slate-600">Redirecting to login...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8">
      <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Customer account</p>
        <h1 className="mt-1 text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-slate-600">{user.email}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <LinkButton href="/account/orders" className="w-full"><Package className="h-4 w-4" /> My Orders</LinkButton>
          <LinkButton href="/products" variant="secondary" className="w-full"><ShoppingBag className="h-4 w-4" /> Continue Shopping</LinkButton>
          <Button variant="secondary" onClick={logout} className="w-full"><LogOut className="h-4 w-4" /> Logout</Button>
        </div>
      </div>
      {isAdmin ? (
        <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-800">Admin access</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Admin Dashboard</h2>
          <p className="mt-2 text-sm leading-6 text-slate-700">Manage products, orders, bookings, and messages.</p>
          <LinkButton href="/admin" className="mt-5">
            <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
          </LinkButton>
        </div>
      ) : null}
    </div>
  );
}

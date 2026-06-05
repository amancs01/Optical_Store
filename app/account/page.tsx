"use client";

import { useRouter } from "next/navigation";
import { LogOut, Package, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login?redirectTo=/account");
        return;
      }
      setUser(data.user);
      setLoading(false);
    });
  }, [router]);

  async function logout() {
    await supabase?.auth.signOut();
    router.push("/");
  }

  if (!isSupabaseConfigured) return <div className="mx-auto max-w-3xl px-4 py-10"><StateMessage title="Supabase is not configured" message="Add Supabase variables to use customer accounts." /></div>;
  if (loading) return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-600">Loading account...</p>;
  if (!user) return <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-slate-600">Redirecting to login...</p>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-md border border-slate-200 bg-white p-6">
        <p className="text-sm font-bold uppercase text-teal-700">Customer account</p>
        <h1 className="mt-2 text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-slate-600">{user.email}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <LinkButton href="/account/orders" className="w-full"><Package className="h-4 w-4" /> My Orders</LinkButton>
          <LinkButton href="/products" variant="secondary" className="w-full"><ShoppingBag className="h-4 w-4" /> Continue Shopping</LinkButton>
          <Button variant="secondary" onClick={logout} className="w-full"><LogOut className="h-4 w-4" /> Logout</Button>
        </div>
      </div>
    </div>
  );
}

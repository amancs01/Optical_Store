"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/auth/admin";
import { signIn } from "@/services/authService";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, isAdmin, loading: authLoading, refreshUser, signOut } = useCurrentUser();

  useEffect(() => {
    if (!authLoading && user && isAdmin) router.replace("/admin");
  }, [authLoading, isAdmin, router, user]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured) return;
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const { error: signInError } = await signIn({
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    });
    if (signInError) {
      setLoading(false);
      setError(signInError.message);
      return;
    }

    const role = await refreshUser();
    setLoading(false);

    if (!role.isAdmin) {
      await signOut();
      setError("This account does not have admin access.");
      return;
    }

    router.push("/admin");
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black">Admin login</h1>
        <p className="mt-2 text-sm text-slate-600">This uses the same Titan Opticals account login and verifies admin access.</p>
        {!isSupabaseConfigured ? <div className="mt-5"><StateMessage title="Supabase is not configured" message="Add Supabase variables to sign in." /></div> : null}
        {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">Email<input name="email" type="email" required className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Password<input name="password" type="password" required className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <Button disabled={loading || !isSupabaseConfigured} className="mt-5 w-full">{loading ? "Signing in..." : "Sign in"}</Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Customer account? <Link className="font-bold text-teal-700" href="/login">Use main login</Link>
        </p>
      </form>
    </div>
  );
}

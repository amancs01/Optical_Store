"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { SITE_CONFIG } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase?.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/account");
    });
  }, [router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
    });

    setLoading(false);
    if (signInError) {
      setError("Could not sign in. Please check your email and password.");
      console.error("Customer login failed:", signInError);
      return;
    }

    const redirectTo = new URLSearchParams(window.location.search).get("redirectTo") || "/account";
    router.push(redirectTo);
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase text-teal-700">{SITE_CONFIG.name}</p>
        <h1 className="mt-2 text-3xl font-black">Customer login</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to view your Titan Opticals orders.</p>
        {!isSupabaseConfigured ? <div className="mt-5"><StateMessage title="Supabase is not configured" message="Add Supabase variables to sign in." /></div> : null}
        {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">Email<input name="email" type="email" required className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Password<input name="password" type="password" required className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <Button disabled={loading || !isSupabaseConfigured} className="mt-5 w-full">{loading ? "Signing in..." : "Sign in"}</Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          New customer? <Link className="font-bold text-teal-700" href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

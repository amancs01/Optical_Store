"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { SITE_CONFIG } from "@/lib/constants";
import { getCurrentUserRole } from "@/lib/auth/admin";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"email" | "password", string>>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase?.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const redirectTo = getSafeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
      const { isAdmin } = await getCurrentUserRole();
      router.replace(redirectTo.startsWith("/admin") && !isAdmin ? "/" : redirectTo);
    });
  }, [router]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const validationErrors: Partial<Record<"email" | "password", string>> = {};

    if (!email) validationErrors.email = "Enter your email address.";
    if (!password) validationErrors.password = "Enter your password.";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setError("Please enter your login details.");
      return;
    }

    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);
    if (signInError) {
      setError("Could not sign in. Please check your email and password.");
      return;
    }

    const redirectTo = getSafeReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
    const { isAdmin } = await getCurrentUserRole();
    router.push(redirectTo.startsWith("/admin") && !isAdmin ? "/" : redirectTo);
  }

  return (
    <div className="mx-auto grid min-h-[66vh] max-w-md place-items-center px-4 py-7">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{SITE_CONFIG.name}</p>
        <h1 className="mt-1 text-3xl font-black">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Use your Titan Opticals account for orders, bookings, or admin access.</p>
        {!isSupabaseConfigured ? <div className="mt-5"><StateMessage title="Supabase is not configured" message="Add Supabase variables to sign in." /></div> : null}
        {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <Field name="email" label="Email" type="email" required error={fieldErrors.email} className="mt-5" />
        <Field name="password" label="Password" type="password" required error={fieldErrors.password} className="mt-4" />
        <Button disabled={loading || !isSupabaseConfigured} className="mt-5 w-full">{loading ? "Signing in..." : "Sign in"}</Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          New customer? <Link className="font-bold text-emerald-700" href="/register">Create an account</Link>
        </p>
      </form>
    </div>
  );
}

function getSafeReturnTo(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

function Field({
  label,
  error,
  className,
  ...inputProps
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  return (
    <label className={`grid gap-2 text-sm font-semibold text-slate-700 ${className || ""}`}>
      {label}
      <input className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" aria-invalid={Boolean(error)} {...inputProps} />
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}

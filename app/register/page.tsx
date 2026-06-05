"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: String(form.get("email") || ""),
      password: String(form.get("password") || ""),
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);
    if (signUpError) {
      console.error("Customer registration failed:", signUpError);
      setError(signUpError.message);
      return;
    }

    if (data.user && data.session) {
      router.push("/account");
      return;
    }

    if (data.user) {
      formElement.reset();
      setSuccess("Account created successfully. Please check your email to confirm your account before signing in.");
      return;
    }

    setError("Could not create your account. Please check your details and try again.");
  }

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-10">
      <form onSubmit={submit} className="w-full rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold uppercase text-teal-700">{SITE_CONFIG.name}</p>
        <h1 className="mt-2 text-3xl font-black">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Register to keep your Titan Opticals orders in one place.</p>
        {!isSupabaseConfigured ? <div className="mt-5"><StateMessage title="Supabase is not configured" message="Add Supabase variables to create accounts." /></div> : null}
        {success ? (
          <div className="mt-4 rounded-md border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
            <p>{success}</p>
            <LinkButton href="/login" className="mt-3 w-full bg-teal-700 hover:bg-teal-800">
              Sign in
            </LinkButton>
          </div>
        ) : null}
        {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
        <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">Name<input name="name" required className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Email<input name="email" type="email" required className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-slate-700">Password<input name="password" type="password" required minLength={6} className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <Button disabled={loading || !isSupabaseConfigured} className="mt-5 w-full">{loading ? "Creating account..." : "Create account"}</Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered? <Link className="font-bold text-teal-700" href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}

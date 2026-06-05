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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "email" | "password", string>>>({});
  const [success, setSuccess] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setError("");
    setSuccess("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const validationErrors: Partial<Record<"name" | "email" | "password", string>> = {};

    if (!name) validationErrors.name = "Enter your full name.";
    if (!email) validationErrors.email = "Enter your email address.";
    if (!password) validationErrors.password = "Create a password.";
    else if (password.length < 6) validationErrors.password = "Password must be at least 6 characters.";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setError("Please complete the required account details.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    setLoading(false);
    if (signUpError) {
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
        <Field name="name" label="Name" required error={fieldErrors.name} className="mt-5" />
        <Field name="email" label="Email" type="email" required error={fieldErrors.email} className="mt-4" />
        <Field name="password" label="Password" type="password" required minLength={6} error={fieldErrors.password} className="mt-4" />
        <Button disabled={loading || !isSupabaseConfigured} className="mt-5 w-full">{loading ? "Creating account..." : "Create account"}</Button>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already registered? <Link className="font-bold text-teal-700" href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
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

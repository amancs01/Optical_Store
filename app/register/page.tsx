"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, LinkButton } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useCurrentUser } from "@/lib/auth/admin";
import { sendSignupOtp, verifySignupOtp, setPassword } from "@/services/authService";

type Step = "form" | "otp" | "done";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "email" | "password", string>>>({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPasswordVal] = useState("");
  const [otp, setOtp] = useState("");
  const { refreshUser } = useCurrentUser();

  async function submitDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured) return;
    setError("");

    const form = new FormData(event.currentTarget);
    const n = String(form.get("name") || "").trim();
    const e = String(form.get("email") || "").trim();
    const p = String(form.get("password") || "");

    const validationErrors: Partial<Record<"name" | "email" | "password", string>> = {};
    if (!n) validationErrors.name = "Enter your full name.";
    if (!e) validationErrors.email = "Enter your email address.";
    if (!p) validationErrors.password = "Create a password.";
    else if (p.length < 6) validationErrors.password = "Password must be at least 6 characters.";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setError("Please complete the required account details.");
      return;
    }

    setLoading(true);
    const { error: otpError } = await sendSignupOtp(e, n);
    setLoading(false);

    if (otpError) {
      setError(otpError.message);
      return;
    }

    setName(n);
    setEmail(e);
    setPasswordVal(p);
    setOtp("");
    setError("");
    setStep("otp");
  }

  async function submitOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSupabaseConfigured) return;
    setError("");
    setLoading(true);

    const { error: verifyError } = await verifySignupOtp(email, otp);
    if (verifyError) {
      setLoading(false);
      setError(verifyError.message);
      return;
    }

    const { error: passwordError } = await setPassword(password);
    setLoading(false);

    if (passwordError) {
      setError("Account created but could not set password. You can reset it from the login page.");
      setStep("done");
      return;
    }

    await refreshUser();
    router.push("/");
  }

  async function resendOtp() {
    setError("");
    setLoading(true);
    const { error: otpError } = await sendSignupOtp(email, name);
    setLoading(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
  }

  return (
    <div className="mx-auto grid min-h-[66vh] max-w-md place-items-center px-4 py-7">
      <form
        onSubmit={step === "otp" ? submitOtp : submitDetails}
        className="w-full rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{SITE_CONFIG.name}</p>

        {step === "form" || step === "otp" ? (
          <h1 className="mt-1 text-3xl font-black">
            {step === "form" ? "Create account" : "Check your email"}
          </h1>
        ) : null}

        {step === "form" ? (
          <p className="mt-2 text-sm text-slate-600">
            Register to keep your Titan Optical orders in one place.
          </p>
        ) : null}

        {step === "otp" ? (
          <p className="mt-2 text-sm text-slate-600">
            We sent a code to <span className="font-semibold text-slate-900">{email}</span>
          </p>
        ) : null}

        {!isSupabaseConfigured ? (
          <div className="mt-5">
            <StateMessage title="Supabase is not configured" message="Add Supabase variables to create accounts." />
          </div>
        ) : null}

        {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}

        {step === "form" ? (
          <>
            <Field name="name" label="Name" required error={fieldErrors.name} className="mt-5" />
            <Field name="email" label="Email" type="email" required error={fieldErrors.email} className="mt-4" />
            <Field name="password" label="Password" type="password" required minLength={6} error={fieldErrors.password} className="mt-4" />
            <Button disabled={loading || !isSupabaseConfigured} className="mt-5 w-full">
              {loading ? "Sending code..." : "Create account"}
            </Button>
          </>
        ) : null}

        {step === "otp" ? (
          <>
            <label className="mt-5 grid gap-2 text-sm font-semibold text-slate-700">
              Enter the 6-digit code
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
                className="min-h-11 rounded-md border border-slate-200 px-3 py-2 text-center text-lg font-bold tracking-[0.3em] focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
            <Button disabled={loading || otp.length !== 6} className="mt-5 w-full">
              {loading ? "Verifying..." : "Verify code"}
            </Button>
            <button
              type="button"
              disabled={loading}
              onClick={resendOtp}
              className="mt-3 w-full text-center text-sm font-semibold text-emerald-700 hover:text-emerald-800 disabled:opacity-50"
            >
              Resend code
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep("form")}
              className="mt-1 w-full text-center text-sm text-slate-500 hover:text-slate-700"
            >
              Back to registration
            </button>
          </>
        ) : null}

        {step === "form" ? (
          <p className="mt-4 text-center text-sm text-slate-600">
            Already registered? <Link className="font-bold text-emerald-700" href="/login">Sign in</Link>
          </p>
        ) : null}
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
      <input className="min-h-11 rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" aria-invalid={Boolean(error)} {...inputProps} />
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}

"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createContactMessage } from "@/services/bookingService";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setErrorMessage("");
    const currentForm = event.currentTarget;
    const form = new FormData(event.currentTarget);
    try {
      await createContactMessage({
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        email: String(form.get("email") || ""),
        message: String(form.get("message") || ""),
      });
      currentForm.reset();
      setSuccess(true);
    } catch (error) {
      console.error("Contact message submission failed:", error);
      setErrorMessage("We could not send your message right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <h1 className="text-4xl font-black">Contact us</h1>
        <div className="mt-6 space-y-3 text-slate-600">
          <p>{SITE_CONFIG.address}</p>
          <p>{SITE_CONFIG.phone}</p>
          <p>{SITE_CONFIG.email}</p>
        </div>
      </div>
      <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5">
        {!isSupabaseConfigured ? <StateMessage title="Supabase is not configured" message="Add Supabase variables before sending messages." /> : null}
        {success ? (
          <div className="rounded-md border border-teal-200 bg-teal-50 p-4 text-teal-900">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <div>
                <h2 className="font-bold">Message sent</h2>
                <p className="mt-1 text-sm">
                  Your message has been sent successfully. We will get back to you soon.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {errorMessage ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
            {errorMessage}
          </div>
        ) : null}
        <Field name="name" label="Full name" required />
        <Field name="phone" label="Phone" />
        <Field name="email" label="Email" type="email" />
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Message<textarea name="message" required rows={5} className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <Button disabled={isSubmitting || !isSupabaseConfigured}>{isSubmitting ? "Sending..." : "Send message"}</Button>
      </form>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input className="rounded-md border border-slate-200 px-3 py-2 font-normal" {...inputProps} /></label>;
}

"use client";

import { CheckCircle2, MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createContactMessage } from "@/services/bookingService";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "message", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${SITE_CONFIG.address}, Kathmandu`)}`;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setErrorMessage("");
    const currentForm = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") || "").trim(),
      phone: String(form.get("phone") || "").trim(),
      email: String(form.get("email") || "").trim(),
      message: String(form.get("message") || "").trim(),
    };
    const validationErrors: Partial<Record<"name" | "message", string>> = {};

    if (!values.name) validationErrors.name = "Enter your full name.";
    if (!values.message) validationErrors.message = "Write a short message so we know how to help.";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setErrorMessage("Please complete the required contact details.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createContactMessage(values);
      currentForm.reset();
      setSuccess(true);
    } catch {
      setErrorMessage("We could not send your message right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div>
        <p className="text-sm font-bold uppercase text-teal-700">{SITE_CONFIG.name}</p>
        <h1 className="mt-2 text-4xl font-black">Contact Titan Opticals</h1>
        <p className="mt-4 text-slate-600">
          Visit us at New Road for eyewear, sunglasses, contact lenses, and eye-care support.
        </p>
        <div className="mt-6 space-y-3 text-slate-600">
          <p><strong className="text-slate-950">Address:</strong> {SITE_CONFIG.address}</p>
          <p><strong className="text-slate-950">Phone:</strong> <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phoneDisplay}</a></p>
          <p><strong className="text-slate-950">WhatsApp:</strong> <a href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}>{SITE_CONFIG.whatsapp}</a></p>
          <p><strong className="text-slate-950">Email:</strong> <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a></p>
          <p><strong className="text-slate-950">Opening hours:</strong> {SITE_CONFIG.openingHours}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 text-sm font-bold text-teal-700">
          <a href={SITE_CONFIG.socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={SITE_CONFIG.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={SITE_CONFIG.socialLinks.tiktok} target="_blank" rel="noreferrer">TikTok</a>
        </div>
        <div className="mt-8 rounded-md border border-emerald-100 bg-emerald-50/70 p-5">
          <MapPin className="h-6 w-6 text-emerald-700" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-black text-slate-950">Find us in New Road</h2>
          <p className="mt-2 text-sm text-slate-600">{SITE_CONFIG.address}</p>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Open in Google Maps
          </a>
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
        <Field name="name" label="Full name" required error={fieldErrors.name} />
        <Field name="phone" label="Phone" />
        <Field name="email" label="Email" type="email" />
        <label className="grid gap-2 text-sm font-semibold text-slate-700">
          Message
          <textarea name="message" required rows={5} aria-invalid={Boolean(fieldErrors.message)} className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" />
          {fieldErrors.message ? <span className="text-xs font-semibold text-rose-700">{fieldErrors.message}</span> : null}
        </label>
        <Button disabled={isSubmitting || !isSupabaseConfigured}>{isSubmitting ? "Sending..." : "Send message"}</Button>
      </form>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  const { label, error, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" aria-invalid={Boolean(error)} {...inputProps} />
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}

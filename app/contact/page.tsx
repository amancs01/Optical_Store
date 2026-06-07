"use client";

import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { SocialIconLinks } from "@/components/layout/SocialIconLinks";
import { StateMessage } from "@/components/ui/StateMessage";
import { SITE_CONFIG } from "@/lib/constants";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createContactMessage } from "@/services/contactService";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "message", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="bg-[#fffaf2]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">{SITE_CONFIG.name}</p>
          <h1 className="mt-1 animate-fade-up text-3xl font-black sm:text-4xl">Contact Titan Optical</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
            Visit us at New Road for eyewear, sunglasses, contact lenses, and eye-care support.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-bold text-slate-950">{SITE_CONFIG.name}</h2>
            <div className="mt-5 grid gap-4 text-sm text-slate-600">
              <ContactInfo icon={<MapPin className="h-4 w-4" />} label="Address">
                <span>{SITE_CONFIG.address}, Kathmandu</span>
              </ContactInfo>
              <ContactInfo icon={<Phone className="h-4 w-4" />} label="Phone">
                <a href={`tel:${SITE_CONFIG.phone}`} className="font-semibold text-slate-900 hover:text-emerald-800">
                  {SITE_CONFIG.phoneDisplay}
                </a>
              </ContactInfo>
              <ContactInfo icon={<MessageCircle className="h-4 w-4" />} label="WhatsApp">
                <a
                  href={`https://wa.me/977${SITE_CONFIG.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-900 hover:text-emerald-800"
                >
                  {SITE_CONFIG.whatsapp}
                </a>
              </ContactInfo>
              <ContactInfo icon={<Mail className="h-4 w-4" />} label="Email">
                <a href={`mailto:${SITE_CONFIG.email}`} className="font-semibold text-slate-900 hover:text-emerald-800">
                  {SITE_CONFIG.email}
                </a>
                <span className="block text-xs text-slate-500">{SITE_CONFIG.emailNote}</span>
              </ContactInfo>
              <ContactInfo icon={<Clock className="h-4 w-4" />} label="Opening hours">
                <span>{SITE_CONFIG.openingHours}</span>
              </ContactInfo>
            </div>
            <div className="mt-6">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Follow us</p>
              <SocialIconLinks variant="light" />
            </div>
            <div className="mt-6 rounded-md border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-none text-emerald-700" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-slate-950">Find us in New Road</h3>
                  <p className="mt-1 text-sm text-slate-600">{SITE_CONFIG.address}, Kathmandu</p>
                </div>
              </div>
              <a
                href={SITE_CONFIG.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md bg-emerald-700 px-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Open in Google Maps
              </a>
            </div>
          </section>

          <form onSubmit={submit} className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Send a message</h2>
              <p className="mt-1 text-sm text-slate-600">Ask about frames, orders, bookings, or store availability.</p>
            </div>
            {!isSupabaseConfigured ? <StateMessage title="Supabase is not configured" message="Add Supabase variables before sending messages." /> : null}
            {success ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold">Message sent</h2>
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
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="phone" label="Phone" />
              <Field name="email" label="Email" type="email" />
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-700">
              Message
              <textarea
                name="message"
                required
                rows={5}
                aria-invalid={Boolean(fieldErrors.message)}
                className="min-h-[140px] rounded-md border border-slate-200 px-3 py-2.5 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 lg:min-h-[160px]"
              />
              {fieldErrors.message ? <span className="text-xs font-semibold text-rose-700">{fieldErrors.message}</span> : null}
            </label>
            <Button className="min-h-12" disabled={isSubmitting || !isSupabaseConfigured}>
              {isSubmitting ? "Sending..." : "Send message"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactInfo({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 inline-flex h-8 w-8 flex-none items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
        {icon}
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-1 leading-6">{children}</div>
      </div>
    </div>
  );
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  const { label, error, ...inputProps } = props;
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700">
      {label}
      <input className="min-h-11 rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100" aria-invalid={Boolean(error)} {...inputProps} />
      {error ? <span className="text-xs font-semibold text-rose-700">{error}</span> : null}
    </label>
  );
}

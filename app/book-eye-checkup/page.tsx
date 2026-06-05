"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createBooking } from "@/services/bookingService";

export default function BookEyeCheckupPage() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "phone" | "booking_date" | "booking_time", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(false);
    setErrorMessage("");
    const currentForm = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const bookingDate = String(form.get("booking_date") || "");
    const bookingTime = String(form.get("booking_time") || "");
    const validationErrors: Partial<Record<"name" | "phone" | "booking_date" | "booking_time", string>> = {};

    if (!name) validationErrors.name = "Enter your full name.";
    if (!phone) validationErrors.phone = "Enter a phone number we can call.";
    if (!bookingDate) validationErrors.booking_date = "Choose a preferred date.";
    if (bookingDate && bookingDate < getTodayDate()) {
      validationErrors.booking_date = "Choose today or a future date.";
    }
    if (!bookingTime) validationErrors.booking_time = "Choose a preferred time slot.";

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setErrorMessage("Please complete the required booking details.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBooking({
        name,
        phone,
        branch: String(form.get("branch") || ""),
        booking_date: bookingDate,
        booking_time: bookingTime,
        message: String(form.get("message") || ""),
      });
      currentForm.reset();
      setSuccess(true);
    } catch {
      setErrorMessage("We could not submit your eye checkup booking right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormPage
      title="Book eye checkup"
      success={success}
      errorMessage={errorMessage}
      fieldErrors={fieldErrors}
      submit={submit}
      isSubmitting={isSubmitting}
      disabled={!isSupabaseConfigured}
    />
  );
}

function FormPage({
  title,
  success,
  errorMessage,
  fieldErrors,
  submit,
  isSubmitting,
  disabled,
}: {
  title: string;
  success: boolean;
  errorMessage: string;
  fieldErrors: Partial<Record<"name" | "phone" | "booking_date" | "booking_time", string>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  disabled: boolean;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-black">{title}</h1>
      {disabled ? <div className="mt-6"><StateMessage title="Supabase is not configured" message="Add Supabase variables before booking." /></div> : null}
      <form onSubmit={submit} className="mt-6 grid gap-4 rounded-md border border-slate-200 bg-white p-5">
        {success ? (
          <div className="rounded-md border border-teal-200 bg-teal-50 p-4 text-teal-900">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <div>
                <h2 className="font-bold">Booking submitted</h2>
                <p className="mt-1 text-sm">
                  Your eye checkup booking has been submitted successfully. Our team will contact you soon.
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
        <Field name="phone" label="Phone" required error={fieldErrors.phone} />
        <Field name="branch" label="Branch" defaultValue="Kathmandu" />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="booking_date" label="Date" type="date" min={getTodayDate()} required error={fieldErrors.booking_date} />
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Time
            <select name="booking_time" required aria-invalid={Boolean(fieldErrors.booking_time)} className="rounded-md border border-slate-200 px-3 py-2 font-normal focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100">
              <option value="">Choose a time</option>
              {TIME_SLOTS.map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
            {fieldErrors.booking_time ? <span className="text-xs font-semibold text-rose-700">{fieldErrors.booking_time}</span> : null}
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Message<textarea name="message" rows={4} className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <Button disabled={isSubmitting || disabled}>{isSubmitting ? "Submitting..." : "Submit booking"}</Button>
      </form>
    </div>
  );
}

const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
];

function getTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
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

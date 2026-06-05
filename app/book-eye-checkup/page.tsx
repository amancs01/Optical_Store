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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setErrorMessage("");
    const currentForm = event.currentTarget;
    const form = new FormData(event.currentTarget);
    const bookingDate = String(form.get("booking_date") || "");
    if (bookingDate && bookingDate < getTodayDate()) {
      setErrorMessage("Please choose today or a future date for your eye checkup.");
      setIsSubmitting(false);
      return;
    }
    try {
      await createBooking({
        name: String(form.get("name") || ""),
        phone: String(form.get("phone") || ""),
        branch: String(form.get("branch") || ""),
        booking_date: bookingDate,
        booking_time: String(form.get("booking_time") || ""),
        message: String(form.get("message") || ""),
      });
      currentForm.reset();
      setSuccess(true);
    } catch (error) {
      console.error("Eye checkup booking submission failed:", error);
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
  submit,
  isSubmitting,
  disabled,
}: {
  title: string;
  success: boolean;
  errorMessage: string;
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
        <Field name="name" label="Full name" required />
        <Field name="phone" label="Phone" required />
        <Field name="branch" label="Branch" defaultValue="Kathmandu" />
        <div className="grid gap-4 md:grid-cols-2"><Field name="booking_date" label="Date" type="date" min={getTodayDate()} /><Field name="booking_time" label="Time" type="time" /></div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Message<textarea name="message" rows={4} className="rounded-md border border-slate-200 px-3 py-2 font-normal" /></label>
        <Button disabled={isSubmitting || disabled}>{isSubmitting ? "Submitting..." : "Submit booking"}</Button>
      </form>
    </div>
  );
}

function getTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function Field(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string; name: string }) {
  const { label, ...inputProps } = props;
  return <label className="grid gap-2 text-sm font-semibold text-slate-700">{label}<input className="rounded-md border border-slate-200 px-3 py-2 font-normal" {...inputProps} /></label>;
}

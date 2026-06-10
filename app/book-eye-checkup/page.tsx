"use client";

import { CheckCircle2, ChevronDown, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { StateMessage } from "@/components/ui/StateMessage";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createBooking } from "@/services/bookingService";

export default function BookEyeCheckupPage() {
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<"name" | "phone" | "booking_date" | "booking_time", string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

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
    if (bookingTime && !getAvailableTimeSlots(bookingDate).includes(bookingTime)) {
      validationErrors.booking_time = "Choose an available time slot.";
    }

    setFieldErrors(validationErrors);
    if (Object.keys(validationErrors).length) {
      setErrorMessage("Please complete the required booking details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        name,
        phone,
        branch: String(form.get("branch") || ""),
        booking_date: bookingDate,
        booking_time: bookingTime,
        message: String(form.get("message") || ""),
      });
      notifyBooking(booking);
      currentForm.reset();
      setSelectedDate("");
      setSelectedTime("");
      setSuccess(true);
    } catch {
      setErrorMessage("We could not submit your eye checkup booking right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <FormPage
      title="Free Eye Checkup"
      success={success}
      errorMessage={errorMessage}
      fieldErrors={fieldErrors}
      submit={submit}
      isSubmitting={isSubmitting}
      disabled={!isSupabaseConfigured}
      selectedDate={selectedDate}
      setSelectedDate={setSelectedDate}
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
    />
  );
}

function notifyBooking(booking: {
  name: string;
  phone: string;
  booking_date: string | null;
  booking_time: string | null;
  branch: string | null;
  message: string | null;
}) {
  try {
    fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "booking",
        data: {
          name: booking.name,
          phone: booking.phone,
          booking_date: booking.booking_date ?? "",
          booking_time: booking.booking_time ?? "",
          branch: booking.branch || null,
          message: booking.message || null,
        },
      }),
    });
  } catch {
    // Fire-and-forget — must not affect the user experience
  }
}

function FormPage({
  title,
  success,
  errorMessage,
  fieldErrors,
  submit,
  isSubmitting,
  disabled,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
}: {
  title: string;
  success: boolean;
  errorMessage: string;
  fieldErrors: Partial<Record<"name" | "phone" | "booking_date" | "booking_time", string>>;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  disabled: boolean;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedTime: string;
  setSelectedTime: (value: string) => void;
}) {
  const timeSlots = getAvailableTimeSlots(selectedDate);

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 lg:px-8">
      <p className="text-[11px] font-bold uppercase tracking-wide text-emerald-700">Titan Optical</p>
      <h1 className="mt-1 text-3xl font-black sm:text-4xl">{title}</h1>
      {disabled ? <div className="mt-6"><StateMessage title="Supabase is not configured" message="Add Supabase variables before booking." /></div> : null}
      <form onSubmit={submit} className="mt-5 grid gap-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        {success ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden="true" />
              <div>
                <h2 className="font-semibold">Free Eye Checkup request submitted</h2>
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
          <Field
            name="booking_date"
            label="Date"
            type="date"
            min={getTodayDate()}
            required
            error={fieldErrors.booking_date}
            value={selectedDate}
            onChange={(event) => {
              setSelectedDate(event.currentTarget.value);
              setSelectedTime("");
            }}
          />
          <label className="grid gap-2 text-sm font-semibold text-slate-700">
            Time
            <TimeSelect
              value={selectedTime}
              onChange={setSelectedTime}
              slots={timeSlots}
              hasError={Boolean(fieldErrors.booking_time)}
            />
            {fieldErrors.booking_time ? <span className="text-xs font-semibold text-rose-700">{fieldErrors.booking_time}</span> : null}
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-slate-700">Message<textarea name="message" rows={3} className="min-h-[96px] rounded-md border border-slate-200 px-3 py-2 font-normal sm:min-h-[128px]" /></label>
        <Button disabled={isSubmitting || disabled}>{isSubmitting ? "Submitting..." : "Free Eye Checkup"}</Button>
      </form>
    </div>
  );
}

function TimeSelect({
  value,
  onChange,
  slots,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  slots: string[];
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function chooseTime(time: string) {
    onChange(time);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <input type="hidden" name="booking_time" value={value} readOnly />
      <button
        type="button"
        aria-label="Choose a time"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={!slots.length}
        onClick={() => setOpen((value) => !value)}
        className={`inline-flex h-11 w-full items-center justify-between gap-3 rounded-md border bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm outline-none transition hover:border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 ${
          hasError ? "border-rose-300" : "border-slate-200"
        }`}
      >
        <span className={value ? "" : "font-normal text-slate-400"}>{value || (slots.length ? "Choose a time" : "No remaining slots today")}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Available times"
          className="absolute left-0 top-full z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-950/10"
        >
          {slots.map((time) => (
            <button
              key={time}
              type="button"
              role="option"
              aria-selected={value === time}
              onClick={() => chooseTime(time)}
              className="relative flex h-9 w-full cursor-pointer items-center rounded-md py-2 pl-8 pr-3 text-left text-sm font-semibold text-slate-700 outline-none transition hover:bg-emerald-50 hover:text-emerald-900 focus:bg-emerald-50 focus:text-emerald-900 aria-selected:text-emerald-800"
            >
              {value === time ? (
                <span className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4" />
                </span>
              ) : null}
              {time}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const TIME_SLOTS = createTimeSlots();

function getTodayDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

function createTimeSlots() {
  const slots: string[] = [];
  for (let minutes = 10 * 60; minutes <= 18 * 60 + 45; minutes += 15) {
    slots.push(formatTime(minutes));
  }
  return slots;
}

function getAvailableTimeSlots(selectedDate: string) {
  if (selectedDate !== getTodayDate()) return TIME_SLOTS;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return TIME_SLOTS.filter((slot) => parseTime(slot) > currentMinutes);
}

function formatTime(totalMinutes: number) {
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${period}`;
}

function parseTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2}) (AM|PM)$/);
  if (!match) return 0;
  const [, hourText, minuteText, period] = match;
  const hour = Number(hourText) % 12;
  return (hour + (period === "PM" ? 12 : 0)) * 60 + Number(minuteText);
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

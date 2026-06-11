"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ListSkeleton } from "@/components/ui/LoadingSkeletons";
import { StateMessage } from "@/components/ui/StateMessage";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { BOOKING_STATUSES } from "@/lib/constants";
import { getBookings, updateBookingStatus } from "@/services/bookingService";
import type { Booking } from "@/types/order";
import { useAdminStatus } from "@/lib/auth/admin";

const PAGE_SIZE = 7;

function formatBookingDate(dateStr: string | null, timeStr: string | null): string {
  if (!dateStr) return "Date not set";
  try {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    const label = isToday ? "Today" : isTomorrow ? "Tomorrow"
      : date.toLocaleDateString("en-NP", { weekday: "short", month: "short", day: "numeric" });
    return timeStr ? `${label}, ${timeStr}` : label;
  } catch {
    return dateStr;
  }
}

function capitalizeNote(text: string | null): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase().trim();
}

function getBookingStatusStyle(status: string) {
  const map: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    confirmed: "bg-sky-100 text-sky-800 border-sky-300",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-300",
    cancelled: "bg-rose-100 text-rose-800 border-rose-300",
  };
  return map[status] || "bg-slate-100 text-slate-700 border-slate-200";
}

function getBookingStatusSelectClass(status: string) {
  return `h-9 w-32 rounded-full px-3 text-xs font-black uppercase tracking-wide shadow-none sm:w-36 ${getBookingStatusStyle(status)}`;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const { isAdmin } = useAdminStatus();
  function load() {
    setPage(1);
    setLoading(true);
    setError("");
    getBookings()
      .then(setBookings)
      .catch((err) => {
        setBookings([]);
        setError(err instanceof Error ? err.message : "Bookings could not load.");
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    if (!isAdmin) return;
    window.queueMicrotask(load);
  }, [isAdmin]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Bookings</h1>
        <button onClick={load}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >↻ Refresh</button>
      </div>
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Bookings could not load" message={error} /></div> : null}
      {!loading && !error && !bookings.length ? <div className="mt-5"><StateMessage title="No bookings found" message="Eye checkup requests will appear here." /></div> : null}
      {!loading && !error && bookings.length > 0 ? <div className="mt-5 grid gap-4">
        {bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((booking) => (
          <div key={booking.id}
            className={`rounded-xl border bg-white p-3 shadow-sm sm:p-4 ${
              booking.status === "pending" ? "border-amber-200" :
              booking.status === "cancelled" ? "border-rose-200" :
              booking.status === "completed" ? "border-emerald-200" :
              "border-slate-200"
            }`}>
            <div className="grid gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-black text-slate-950">{booking.name}</h2>
                </div>
                <Select
                  value={booking.status}
                  onValueChange={(v) => updateBookingStatus(booking.id, v).then(load)}
                  items={BOOKING_STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))}
                  className={getBookingStatusSelectClass(booking.status)}
                />
              </div>
              <div className="grid gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`tel:${booking.phone}`} className="text-sm font-semibold text-teal-700 hover:underline">{booking.phone}</a>
                  {booking.branch ? <span className="text-xs text-slate-500">· {booking.branch}</span> : null}
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  📅 {formatBookingDate(booking.booking_date, booking.booking_time)}
                </p>
              </div>
              {booking.message ? (
                <p className="rounded-md bg-slate-50 px-3 py-2 text-sm italic text-slate-600">
                  &quot;{capitalizeNote(booking.message)}&quot;
                </p>
              ) : null}
              <div className="flex flex-wrap gap-2">
                <a href={`tel:${booking.phone}`}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >📞 Call</a>
                <a href={`https://wa.me/977${booking.phone}`} target="_blank" rel="noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                >💬 WhatsApp</a>
              </div>
            </div>
          </div>
        ))}
      </div> : null}
      {!loading && !error && bookings.length > 0 ? <Pagination currentPage={page} totalPages={Math.ceil(bookings.length / PAGE_SIZE)} onPageChange={setPage} /> : null}
    </AdminLayout>
  );
}

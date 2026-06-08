"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StateMessage } from "@/components/ui/StateMessage";
import { BOOKING_STATUSES } from "@/lib/constants";
import { getBookings, updateBookingStatus } from "@/services/bookingService";
import type { Booking } from "@/types/order";
import { useCurrentUser } from "@/lib/auth/admin";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useCurrentUser();
  function load() {
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
      <h1 className="text-3xl font-black">Bookings</h1>
      {loading ? <p className="mt-5 text-sm text-slate-600">Loading bookings...</p> : null}
      {error ? <div className="mt-5"><StateMessage title="Bookings could not load" message={error} /></div> : null}
      {!loading && !error && !bookings.length ? <div className="mt-5"><StateMessage title="No bookings found" message="Eye checkup requests will appear here." /></div> : null}
      <div className="mt-5 grid gap-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div><h2 className="font-black">{booking.name}</h2><p className="text-sm text-slate-600">{booking.phone} - {booking.branch}</p><p className="text-sm text-slate-600">{booking.booking_date} {booking.booking_time}</p><p className="mt-2 text-sm text-slate-600">{booking.message}</p></div>
              <select value={booking.status} onChange={(e) => updateBookingStatus(booking.id, e.target.value).then(load)} className="h-11 rounded-md border border-slate-200 px-3 text-sm">{BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

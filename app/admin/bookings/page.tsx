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
      <h1 className="text-3xl font-black">Bookings</h1>
      {loading ? <div className="mt-5"><ListSkeleton rows={5} /></div> : null}
      {error ? <div className="mt-5"><StateMessage title="Bookings could not load" message={error} /></div> : null}
      {!loading && !error && !bookings.length ? <div className="mt-5"><StateMessage title="No bookings found" message="Eye checkup requests will appear here." /></div> : null}
      {!loading && !error && bookings.length > 0 ? <div className="mt-5 grid gap-4">
        {bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE).map((booking) => (
          <div key={booking.id} className="rounded-md border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div><h2 className="font-black">{booking.name}</h2><p className="text-sm text-slate-600">{booking.phone} - {booking.branch}</p><p className="text-sm text-slate-600">{booking.booking_date} {booking.booking_time}</p><p className="mt-2 text-sm text-slate-600">{booking.message}</p></div>
              <Select value={booking.status} onValueChange={(v) => updateBookingStatus(booking.id, v).then(load)} items={BOOKING_STATUSES.map((s) => ({ label: s.charAt(0).toUpperCase() + s.slice(1), value: s }))} />
            </div>
          </div>
        ))}
      </div> : null}
      {!loading && !error && bookings.length > 0 ? <Pagination currentPage={page} totalPages={Math.ceil(bookings.length / PAGE_SIZE)} onPageChange={setPage} /> : null}
    </AdminLayout>
  );
}

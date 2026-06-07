import { requireSupabase } from "@/lib/supabase/client";
import type { Booking } from "@/types/order";

export async function createBooking(input: {
  name: string;
  phone: string;
  branch?: string;
  booking_date?: string;
  booking_time?: string;
  message?: string;
}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("bookings").insert(input).select().single();
  if (error) throw error;
  return data as Booking;
}

export async function getAdminBookings() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Booking[];
}

export const getBookings = getAdminBookings;

export async function updateBookingStatus(id: string, status: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) throw error;
}

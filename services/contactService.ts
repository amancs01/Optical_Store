import { requireSupabase } from "@/lib/supabase/client";
import type { ContactMessage } from "@/types/order";

export async function createContactMessage(input: {
  name: string;
  phone?: string;
  email?: string;
  message: string;
}) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("contact_messages").insert(input).select().single();
  if (error) throw error;
  return data as ContactMessage;
}

export async function getAdminMessages() {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as ContactMessage[];
}

export async function updateMessageStatus(id: string, status: string) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
  if (error) throw error;
}

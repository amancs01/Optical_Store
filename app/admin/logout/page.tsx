"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    supabase?.auth.signOut().finally(() => router.push("/admin/login"));
  }, [router]);
  return <p className="mx-auto max-w-4xl px-4 py-10 text-slate-600">Signing out...</p>;
}

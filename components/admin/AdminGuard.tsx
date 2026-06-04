"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import { StateMessage } from "@/components/ui/StateMessage";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (!data.user) router.replace("/admin/login");
    });
  }, [router]);

  if (!isSupabaseConfigured) {
    return (
      <StateMessage
        title="Supabase is not configured"
        message="Add the public Supabase environment variables to use the admin dashboard."
      />
    );
  }

  if (loading) return <p className="p-6 text-sm text-slate-600">Loading admin session...</p>;

  if (!user) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold">Admin login required</h1>
        <p className="mt-2 text-sm text-slate-600">Redirecting to the admin login page.</p>
        <Link className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/admin/login">
          Go to login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

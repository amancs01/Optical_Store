"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { useAdminStatus } from "@/lib/auth/admin";
import { StateMessage } from "@/components/ui/StateMessage";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAdmin, loading } = useAdminStatus();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login?returnTo=/admin");
    else if (!isAdmin) router.replace("/account");
  }, [isAdmin, loading, router, user]);

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
        <p className="mt-2 text-sm text-slate-600">Redirecting to login.</p>
        <Link className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/login?returnTo=/admin">
          Go to login
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="rounded-md border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold">Access denied</h1>
        <p className="mt-2 text-sm text-slate-600">This account does not have admin access.</p>
        <Link className="mt-4 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white" href="/account">
          Go to account
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

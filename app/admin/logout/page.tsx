"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth/admin";

export default function LogoutPage() {
  const router = useRouter();
  const { signOut } = useCurrentUser();
  useEffect(() => {
    signOut().finally(() => router.push("/admin/login"));
  }, [router, signOut]);
  return <p className="mx-auto max-w-4xl px-4 py-10 text-slate-600">Signing out...</p>;
}

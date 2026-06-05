"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export type AdminProfile = {
  user_id: string;
  email: string | null;
  role: string | null;
};

export type CurrentUserRole = {
  user: User | null;
  isAdmin: boolean;
  adminProfile: AdminProfile | null;
};

export async function getCurrentUserRole(): Promise<CurrentUserRole> {
  if (!supabase) return { user: null, isAdmin: false, adminProfile: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { user: null, isAdmin: false, adminProfile: null };

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("user_id,email,role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error) return { user, isAdmin: false, adminProfile: null };

  return {
    user,
    isAdmin: Boolean(data),
    adminProfile: (data as AdminProfile | null) || null,
  };
}

export async function isCurrentUserAdmin() {
  const { isAdmin } = await getCurrentUserRole();
  return isAdmin;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(Boolean(supabase));
      const role = await getCurrentUserRole();
      if (!active) return;
      setUser(role.user);
      setIsAdmin(role.isAdmin);
      setAdminProfile(role.adminProfile);
      setLoading(false);
    }

    void load();

    const { data: listener } = supabase?.auth.onAuthStateChange(() => {
      void load();
    }) || { data: null };

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return { user, isAdmin, adminProfile, loading };
}

export function useAdminStatus() {
  const { user, isAdmin, adminProfile, loading } = useCurrentUser();
  return { user, isAdmin, adminProfile, loading };
}

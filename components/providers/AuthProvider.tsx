"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getCurrentUserRole, type AdminProfile, type CurrentUserRole } from "@/services/adminService";
import { signOut as signOutUser } from "@/services/authService";
import { supabase } from "@/lib/supabase/client";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  adminProfile: AdminProfile | null;
  loading: boolean;
  refreshUser: () => Promise<CurrentUserRole>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));

  const refreshUser = useCallback(async () => {
    setLoading(Boolean(supabase));
    const role = await getCurrentUserRole();
    setUser(role.user);
    setIsAdmin(role.isAdmin);
    setAdminProfile(role.adminProfile);
    setLoading(false);
    return role;
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
    setUser(null);
    setIsAdmin(false);
    setAdminProfile(null);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      const role = await getCurrentUserRole();
      if (!active) return;
      setUser(role.user);
      setIsAdmin(role.isAdmin);
      setAdminProfile(role.adminProfile);
      setLoading(false);
    }

    void load();

    const { data: listener } = supabase?.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") return;
      void load();
    }) || { data: null };

    return () => {
      active = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAdmin,
    adminProfile,
    loading,
    refreshUser,
    signOut,
  }), [adminProfile, isAdmin, loading, refreshUser, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

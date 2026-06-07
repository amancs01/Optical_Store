import type { SignInWithPasswordCredentials, SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export async function getCurrentUser() {
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function signIn(credentials: SignInWithPasswordCredentials) {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.signInWithPassword(credentials);
}

export async function signUp(credentials: SignUpWithPasswordCredentials) {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase.auth.signUp(credentials);
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

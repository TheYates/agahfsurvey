"use client";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

// Create a single instance of the Supabase client for client-side auth
export const createAuthClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Auth utility functions for client-side use
export const authClient = {
  // Sign up with email and password
  signUp: async (email: string, password: string, metadata?: Record<string, any>) => {
    const supabase = createAuthClient();
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
  },

  // Sign in with email and password
  signIn: async (email: string, password: string) => {
    const supabase = createAuthClient();
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  // Sign out
  signOut: async () => {
    const supabase = createAuthClient();
    return await supabase.auth.signOut();
  },

  // Get current session
  getSession: async () => {
    const supabase = createAuthClient();
    return await supabase.auth.getSession();
  },

  // Get current user
  getUser: async () => {
    const supabase = createAuthClient();
    return await supabase.auth.getUser();
  },

  // Reset password
  resetPassword: async (email: string) => {
    const supabase = createAuthClient();
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
  },

  // Update password
  updatePassword: async (password: string) => {
    const supabase = createAuthClient();
    return await supabase.auth.updateUser({ password });
  },

  // Update user metadata
  updateUser: async (attributes: { email?: string; data?: Record<string, any> }) => {
    const supabase = createAuthClient();
    return await supabase.auth.updateUser(attributes);
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    const supabase = createAuthClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};

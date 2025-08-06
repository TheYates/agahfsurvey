"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "./client";
import type { User, Session } from "@supabase/supabase-js";

// Hook for managing auth state
export function useSupabaseAuthHook() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await authClient.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = authClient.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Refresh the page to update server-side auth state
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          router.refresh();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authClient.signIn(email, password);
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    const result = await authClient.signUp(email, password, metadata);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    const result = await authClient.signOut();
    setLoading(false);
    return result;
  };

  const resetPassword = async (email: string) => {
    return await authClient.resetPassword(email);
  };

  const updatePassword = async (password: string) => {
    return await authClient.updatePassword(password);
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!session,
  };
}

// Hook for requiring authentication
export function useRequireAuth() {
  const { user, loading } = useSupabaseAuthHook();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  return { user, loading };
}

// Hook for requiring specific role
export function useRequireRole(requiredRole: string) {
  const { user, loading } = useSupabaseAuthHook();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        const userRole = user.user_metadata?.role || 'user';
        if (userRole !== requiredRole) {
          router.push('/unauthorized');
        }
      }
    }
  }, [user, loading, requiredRole, router]);

  return { user, loading };
}

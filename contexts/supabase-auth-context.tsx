"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<any>;
  signOut: () => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  updatePassword: (password: string) => Promise<any>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await authClient.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error in getInitialSession:", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = authClient.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Refresh the page to update server-side auth state
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await authClient.signIn(email, password);
      if (result.error) {
        console.error("Sign in error:", result.error);

        // Add specific handling for rate limit errors
        if (result.error.message?.includes("rate limit") ||
            result.error.message?.includes("429")) {
          return {
            error: {
              message: "Too many login attempts. Please wait a few minutes before trying again."
            }
          };
        }
      }
      return result;
    } catch (error: any) {
      console.error("Sign in exception:", error);

      // Handle rate limit errors in catch block too
      if (error?.message?.includes("rate limit") ||
          error?.message?.includes("429")) {
        return {
          error: {
            message: "Too many login attempts. Please wait a few minutes before trying again."
          }
        };
      }

      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      const result = await authClient.signUp(email, password, metadata);
      if (result.error) {
        console.error("Sign up error:", result.error);
      }
      return result;
    } catch (error) {
      console.error("Sign up exception:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const result = await authClient.signOut();
      if (result.error) {
        console.error("Sign out error:", result.error);
      }
      return result;
    } catch (error) {
      console.error("Sign out exception:", error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await authClient.resetPassword(email);
      if (result.error) {
        console.error("Reset password error:", result.error);
      }
      return result;
    } catch (error) {
      console.error("Reset password exception:", error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const result = await authClient.updatePassword(password);
      if (result.error) {
        console.error("Update password error:", result.error);
      }
      return result;
    } catch (error) {
      console.error("Update password exception:", error);
      return { error };
    }
  };

  const value = {
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useSupabaseAuth must be used within a SupabaseAuthProvider");
  }
  return context;
}

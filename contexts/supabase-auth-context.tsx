"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
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
  
  // Use refs to prevent recreating functions
  const signInRef = useRef<(email: string, password: string) => Promise<any>>();
  const signUpRef = useRef<(email: string, password: string, metadata?: Record<string, any>) => Promise<any>>();
  const signOutRef = useRef<() => Promise<any>>();
  const resetPasswordRef = useRef<(email: string) => Promise<any>>();
  const updatePasswordRef = useRef<(password: string) => Promise<any>>();
  const contextValueRef = useRef<AuthContextType | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await authClient.getSession();
        if (error) {
          console.error("Error getting session:", error);
        }
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error in getInitialSession:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data } = authClient.onAuthStateChange(
      (event, newSession) => {
        if (!mounted) return;

        // Only update if session actually changed
        setSession((prevSession) => {
          const prevToken = prevSession?.access_token;
          const newToken = newSession?.access_token;
          if (prevToken !== newToken) {
            return newSession;
          }
          return prevSession;
        });
        
        setUser((prevUser) => {
          const prevId = prevUser?.id;
          const newId = newSession?.user?.id;
          if (prevId !== newId) {
            return newSession?.user ?? null;
          }
          return prevUser;
        });
      }
    );

    subscription = data.subscription;

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create stable function references using refs - initialized once
  if (!signInRef.current) {
    signInRef.current = async (email: string, password: string) => {
      setLoading(true);
      try {
        const result = await authClient.signIn(email, password);
        if (result.error) {
          console.error("Sign in error:", result.error);

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
  }

  if (!signUpRef.current) {
    signUpRef.current = async (email: string, password: string, metadata?: Record<string, any>) => {
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
  }

  if (!signOutRef.current) {
    signOutRef.current = async () => {
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
  }

  if (!resetPasswordRef.current) {
    resetPasswordRef.current = async (email: string) => {
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
  }

  if (!updatePasswordRef.current) {
    updatePasswordRef.current = async (password: string) => {
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
  }

  // Create a stable context value object - only once
  if (!contextValueRef.current) {
    contextValueRef.current = {
      user: null,
      session: null,
      loading: true,
      signIn: signInRef.current!,
      signUp: signUpRef.current!,
      signOut: signOutRef.current!,
      resetPassword: resetPasswordRef.current!,
      updatePassword: updatePasswordRef.current!,
      isAuthenticated: false,
    };
  }

  // Update the ref values without changing the object reference
  contextValueRef.current.user = user;
  contextValueRef.current.session = session;
  contextValueRef.current.loading = loading;
  contextValueRef.current.isAuthenticated = !!session;
  // Update function references in case they changed
  contextValueRef.current.signIn = signInRef.current!;
  contextValueRef.current.signUp = signUpRef.current!;
  contextValueRef.current.signOut = signOutRef.current!;
  contextValueRef.current.resetPassword = resetPasswordRef.current!;
  contextValueRef.current.updatePassword = updatePasswordRef.current!;

  return (
    <AuthContext.Provider value={contextValueRef.current}>
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

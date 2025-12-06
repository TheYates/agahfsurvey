import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

// Create a Supabase client for server-side auth operations
export const createAuthServerClient = async () => {
  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });
};

// Server-side auth utility functions
export const authServer = {
  // Get current session on server
  getSession: async () => {
    const supabase = await createAuthServerClient();
    return await supabase.auth.getSession();
  },

  // Get current user on server
  getUser: async () => {
    const supabase = await createAuthServerClient();
    return await supabase.auth.getUser();
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    const { data: { session } } = await authServer.getSession();
    return !!session;
  },

  // Get user with role information
  getUserWithRole: async () => {
    const supabase = await createAuthServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return { user: null, role: null, error };
    }

    // Get user role from metadata or from a separate user_roles table
    const role = user.user_metadata?.role || 'user';
    
    return { user, role, error: null };
  },

  // Require authentication (throws if not authenticated)
  requireAuth: async () => {
    const { data: { session }, error } = await authServer.getSession();
    
    if (error || !session) {
      throw new Error('Authentication required');
    }
    
    return session;
  },

  // Require specific role
  requireRole: async (requiredRole: string) => {
    const { user, role, error } = await authServer.getUserWithRole();
    
    if (error || !user) {
      throw new Error('Authentication required');
    }
    
    if (role !== requiredRole) {
      throw new Error(`Role '${requiredRole}' required`);
    }
    
    return { user, role };
  },
};

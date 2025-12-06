import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Creates a Supabase client for server components with proper cookie handling
 * Uses @supabase/supabase-js directly for compatibility
 */
export const createServerClient = async () => {
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

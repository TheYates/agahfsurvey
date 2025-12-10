import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Use globalThis to persist singleton across HMR in development
const globalForSupabase = globalThis as unknown as {
  supabaseClient: SupabaseClient<Database> | undefined
}

// Create a single instance of the Supabase client to be reused
export const createClient = () => {
  if (!globalForSupabase.supabaseClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error("Missing Supabase environment variables");
    }

    globalForSupabase.supabaseClient = createSupabaseClient<Database>(url, key);
  }

  return globalForSupabase.supabaseClient;
}

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single instance of the Supabase client to be reused
export const createClient = () => {
  return createBrowserSupabaseClient<Database>()
}

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./supabase/database.types";

// Create a Supabase client for client-side operations
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/supabase/database.types";

// Create a single instance of the Supabase client to be reused
export const createClient = () => {
  // During build time, the environment variables might not be available
  // This check prevents the "Invalid URL" error
  if (
    typeof window === "undefined" &&
    (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  ) {
    // Return a mock client for server-side rendering during build
    return {
      from: () => ({
        select: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    } as any;
  }

  return createClientComponentClient<Database>();
};

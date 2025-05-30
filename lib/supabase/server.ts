import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "@/lib/supabase/database.types";

// Simple cache for the client to avoid creating multiple instances in the same request
let clientCache: ReturnType<
  typeof createServerComponentClient<Database>
> | null = null;

/**
 * Creates a Supabase client for server components with proper cookie handling
 * Updated for Next.js 15.2.4 to avoid the error:
 * "Route used `cookies().get()`. `cookies()` should be awaited before using its value."
 */
export const createServerClient = async () => {
  // Return cached client if available (will be reset between requests)
  if (clientCache) {
    return clientCache;
  }

  // First get the cookie store
  const cookieStore = cookies();

  // Create a new client and update the cache
  clientCache = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  });

  return clientCache;
};

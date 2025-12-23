import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if the request is for a report page
  if (req.nextUrl.pathname.startsWith("/reports/")) {
    // Prevent caching of reports to ensure users see fresh data
    // Use no-cache to force revalidation with server on each request
    res.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate, max-age=0"
    );
    res.headers.set("Pragma", "no-cache");
    res.headers.set("Expires", "0");
  }

  // Note: Auth checks are now handled in the route components themselves
  // using the SupabaseAuthProvider and useSupabaseAuth hook
  // This avoids middleware compatibility issues with different Supabase versions

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

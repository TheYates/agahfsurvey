import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Check if the request is for a report page
  if (req.nextUrl.pathname.startsWith("/reports/")) {
    // Add cache-control headers to improve performance
    res.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );
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

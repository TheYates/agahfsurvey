import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  const protectedRoutes = ["/admin"];
  const authRoutes = ["/auth/login", "/auth/signup", "/auth/forgot-password"];

  const isProtectedRoute = protectedRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some(route =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated and trying to access auth routes, redirect to admin
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Check if the request is for a report page
  if (req.nextUrl.pathname.startsWith("/reports/")) {
    // Add cache-control headers to improve performance
    res.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );
  }

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

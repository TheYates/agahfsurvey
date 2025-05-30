import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if the request is for a report page
  if (request.nextUrl.pathname.startsWith("/reports/")) {
    // Create a response object
    const response = NextResponse.next();

    // Add cache-control headers to improve performance
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300"
    );

    return response;
  }

  // For other routes, just continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/reports/:path*"],
};

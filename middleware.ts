import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes, static files, and login page
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Check authentication for dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const accessToken = request.cookies.get("access_token");
    const tokenExp = request.cookies.get("token_exp");

    // If no token, redirect to login
    if (!accessToken) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if token is expired (basic check - actual refresh happens in proxy)
    if (tokenExp) {
      const exp = parseInt(tokenExp.value, 10);
      const now = Math.floor(Date.now() / 1000);

      // If token is expired, let the proxy handle refresh
      // We just check if refresh token exists
      if (exp <= now) {
        const refreshToken = request.cookies.get("refresh_token");

        // If no refresh token, redirect to login
        if (!refreshToken) {
          const loginUrl = new URL("/", request.url);
          loginUrl.searchParams.set("from", pathname);
          return NextResponse.redirect(loginUrl);
        }

        // If refresh token exists, let proxy handle the refresh
        // Continue to the route
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

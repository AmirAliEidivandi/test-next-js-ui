import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Middleware for potential server-side checks
  // Since we're using localStorage (client-side), authentication is handled by AuthGuard component
  // This middleware can be extended for cookie-based auth or other server-side checks
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}


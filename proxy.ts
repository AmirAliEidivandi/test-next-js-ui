import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export default function proxy(request: NextRequest) {
  // Proxy for potential server-side checks
  // Since we're using localStorage (client-side), authentication is handled by AuthGuard component
  // This proxy can be extended for cookie-based auth or other server-side checks

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

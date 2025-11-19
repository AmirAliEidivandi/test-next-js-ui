import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token");
    const tokenExp = cookieStore.get("token_exp");

    if (!accessToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Check if token is expired
    if (tokenExp) {
      const exp = parseInt(tokenExp.value, 10);
      const now = Math.floor(Date.now() / 1000);

      if (exp <= now) {
        return NextResponse.json({ authenticated: false, expired: true }, { status: 401 });
      }
    }

    return NextResponse.json({ authenticated: true });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}


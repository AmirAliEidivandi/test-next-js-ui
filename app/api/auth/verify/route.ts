import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://meat-core-dev.darkube.app";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { valid: false, message: "توکن یافت نشد" },
        { status: 401 }
      );
    }

    // Verify token with backend
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        version: "1",
        branch: "ISFAHAN",
      },
      body: JSON.stringify({ token: accessToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Verify token error:", error);
    return NextResponse.json(
      {
        valid: false,
        message:
          error instanceof Error ? error.message : "خطای اتصال به سرور",
      },
      { status: 500 }
    );
  }
}


import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://meat-core-dev.darkube.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward login request to backend
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        version: "1",
        branch: "ISFAHAN",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: response.statusText || "خطایی رخ داد",
      }));

      return NextResponse.json(
        {
          message: errorData.message || "خطایی رخ داد",
          errors: errorData.errors,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Store tokens in httpOnly cookies
    const cookieStore = await cookies();
    const expiresAt = new Date(data.exp * 1000);
    const refreshExpiresAt = new Date(data.refresh_exp * 1000);

    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: refreshExpiresAt,
      path: "/",
    });

    cookieStore.set("token_type", data.token_type, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    cookieStore.set("token_exp", data.exp.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    cookieStore.set("refresh_exp", data.refresh_exp.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: refreshExpiresAt,
      path: "/",
    });

    // Return success without tokens (security)
    return NextResponse.json({
      success: true,
      message: "ورود با موفقیت انجام شد",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "خطای اتصال به سرور",
      },
      { status: 500 }
    );
  }
}


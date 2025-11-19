import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://meat-core-dev.darkube.app";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";

    // Call backend logout if we have a token
    if (accessToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${tokenType} ${accessToken}`,
            version: "1",
            branch: "ISFAHAN",
          },
        });
      } catch (error) {
        // Continue with cookie deletion even if backend call fails
        console.error("Backend logout error:", error);
      }
    }

    // Clear all auth cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("token_type");
    cookieStore.delete("token_exp");
    cookieStore.delete("refresh_exp");

    return NextResponse.json({ success: true, message: "خروج با موفقیت انجام شد" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "خطا در خروج",
      },
      { status: 500 }
    );
  }
}


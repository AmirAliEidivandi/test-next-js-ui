import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://meat-core-dev.darkube.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, path, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, path, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, path, "PUT");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, path, "DELETE");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxyRequest(request, path, "PATCH");
}

async function handleProxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";

    // Build the target URL
    const path = pathSegments.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `${API_BASE_URL}/${path}${
      searchParams ? `?${searchParams}` : ""
    }`;

    // Check if request is multipart/form-data (file upload)
    const contentType = request.headers.get("content-type") || "";
    const isMultipartFormData = contentType.includes("multipart/form-data");

    // Prepare headers
    const headers: HeadersInit = {
      version: "1",
      branch: "ISFAHAN",
    };

    // Only set Content-Type for non-multipart requests
    // For multipart/form-data, browser sets it automatically with boundary
    if (!isMultipartFormData) {
      headers["Content-Type"] = "application/json";
    }

    // Add authorization header if token exists
    if (accessToken) {
      headers.Authorization = `${tokenType} ${accessToken}`;
    }

    // Get request body for POST, PUT, PATCH
    let body: string | FormData | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      if (isMultipartFormData) {
        // For file uploads, use FormData directly
        body = await request.formData();
      } else {
        // For JSON requests, parse and stringify
        try {
          const requestBody = await request.json();
          body = JSON.stringify(requestBody);
        } catch {
          // No body or invalid JSON, continue without body
          body = undefined;
        }
      }
    }

    // Forward request to backend
    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    // Handle 401 - Token might be expired, try to refresh
    if (response.status === 401 && accessToken) {
      const refreshToken = cookieStore.get("refresh_token")?.value;

      if (refreshToken) {
        try {
          // Try to refresh token
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              version: "1",
              branch: "ISFAHAN",
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();

            // Update cookies with new tokens
            const expiresAt = new Date(refreshData.exp * 1000);
            const refreshExpiresAt = new Date(refreshData.refresh_exp * 1000);

            cookieStore.set("access_token", refreshData.access_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: expiresAt,
              path: "/",
            });

            cookieStore.set("refresh_token", refreshData.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: refreshExpiresAt,
              path: "/",
            });

            cookieStore.set("token_type", refreshData.token_type, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: expiresAt,
              path: "/",
            });

            cookieStore.set("token_exp", refreshData.exp.toString(), {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: expiresAt,
              path: "/",
            });

            cookieStore.set("refresh_exp", refreshData.refresh_exp.toString(), {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              expires: refreshExpiresAt,
              path: "/",
            });

            // Retry original request with new token
            headers.Authorization = `${refreshData.token_type} ${refreshData.access_token}`;

            const retryResponse = await fetch(targetUrl, {
              method,
              headers,
              body,
            });

            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({
                message: retryResponse.statusText || "خطایی رخ داد",
              }));

              return NextResponse.json(
                {
                  message: errorData.message || "خطایی رخ داد",
                  errors: errorData.errors,
                },
                { status: retryResponse.status }
              );
            }

            // Check if response is PDF or other binary data
            const retryContentType =
              retryResponse.headers.get("content-type") || "";
            if (
              retryContentType.includes("application/pdf") ||
              retryContentType.includes("application/octet-stream")
            ) {
              const blob = await retryResponse.blob();
              return new NextResponse(blob, {
                status: retryResponse.status,
                headers: {
                  "Content-Type": retryContentType,
                  "Content-Disposition":
                    retryResponse.headers.get("content-disposition") || "",
                },
              });
            }

            const retryData = await retryResponse.json();
            return NextResponse.json(retryData);
          }
        } catch (refreshError) {
          console.error("Token refresh error:", refreshError);
        }
      }

      // Refresh failed or no refresh token, clear cookies and return 401
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      cookieStore.delete("token_type");
      cookieStore.delete("token_exp");
      cookieStore.delete("refresh_exp");

      return NextResponse.json(
        { message: "احراز هویت نامعتبر است" },
        { status: 401 }
      );
    }

    // Handle other errors
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

    // Check if response is PDF or other binary data
    const responseContentType = response.headers.get("content-type") || "";
    if (
      responseContentType.includes("application/pdf") ||
      responseContentType.includes("application/octet-stream")
    ) {
      const blob = await response.blob();
      return new NextResponse(blob, {
        status: response.status,
        headers: {
          "Content-Type": responseContentType,
          "Content-Disposition":
            response.headers.get("content-disposition") || "",
        },
      });
    }

    // Return successful response
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "خطای اتصال به سرور",
      },
      { status: 500 }
    );
  }
}

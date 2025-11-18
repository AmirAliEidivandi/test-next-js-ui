import { getAccessToken, getTokenType } from "@/lib/auth/token";
import type { ApiError } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://meat-core-dev.darkube.app";

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const token = getAccessToken();
    const tokenType = getTokenType() || "Bearer";
    const authHeader = token ? `${tokenType} ${token}` : undefined;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        version: "1",
        branch: "ISFAHAN",
        ...(authHeader && { Authorization: authHeader }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: response.statusText || "خطایی رخ داد",
        }));

        const error: ApiError = {
          message: errorData.message || "خطایی رخ داد",
          status: response.status,
          errors: errorData.errors,
        };

        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && "status" in error) {
        throw error;
      }

      const apiError: ApiError = {
        message: error instanceof Error ? error.message : "خطای اتصال به سرور",
      };

      throw apiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();

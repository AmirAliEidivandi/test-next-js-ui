import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyTokenRequest,
  VerifyTokenResponse,
} from "./types";

export const authApi = {
  /**
   * Login with mobile and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  },
  async logout(): Promise<void> {
    return apiClient.post<void>("/auth/logout");
  },
  async refreshToken(
    credentials: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    return apiClient.post<RefreshTokenResponse>("/auth/refresh", credentials);
  },
  async verifyToken(
    credentials: VerifyTokenRequest
  ): Promise<VerifyTokenResponse> {
    return apiClient.post<VerifyTokenResponse>(
      "/auth/verify-token",
      credentials
    );
  },
};

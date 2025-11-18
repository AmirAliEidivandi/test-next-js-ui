import { apiClient } from "./client";
import type { LoginRequest, LoginResponse } from "./types";

export const authApi = {
  /**
   * Login with mobile and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>("/auth/login", credentials);
  },
};

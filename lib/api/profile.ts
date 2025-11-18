import { apiClient } from "./client";
import type { GetProfileInfoResponse, ProfileRoles } from "./types";

export const profileApi = {
  /**
   * Get current user profile info
   */
  async getProfileInfo(): Promise<GetProfileInfoResponse> {
    return apiClient.get<GetProfileInfoResponse>("/profiles/info");
  },

  /**
   * Get current user roles
   */
  async getProfileRoles(): Promise<ProfileRoles> {
    return apiClient.get<ProfileRoles>("/profiles/roles");
  },
};

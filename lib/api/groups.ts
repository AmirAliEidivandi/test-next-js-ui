import { apiClient } from "./client";
import { GetGroupsResponse } from "./types";

export const groupsApi = {
  /**
   * Get list of groups
   */
  async getGroups(): Promise<GetGroupsResponse> {
    const params = new URLSearchParams();
    const pageSize = 100;
    params.append("page-size", pageSize.toString());
    return apiClient.get<GetGroupsResponse>(`/groups?${params.toString()}`);
  },
};

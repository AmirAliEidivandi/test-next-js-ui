import { apiClient } from "./client";
import type {
  CreateProfileDto,
  GetEmployeeProfileResponse,
  GetProfileInfoResponse,
  GetProfileResponse,
  GetProfilesResponse,
  ProfileRoles,
  QueryProfile,
  UpdateEmployeeProfileRequest,
} from "./types";

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

  /**
   * Get list of profiles
   */
  async getProfiles(query: QueryProfile): Promise<GetProfilesResponse> {
    const params = new URLSearchParams();

    if (query.page) {
      params.append("page", query.page.toString());
    }
    if (query["page-size"]) {
      params.append("page-size", query["page-size"].toString());
    }
    if (query.enabled !== undefined) {
      params.append("enabled", query.enabled.toString());
    }
    if (query.mobile) {
      params.append("mobile", query.mobile);
    }
    if (query.username) {
      params.append("username", query.username);
    }
    if (query.first_name) {
      params.append("first_name", query.first_name);
    }
    if (query.last_name) {
      params.append("last_name", query.last_name);
    }
    if (query.gender) {
      params.append("gender", query.gender);
    }
    if (query.created_at_min) {
      params.append("created_at_min", query.created_at_min.toISOString());
    }
    if (query.created_at_max) {
      params.append("created_at_max", query.created_at_max.toISOString());
    }
    const queryString = params.toString();
    return apiClient.get<GetProfilesResponse>(
      `/profiles/non-employees${queryString ? `?${queryString}` : ""}`
    );
  },
  /**
   * Get profile by id
   */
  async getProfile(id: string): Promise<GetProfileResponse> {
    return apiClient.get<GetProfileResponse>(`/profiles/${id}`);
  },
  /**
   * Update profile
   */
  async updateProfile(
    id: string,
    request: UpdateEmployeeProfileRequest
  ): Promise<GetProfileResponse> {
    return apiClient.put<GetProfileResponse>(`/profiles/${id}`, request);
  },
  /**
   * get employees profile
   */
  async getEmployeesProfile(query: QueryProfile): Promise<GetProfilesResponse> {
    const params = new URLSearchParams();

    if (query.page) {
      params.append("page", query.page.toString());
    }
    if (query["page-size"]) {
      params.append("page-size", query["page-size"].toString());
    }
    if (query.enabled !== undefined) {
      params.append("enabled", query.enabled.toString());
    }
    if (query.mobile) {
      params.append("mobile", query.mobile);
    }
    if (query.username) {
      params.append("username", query.username);
    }
    if (query.first_name) {
      params.append("first_name", query.first_name);
    }
    if (query.last_name) {
      params.append("last_name", query.last_name);
    }
    if (query.gender) {
      params.append("gender", query.gender);
    }
    if (query.created_at_min) {
      params.append("created_at_min", query.created_at_min.toISOString());
    }
    if (query.created_at_max) {
      params.append("created_at_max", query.created_at_max.toISOString());
    }
    const queryString = params.toString();
    return apiClient.get<GetProfilesResponse>(
      `/profiles/employees${queryString ? `?${queryString}` : ""}`
    );
  },
  /**
   * Create employee profile
   */
  async createProfile(
    request: CreateProfileDto
  ): Promise<GetEmployeeProfileResponse> {
    return apiClient.post<GetEmployeeProfileResponse>("/profiles", request);
  },
  /**
   * Get employee profile by id
   */
  async getEmployeeProfile(id: string): Promise<GetEmployeeProfileResponse> {
    return apiClient.get<GetEmployeeProfileResponse>(
      `/profiles/employees/${id}`
    );
  },
};

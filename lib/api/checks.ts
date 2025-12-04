import { apiClient } from "./client";
import type {
  CheckStatusEnum,
  GetCheckResponse,
  GetChecksResponse,
  QueryCheck,
} from "./types";

const buildCheckQueryString = (query?: QueryCheck) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.check_date_min) {
    params.append("check_date_min", query.check_date_min.toISOString());
  }
  if (query?.check_date_max) {
    params.append("check_date_max", query.check_date_max.toISOString());
  }
  if (query?.amount_min !== undefined) {
    params.append("amount_min", query.amount_min.toString());
  }
  if (query?.amount_max !== undefined) {
    params.append("amount_max", query.amount_max.toString());
  }
  if (query?.status) {
    params.append("status", query.status);
  }
  return params.toString();
};

export const checksApi = {
  async getChecks(query?: QueryCheck): Promise<GetChecksResponse> {
    const queryString = buildCheckQueryString(query);
    const endpoint = `/accountants/checks${
      queryString ? `?${queryString}` : ""
    }`;
    return apiClient.get<GetChecksResponse>(endpoint);
  },
  async getCheck(checkId: string): Promise<GetCheckResponse> {
    const endpoint = `/accountants/checks/${checkId}`;
    return apiClient.get<GetCheckResponse>(endpoint);
  },
  async changeCheckStatus(
    checkId: string,
    status: CheckStatusEnum
  ): Promise<{ success: boolean; message: string }> {
    const endpoint = `/accountants/checks/${checkId}/status`;
    return apiClient.patch<{ success: boolean; message: string }>(endpoint, {
      status,
    });
  },
};

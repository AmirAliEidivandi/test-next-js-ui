import { apiClient } from "./client";
import {
  GetReturnRequestResponse,
  GetReturnRequestsResponse,
  QueryReturnRequest,
} from "./types";

const buildReturnRequestQueryString = (query?: QueryReturnRequest) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.customer_id) {
    params.append("customer_id", query.customer_id);
  }
  return params.toString();
};

export const returnRequestsApi = {
  async getReturnRequests(
    query?: QueryReturnRequest
  ): Promise<GetReturnRequestsResponse> {
    const queryString = buildReturnRequestQueryString(query);
    const endpoint = `/return-requests${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<GetReturnRequestsResponse>(endpoint);
  },
  async getReturnRequest(id: string): Promise<GetReturnRequestResponse> {
    const endpoint = `/return-requests/${id}`;
    return apiClient.get<GetReturnRequestResponse>(endpoint);
  },
};

import { apiClient } from "./client";
import type {
  GetCustomerRequestsResponse,
  GetCustomerRequestResponse,
  QueryCustomerRequest,
} from "./types";

const buildCustomerRequestQueryString = (query?: QueryCustomerRequest) => {
  if (!query) return "";

  const params = new URLSearchParams();

  if (query.page) {
    params.append("page", query.page.toString());
  }
  if (query["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query.payment_method) {
    params.append("payment_method", query.payment_method);
  }
  if (query.status) {
    params.append("status", query.status);
  }
  if (query.customer_id) {
    params.append("customer_id", query.customer_id);
  }
  if (query.code !== undefined) {
    params.append("code", query.code.toString());
  }
  if (query.created_at_min) {
    params.append("created_at_min", query.created_at_min.toISOString());
  }
  if (query.created_at_max) {
    params.append("created_at_max", query.created_at_max.toISOString());
  }

  return params.toString();
};

export const customerRequestsApi = {
  async getCustomerRequests(
    query?: QueryCustomerRequest
  ): Promise<GetCustomerRequestsResponse> {
    const queryString = buildCustomerRequestQueryString(query);
    const endpoint = `/customer-requests${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get<GetCustomerRequestsResponse>(endpoint);
  },
  async getCustomerRequest(id: string): Promise<GetCustomerRequestResponse> {
    const endpoint = `/customer-requests/${id}`;
    return apiClient.get<GetCustomerRequestResponse>(endpoint);
  },
};

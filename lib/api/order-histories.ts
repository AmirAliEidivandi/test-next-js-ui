import { apiClient } from "./client";
import {
  GetOrderHistoryResponse,
  GetOrdersHistoryResponse,
  QueryOrderHistory,
} from "./types";

const buildOrderHistoryQueryString = (query?: QueryOrderHistory) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  return params.toString();
};

export const orderHistoriesApi = {
  async getOrderHistories(
    query?: QueryOrderHistory
  ): Promise<GetOrdersHistoryResponse> {
    const queryString = buildOrderHistoryQueryString(query);
    const endpoint = `/order-history${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<GetOrdersHistoryResponse>(endpoint);
  },
  async getOrderHistory(id: string): Promise<GetOrderHistoryResponse> {
    const endpoint = `/order-history/${id}`;
    return apiClient.get<GetOrderHistoryResponse>(endpoint);
  },
};

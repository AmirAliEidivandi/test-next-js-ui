import { apiClient } from "./client";
import {
  GetReceivingResponse,
  GetReceivingsResponse,
  QueryReceiving,
} from "./types";

const buildReceivingQueryString = (query?: QueryReceiving) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.product_id) {
    params.append("product_id", query.product_id);
  }
  if (query?.customer_id) {
    params.append("customer_id", query.customer_id);
  }
  if (query?.source) {
    params.append("source", query.source);
  }
  if (query?.from) {
    params.append("from", query.from.toISOString());
  }
  if (query?.to) {
    params.append("to", query.to.toISOString());
  }
  if (query?.code) {
    params.append("code", query.code.toString());
  }
  return params.toString();
};

export const receivingsApi = {
  async getReceivings(
    warehouseId: string,
    query?: QueryReceiving
  ): Promise<GetReceivingsResponse> {
    const queryString = buildReceivingQueryString(query);
    const endpoint = `/receivings/warehouse/${warehouseId}${
      queryString ? `?${queryString}` : ""
    }`;
    return apiClient.get<GetReceivingsResponse>(endpoint);
  },
  async getReceiving(receivingId: string): Promise<GetReceivingResponse> {
    const endpoint = `/receivings/${receivingId}`;
    return apiClient.get<GetReceivingResponse>(endpoint);
  },
};

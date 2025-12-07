import { apiClient } from "./client";
import {
  GetDispatchingResponse,
  GetDispatchingsResponse,
  QueryDispatching,
} from "./types";

const buildDispatchingQueryString = (query?: QueryDispatching) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  return params.toString();
};

export const dispatchingsApi = {
  async getDispatchings(
    warehouseId: string,
    query?: QueryDispatching
  ): Promise<GetDispatchingsResponse> {
    const queryString = buildDispatchingQueryString(query);
    const endpoint = `/dispatchings/warehouse/${warehouseId}${
      queryString ? `?${queryString}` : ""
    }`;
    return apiClient.get<GetDispatchingsResponse>(endpoint);
  },
  async getDispatching(dispatchingId: string): Promise<GetDispatchingResponse> {
    const endpoint = `/dispatchings/${dispatchingId}`;
    return apiClient.get<GetDispatchingResponse>(endpoint);
  },
};

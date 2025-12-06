import { apiClient } from "./client";
import type { GetWarehousesResponse } from "./types";

export const warehousesApi = {
  async getWarehouses(): Promise<GetWarehousesResponse> {
    return apiClient.get<GetWarehousesResponse>("/warehouses");
  },
};

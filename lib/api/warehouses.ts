import { apiClient } from "./client";
import type { GetWarehouseResponse, GetWarehousesResponse } from "./types";

export const warehousesApi = {
  async getWarehouses(): Promise<GetWarehousesResponse> {
    return apiClient.get<GetWarehousesResponse>("/warehouses");
  },
  async getWarehouse(id: string): Promise<GetWarehouseResponse> {
    return apiClient.get<GetWarehouseResponse>(`/warehouses/${id}`);
  },
};

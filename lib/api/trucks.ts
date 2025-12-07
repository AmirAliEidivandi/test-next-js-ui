import { apiClient } from "./client";
import { GetTruckResponse, GetTrucksResponse } from "./types";

export const trucksApi = {
  async getTrucks(warehouseId: string): Promise<GetTrucksResponse> {
    return apiClient.get<GetTrucksResponse>(`/trucks/warehouse/${warehouseId}`);
  },
  async getTruck(id: string): Promise<GetTruckResponse> {
    return apiClient.get<GetTruckResponse>(`/trucks/${id}`);
  },
};

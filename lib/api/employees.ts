import { apiClient } from "./client";
import type { GetEmployeeInfoResponse, GetSellersResponse } from "./types";

export const employeesApi = {
  /**
   * Get employee info by ID
   */
  async getEmployeeInfo(employeeId: string): Promise<GetEmployeeInfoResponse> {
    return apiClient.get<GetEmployeeInfoResponse>(
      `/employees/info?id=${employeeId}`
    );
  },

  /**
   * Get list of sellers
   */
  async getSellers(): Promise<GetSellersResponse[]> {
    return apiClient.get<GetSellersResponse[]>("/employees/sellers");
  },
};

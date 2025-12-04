import { apiClient } from "./client";
import type {
  GetEmployeeInfoResponse,
  GetEmployeesResponse,
  GetSellersResponse,
  GetVisitorsResponse,
} from "./types";

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

  /**
   * Get list of visitors
   */
  async getVisitors(): Promise<GetVisitorsResponse> {
    return apiClient.get<GetVisitorsResponse>("/employees/visitors");
  },

  /**
   * Get list of employees
   */
  async getEmployees(): Promise<GetEmployeesResponse> {
    return apiClient.get<GetEmployeesResponse>("/employees");
  },
};

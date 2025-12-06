import { apiClient } from "./client";
import {
  GetCategoriesResponse,
  GetCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
} from "./types";

export const categoriesApi = {
  async getCategories(warehouseId: string): Promise<GetCategoriesResponse> {
    return apiClient.get<GetCategoriesResponse>(
      `/categories/warehouse/${warehouseId}`
    );
  },
  async getCategory(id: string): Promise<GetCategoryResponse> {
    return apiClient.get<GetCategoryResponse>(`/categories/${id}`);
  },
  async updateCategory(
    id: string,
    request: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> {
    return apiClient.put<UpdateCategoryResponse>(`/categories/${id}`, request);
  },
};

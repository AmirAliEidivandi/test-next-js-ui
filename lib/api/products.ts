import { apiClient } from "./client";
import {
  GetProductResponse,
  GetProductsResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from "./types";

export const productsApi = {
  async getProducts(warehouseId: string): Promise<GetProductsResponse> {
    return apiClient.get<GetProductsResponse>(
      `/products/warehouse/${warehouseId}`
    );
  },
  async getProduct(id: string): Promise<GetProductResponse> {
    return apiClient.get<GetProductResponse>(`/products/${id}`);
  },
  async updateProduct(
    id: string,
    request: UpdateProductRequest
  ): Promise<UpdateProductResponse> {
    return apiClient.patch<UpdateProductResponse>(`/products/${id}/product`, request);
  },
};

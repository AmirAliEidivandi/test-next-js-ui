import { productsApi } from "@/lib/api/products";
import type { UpdateProductRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (warehouseId?: string) =>
    [...productKeys.lists(), warehouseId] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

// Hooks
export function useProducts(warehouseId?: string) {
  return useQuery({
    queryKey: productKeys.list(warehouseId),
    queryFn: () => {
      if (!warehouseId) {
        throw new Error("warehouseId is required");
      }
      return productsApi.getProducts(warehouseId);
    },
    enabled: !!warehouseId,
  });
}

export function useProduct(id: string | null) {
  return useQuery({
    queryKey: productKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Product ID is required");
      }
      return productsApi.getProduct(id);
    },
    enabled: !!id,
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      // Invalidate products list and detail
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
    },
  });
}

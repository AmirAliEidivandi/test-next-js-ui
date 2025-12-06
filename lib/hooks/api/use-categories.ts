import { categoriesApi } from "@/lib/api/categories";
import type { UpdateCategoryRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (warehouseId?: string) =>
    [...categoryKeys.lists(), warehouseId] as const,
  detail: (id: string) => [...categoryKeys.all, "detail", id] as const,
};

// Hooks
export function useCategories(warehouseId?: string) {
  return useQuery({
    queryKey: categoryKeys.list(warehouseId),
    queryFn: () => {
      if (!warehouseId) {
        throw new Error("warehouseId is required");
      }
      return categoriesApi.getCategories(warehouseId);
    },
    enabled: !!warehouseId,
  });
}

export function useCategory(id: string | null) {
  return useQuery({
    queryKey: categoryKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Category ID is required");
      }
      return categoriesApi.getCategory(id);
    },
    enabled: !!id,
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryRequest;
    }) => categoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      // Invalidate categories list and detail
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
  });
}

import { warehousesApi } from "@/lib/api/warehouses";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  list: () => [...warehouseKeys.lists()] as const,
  detail: (id: string) => [...warehouseKeys.all, "detail", id] as const,
};

// Hooks
export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: () => warehousesApi.getWarehouses(),
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days - انبارها به ندرت تغییر می‌کنند
  });
}

export function useWarehouse(id: string | null) {
  return useQuery({
    queryKey: warehouseKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Warehouse ID is required");
      }
      return warehousesApi.getWarehouse(id);
    },
    enabled: !!id,
  });
}

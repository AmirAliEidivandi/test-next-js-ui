import { warehousesApi } from "@/lib/api/warehouses";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  list: () => [...warehouseKeys.lists()] as const,
};

// Hooks
export function useWarehouses() {
  return useQuery({
    queryKey: warehouseKeys.list(),
    queryFn: () => warehousesApi.getWarehouses(),
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days - انبارها به ندرت تغییر می‌کنند
  });
}

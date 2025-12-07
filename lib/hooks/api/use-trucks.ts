import { trucksApi } from "@/lib/api/trucks";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const truckKeys = {
  all: ["trucks"] as const,
  lists: () => [...truckKeys.all, "list"] as const,
  list: (warehouseId: string) => [...truckKeys.lists(), warehouseId] as const,
  detail: (id: string) => [...truckKeys.all, "detail", id] as const,
};

// Hooks
export function useTrucks(warehouseId: string | null) {
  return useQuery({
    queryKey: truckKeys.list(warehouseId || ""),
    queryFn: () => {
      if (!warehouseId) {
        throw new Error("Warehouse ID is required");
      }
      return trucksApi.getTrucks(warehouseId);
    },
    enabled: !!warehouseId,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days - ماشین‌ها به ندرت تغییر می‌کنند
  });
}

export function useTruck(id: string | null) {
  return useQuery({
    queryKey: truckKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Truck ID is required");
      }
      return trucksApi.getTruck(id);
    },
    enabled: !!id,
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days - ماشین‌ها به ندرت تغییر می‌کنند
  });
}

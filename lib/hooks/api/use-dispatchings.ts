import { dispatchingsApi } from "@/lib/api/dispatchings";
import type { QueryDispatching } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const dispatchingKeys = {
  all: ["dispatchings"] as const,
  lists: () => [...dispatchingKeys.all, "list"] as const,
  list: (warehouseId: string, query?: QueryDispatching) =>
    [...dispatchingKeys.lists(), warehouseId, query] as const,
  detail: (id: string) => [...dispatchingKeys.all, "detail", id] as const,
};

// Hooks
export function useDispatchings(
  warehouseId: string | null,
  query?: QueryDispatching
) {
  return useQuery({
    queryKey: dispatchingKeys.list(warehouseId || "", query),
    queryFn: () => {
      if (!warehouseId) {
        throw new Error("Warehouse ID is required");
      }
      return dispatchingsApi.getDispatchings(warehouseId, query);
    },
    enabled: !!warehouseId,
  });
}

export function useDispatching(id: string | null) {
  return useQuery({
    queryKey: dispatchingKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Dispatching ID is required");
      }
      return dispatchingsApi.getDispatching(id);
    },
    enabled: !!id,
  });
}


import { receivingsApi } from "@/lib/api/receivings";
import type { QueryReceiving } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const receivingKeys = {
  all: ["receivings"] as const,
  lists: () => [...receivingKeys.all, "list"] as const,
  list: (warehouseId: string, query?: QueryReceiving) =>
    [...receivingKeys.lists(), warehouseId, query] as const,
  detail: (id: string) => [...receivingKeys.all, "detail", id] as const,
};

// Hooks
export function useReceivings(
  warehouseId: string | null,
  query?: QueryReceiving
) {
  return useQuery({
    queryKey: receivingKeys.list(warehouseId || "", query),
    queryFn: () => {
      if (!warehouseId) {
        throw new Error("Warehouse ID is required");
      }
      return receivingsApi.getReceivings(warehouseId, query);
    },
    enabled: !!warehouseId,
  });
}

export function useReceiving(id: string | null) {
  return useQuery({
    queryKey: receivingKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Receiving ID is required");
      }
      return receivingsApi.getReceiving(id);
    },
    enabled: !!id,
  });
}


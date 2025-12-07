import { ordersApi } from "@/lib/api/orders";
import type { QueryOrder } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: QueryOrder) => [...orderKeys.lists(), filters] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrders(filters?: QueryOrder) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersApi.getOrders(filters),
    enabled: true,
  });
}

export function useOrder(id: string | null) {
  return useQuery({
    queryKey: orderKeys.detail(id || ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Order ID is required");
      }
      return ordersApi.getOrder(id);
    },
    enabled: !!id,
  });
}
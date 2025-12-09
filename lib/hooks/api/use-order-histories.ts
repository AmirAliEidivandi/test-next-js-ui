import { orderHistoriesApi } from "@/lib/api/order-histories";
import type { QueryOrderHistory } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

export const orderHistoryKeys = {
  all: ["order-histories"] as const,
  lists: () => [...orderHistoryKeys.all, "list"] as const,
  list: (filters?: QueryOrderHistory) =>
    [...orderHistoryKeys.lists(), filters] as const,
  detail: (id: string) => [...orderHistoryKeys.all, "detail", id] as const,
};

export function useOrderHistories(filters?: QueryOrderHistory) {
  return useQuery({
    queryKey: orderHistoryKeys.list(filters),
    queryFn: () => orderHistoriesApi.getOrderHistories(filters),
    enabled: true,
  });
}

export function useOrderHistory(id: string | null) {
  return useQuery({
    queryKey: orderHistoryKeys.detail(id!),
    queryFn: () => orderHistoriesApi.getOrderHistory(id!),
    enabled: !!id,
  });
}


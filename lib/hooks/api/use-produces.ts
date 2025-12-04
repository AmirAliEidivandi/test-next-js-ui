import { producesApi } from "@/lib/api/produces";
import type { QueryProduce } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const produceKeys = {
  all: ["produces"] as const,
  lists: () => [...produceKeys.all, "list"] as const,
  list: (filters?: QueryProduce) => [...produceKeys.lists(), filters] as const,
  details: () => [...produceKeys.all, "detail"] as const,
  detail: (id: string | null) => [...produceKeys.details(), id] as const,
};

// Hooks
export function useProduces(filters?: QueryProduce) {
  return useQuery({
    queryKey: produceKeys.list(filters),
    queryFn: () => producesApi.getProduces(filters),
    enabled: true,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useProduce(id: string | null) {
  return useQuery({
    queryKey: produceKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error("Produce ID is required");
      return producesApi.getProduce(id);
    },
    enabled: !!id,
  });
}


import { statsApi } from "@/lib/api/stats";
import type { QueryProductKardex } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const statsKeys = {
  all: ["stats"] as const,
  productKardex: (query: QueryProductKardex) =>
    [...statsKeys.all, "product-kardex", query] as const,
};

// Hooks
export function useProductKardex(query: QueryProductKardex | null) {
  return useQuery({
    queryKey: query ? statsKeys.productKardex(query) : ["stats", "product-kardex", "disabled"],
    queryFn: () => {
      if (!query) throw new Error("Query is required");
      return statsApi.getProductKardex(query);
    },
    enabled: !!query && !!query.product_id,
  });
}


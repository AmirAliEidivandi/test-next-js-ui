import { returnRequestsApi } from "@/lib/api/return-requests";
import type { QueryReturnRequest } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const returnRequestKeys = {
  all: ["return-requests"] as const,
  lists: () => [...returnRequestKeys.all, "list"] as const,
  list: (filters?: QueryReturnRequest) =>
    [...returnRequestKeys.lists(), filters] as const,
};

// Hooks
export function useReturnRequests(filters?: QueryReturnRequest) {
  return useQuery({
    queryKey: returnRequestKeys.list(filters),
    queryFn: () => returnRequestsApi.getReturnRequests(filters),
    enabled: true,
  });
}


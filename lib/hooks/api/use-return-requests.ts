import { returnRequestsApi } from "@/lib/api/return-requests";
import type { QueryReturnRequest } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const returnRequestKeys = {
  all: ["return-requests"] as const,
  lists: () => [...returnRequestKeys.all, "list"] as const,
  list: (filters?: QueryReturnRequest) =>
    [...returnRequestKeys.lists(), filters] as const,
  detail: (id: string) => [...returnRequestKeys.all, "detail", id] as const,
};

// Hooks
export function useReturnRequests(filters?: QueryReturnRequest) {
  return useQuery({
    queryKey: returnRequestKeys.list(filters),
    queryFn: () => returnRequestsApi.getReturnRequests(filters),
    enabled: true,
  });
}

export function useReturnRequest(id: string | null) {
  return useQuery({
    queryKey: returnRequestKeys.detail(id!),
    queryFn: () => returnRequestsApi.getReturnRequest(id!),
    enabled: !!id,
  });
}


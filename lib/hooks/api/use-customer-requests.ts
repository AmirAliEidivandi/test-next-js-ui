import { customerRequestsApi } from "@/lib/api/customer-requests";
import type { QueryCustomerRequest } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

export const customerRequestKeys = {
  all: ["customer-requests"] as const,
  lists: () => [...customerRequestKeys.all, "list"] as const,
  list: (filters?: QueryCustomerRequest) =>
    [...customerRequestKeys.lists(), filters] as const,
  detail: (id: string) => [...customerRequestKeys.all, "detail", id] as const,
};

export function useCustomerRequests(filters?: QueryCustomerRequest) {
  return useQuery({
    queryKey: customerRequestKeys.list(filters),
    queryFn: () => customerRequestsApi.getCustomerRequests(filters),
    enabled: true,
  });
}

export function useCustomerRequest(id: string | null) {
  return useQuery({
    queryKey: customerRequestKeys.detail(id!),
    queryFn: () => customerRequestsApi.getCustomerRequest(id!),
    enabled: !!id,
  });
}
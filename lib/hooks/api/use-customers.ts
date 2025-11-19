import { customersApi } from "@/lib/api/customers";
import type { QueryCapillarySalesLine, QueryCustomer } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters?: QueryCustomer) =>
    [...customerKeys.lists(), filters] as const,
  detail: (id: string) => [...customerKeys.all, "detail", id] as const,
  byDebt: (filters?: QueryCustomer) =>
    [...customerKeys.all, "by-debt", filters] as const,
  lastOrder: (filters?: QueryCustomer) =>
    [...customerKeys.all, "last-order", filters] as const,
  salesLines: (filters?: QueryCapillarySalesLine) =>
    [...customerKeys.all, "sales-lines", filters] as const,
};

// Hooks
export function useCustomers(filters?: QueryCustomer) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customersApi.getCustomers(filters),
    enabled: true,
  });
}

export function useCustomersByDebt(filters?: QueryCustomer) {
  return useQuery({
    queryKey: customerKeys.byDebt(filters),
    queryFn: () => customersApi.getCustomersByDebt(filters),
    enabled: true,
  });
}

export function useCustomersLastOrder(filters?: QueryCustomer) {
  return useQuery({
    queryKey: customerKeys.lastOrder(filters),
    queryFn: () => customersApi.getCustomersLastOrder(filters),
    enabled: true,
  });
}

export function useCapillarySalesLines(filters?: QueryCapillarySalesLine) {
  return useQuery({
    queryKey: customerKeys.salesLines(filters),
    queryFn: () => customersApi.getCapillarySalesLines(filters),
    enabled: true,
  });
}

import { invoicesApi } from "@/lib/api/invoices";
import type { QueryInvoice } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

export const invoiceKeys = {
  all: ["invoices"] as const,
  lists: () => [...invoiceKeys.all, "list"] as const,
  list: (filters?: QueryInvoice) => [...invoiceKeys.lists(), filters] as const,
  detail: (id: string) => [...invoiceKeys.all, "detail", id] as const,
};

export function useInvoices(filters?: QueryInvoice) {
  return useQuery({
    queryKey: invoiceKeys.list(filters),
    queryFn: () => invoicesApi.getInvoices(filters),
    enabled: true,
  });
}

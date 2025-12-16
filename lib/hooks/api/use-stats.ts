import { statsApi } from "@/lib/api/stats";
import type { QueryProductKardex, QueryStats } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const statsKeys = {
  all: ["stats"] as const,
  productKardex: (query: QueryProductKardex) =>
    [...statsKeys.all, "product-kardex", query] as const,
  customerStats: (query?: QueryStats) =>
    [...statsKeys.all, "customer-stats", query] as const,
  inactiveCustomers: (query?: QueryStats) =>
    [...statsKeys.all, "inactive-customers", query] as const,
  customersWithoutPurchase: (query?: QueryStats) =>
    [...statsKeys.all, "customers-without-purchase", query] as const,
  actualCustomerDebt: (query?: QueryStats) =>
    [...statsKeys.all, "actual-customer-debt", query] as const,
  sellersReport: (query?: QueryStats) =>
    [...statsKeys.all, "sellers-report", query] as const,
  productsSummary: (query?: QueryStats) =>
    [...statsKeys.all, "products-summary", query] as const,
  productsPeriod: (query?: QueryStats) =>
    [...statsKeys.all, "products-period", query] as const,
  negativeInventory: (query?: QueryStats) =>
    [...statsKeys.all, "negative-inventory", query] as const,
  returnedProducts: (query?: QueryStats) =>
    [...statsKeys.all, "returned-products", query] as const,
  returnedOrders: (query?: QueryStats) =>
    [...statsKeys.all, "returned-orders", query] as const,
  categorySales: (query?: QueryStats) =>
    [...statsKeys.all, "category-sales", query] as const,
  dayOfPurchase: (query?: QueryStats) =>
    [...statsKeys.all, "day-of-purchase", query] as const,
  paymentStatus: (query?: QueryStats) =>
    [...statsKeys.all, "payment-status", query] as const,
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

export function useCustomerStats(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.customerStats(query),
    queryFn: () => statsApi.getCustomerStats(query || {}),
    enabled: true,
  });
}

export function useInactiveCustomers(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.inactiveCustomers(query),
    queryFn: () => statsApi.getInactiveCustomersReport(query || {}),
    enabled: true,
  });
}

export function useCustomersWithoutPurchase(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.customersWithoutPurchase(query),
    queryFn: () => statsApi.getCustomersWithoutPurchaseReport(query || {}),
    enabled: true,
  });
}

export function useActualCustomerDebt(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.actualCustomerDebt(query),
    queryFn: () => statsApi.getActualCustomerDebtReport(query || {}),
    enabled: true,
  });
}

export function useSellersReport(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.sellersReport(query),
    queryFn: () => statsApi.getSellersReport(query || {}),
    enabled: true,
  });
}

export function useProductsSummary(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.productsSummary(query),
    queryFn: () => statsApi.getProductsSummaryReport(query || {}),
    enabled: true,
  });
}

export function useProductsPeriod(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.productsPeriod(query),
    queryFn: () => statsApi.getProductsPeriodReport(query || {}),
    enabled: true,
  });
}

export function useNegativeInventory(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.negativeInventory(query),
    queryFn: () => statsApi.getNegativeInventoryReport(query || {}),
    enabled: true,
  });
}

export function useReturnedProducts(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.returnedProducts(query),
    queryFn: () => statsApi.getReturnedProductsReport(query || {}),
    enabled: true,
  });
}

export function useReturnedOrders(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.returnedOrders(query),
    queryFn: () => statsApi.getReturnedOrdersReport(query || {}),
    enabled: true,
  });
}

export function useCategorySales(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.categorySales(query),
    queryFn: () => statsApi.getCategorySalesReport(query || {}),
    enabled: true,
  });
}

export function useDayOfPurchase(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.dayOfPurchase(query),
    queryFn: () => statsApi.getDayOfPurchaseReport(query || {}),
    enabled: true,
  });
}

export function usePaymentStatus(query?: QueryStats) {
  return useQuery({
    queryKey: statsKeys.paymentStatus(query),
    queryFn: () => statsApi.getPaymentStatusReport(query || {}),
    enabled: true,
  });
}


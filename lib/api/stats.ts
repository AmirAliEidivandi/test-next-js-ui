import { apiClient } from "./client";
import type {
  GetActualCustomerDebtReportResponse,
  GetCategorySalesReportResponse,
  GetCustomersWithoutPurchaseReportResponse,
  GetDayOfPurchasesResponse,
  GetHeadCategorySalesResponse,
  GetInactiveCustomersReportResponse,
  GetNegativeInventoryReportResponse,
  GetOnlineCustomersReportResponse,
  GetPaymentsStatusResponse,
  GetProductKardexResponse,
  GetProductsPeriodReportResponse,
  GetProductsSalesResponse,
  GetProductsSummaryReportResponse,
  GetReturnedOrdersReportResponse,
  GetReturnedProductsReportResponse,
  GetSellersReportResponse,
  GetTopProductsSalesResponse,
  QueryProductKardex,
  QueryStats,
} from "./types";

/**
 * Format date to YYYY-MM-DD format for API
 */
function formatDateForAPI(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const statsApi = {
  /**
   * Get products sales statistics
   */
  async getProductsSales(
    query?: QueryStats
  ): Promise<GetProductsSalesResponse> {
    const params = new URLSearchParams();

    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.customer_id) {
      params.append("customer_id", query.customer_id);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.support_id) {
      params.append("support_id", query.support_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    if (query?.product_id) {
      params.append("product_id", query.product_id);
    }
    if (query?.capillary_sales_line_id) {
      params.append("capillary_sales_line_id", query.capillary_sales_line_id);
    }
    if (query?.min_purchases) {
      params.append("min_purchases", query.min_purchases.toString());
    }
    if (query?.inactive_days) {
      params.append("inactive_days", query.inactive_days.toString());
    }

    const queryString = params.toString();
    return apiClient.get<GetProductsSalesResponse>(
      `/stats/products-sales${queryString ? `?${queryString}` : ""}`
    );
  },

  /**
   * Get head category sales statistics (for chart)
   */
  async getHeadCategorySales(
    query?: QueryStats
  ): Promise<GetHeadCategorySalesResponse> {
    const params = new URLSearchParams();

    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.customer_id) {
      params.append("customer_id", query.customer_id);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.support_id) {
      params.append("support_id", query.support_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    if (query?.product_id) {
      params.append("product_id", query.product_id);
    }
    if (query?.capillary_sales_line_id) {
      params.append("capillary_sales_line_id", query.capillary_sales_line_id);
    }
    if (query?.min_purchases) {
      params.append("min_purchases", query.min_purchases.toString());
    }
    if (query?.inactive_days) {
      params.append("inactive_days", query.inactive_days.toString());
    }

    const queryString = params.toString();
    return apiClient.get<GetHeadCategorySalesResponse>(
      `/stats/head-categories-sales${queryString ? `?${queryString}` : ""}`
    );
  },

  /**
   * Get top products sales statistics
   */
  async getTopProductsSales(
    query?: QueryStats
  ): Promise<GetTopProductsSalesResponse> {
    const params = new URLSearchParams();

    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.customer_id) {
      params.append("customer_id", query.customer_id);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.support_id) {
      params.append("support_id", query.support_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    if (query?.product_id) {
      params.append("product_id", query.product_id);
    }
    if (query?.capillary_sales_line_id) {
      params.append("capillary_sales_line_id", query.capillary_sales_line_id);
    }
    if (query?.min_purchases) {
      params.append("min_purchases", query.min_purchases.toString());
    }
    if (query?.inactive_days) {
      params.append("inactive_days", query.inactive_days.toString());
    }

    const queryString = params.toString();
    return apiClient.get<GetTopProductsSalesResponse>(
      `/stats/top-products-sales${queryString ? `?${queryString}` : ""}`
    );
  },
  async getProductKardex(
    query: QueryProductKardex
  ): Promise<GetProductKardexResponse> {
    const params = new URLSearchParams();
    params.append("product_id", query.product_id);
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetProductKardexResponse>(
      `/stats/product-kardex${queryString ? `?${queryString}` : ""}`
    );
  },
  async getCustomerStats(
    query: QueryStats
  ): Promise<GetOnlineCustomersReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.customer_id) {
      params.append("customer_id", query.customer_id);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    const queryString = params.toString();
    return apiClient.get<GetOnlineCustomersReportResponse>(
      `/stats/online-customers${queryString ? `?${queryString}` : ""}`
    );
  },
  async getCategorySalesReport(
    query: QueryStats
  ): Promise<GetCategorySalesReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetCategorySalesReportResponse>(
      `/stats/category-sales-report${queryString ? `?${queryString}` : ""}`
    );
  },
  async getPaymentStatusReport(
    query: QueryStats
  ): Promise<GetPaymentsStatusResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.customer_id) {
      params.append("customer_id", query.customer_id);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetPaymentsStatusResponse>(
      `/stats/payments-status${queryString ? `?${queryString}` : ""}`
    );
  },
  async getDayOfPurchaseReport(
    query: QueryStats
  ): Promise<GetDayOfPurchasesResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetDayOfPurchasesResponse>(
      `/stats/day-of-purchases${queryString ? `?${queryString}` : ""}`
    );
  },
  async getSellersReport(query: QueryStats): Promise<GetSellersReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetSellersReportResponse>(
      `/stats/seller-report${queryString ? `?${queryString}` : ""}`
    );
  },
  async getNegativeInventoryReport(
    query: QueryStats
  ): Promise<GetNegativeInventoryReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetNegativeInventoryReportResponse>(
      `/stats/negative-inventory${queryString ? `?${queryString}` : ""}`
    );
  },
  async getActualCustomerDebtReport(
    query: QueryStats
  ): Promise<GetActualCustomerDebtReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.customer_id) {
      params.append("customer_id", query.customer_id);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetActualCustomerDebtReportResponse>(
      `/stats/actual-customer-debt${queryString ? `?${queryString}` : ""}`
    );
  },
  async getReturnedOrdersReport(
    query: QueryStats
  ): Promise<GetReturnedOrdersReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetReturnedOrdersReportResponse>(
      `/stats/returned-orders${queryString ? `?${queryString}` : ""}`
    );
  },
  async getReturnedProductsReport(
    query: QueryStats
  ): Promise<GetReturnedProductsReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetReturnedProductsReportResponse>(
      `/stats/returned-products${queryString ? `?${queryString}` : ""}`
    );
  },
  async getInactiveCustomersReport(
    query: QueryStats
  ): Promise<GetInactiveCustomersReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetInactiveCustomersReportResponse>(
      `/stats/inactive-customers${queryString ? `?${queryString}` : ""}`
    );
  },
  async getCustomersWithoutPurchaseReport(
    query: QueryStats
  ): Promise<GetCustomersWithoutPurchaseReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetCustomersWithoutPurchaseReportResponse>(
      `/stats/customers-without-purchase${queryString ? `?${queryString}` : ""}`
    );
  },
  async getProductsSummaryReport(
    query: QueryStats
  ): Promise<GetProductsSummaryReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetProductsSummaryReportResponse>(
      `/stats/products-summary${queryString ? `?${queryString}` : ""}`
    );
  },
  async getProductsPeriodReport(
    query: QueryStats
  ): Promise<GetProductsPeriodReportResponse> {
    const params = new URLSearchParams();
    if (query?.period !== undefined) {
      params.append("period", query.period);
    }
    if (query?.seller_id) {
      params.append("seller_id", query.seller_id);
    }
    if (query?.from) {
      params.append("from", formatDateForAPI(query.from));
    }
    if (query?.to) {
      params.append("to", formatDateForAPI(query.to));
    }
    const queryString = params.toString();
    return apiClient.get<GetProductsPeriodReportResponse>(
      `/stats/products-period${queryString ? `?${queryString}` : ""}`
    );
  },
};

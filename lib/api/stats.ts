import { apiClient } from "./client";
import type {
  GetHeadCategorySalesResponse,
  GetProductsSalesResponse,
  GetTopProductsSalesResponse,
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
};

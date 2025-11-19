import { apiClient } from "./client";
import type {
  CapillarySalesLinesResponse,
  GetCustomerReportResponse,
  GetCustomersByDebtResponse,
  GetCustomersResponse,
  QueryCapillarySalesLine,
  QueryCustomer,
} from "./types";

const buildCustomerQueryString = (query?: QueryCustomer) => {
  const params = new URLSearchParams();

  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.deleted !== undefined) {
    params.append("deleted", query.deleted.toString());
  }
  if (query?.branch_id) {
    params.append("branch_id", query.branch_id);
  }
  if (query?.locked !== undefined) {
    params.append("locked", query.locked.toString());
  }
  if (query?.created_at_max) {
    params.append("created_at_max", query.created_at_max.toISOString());
  }
  if (query?.created_at_min) {
    params.append("created_at_min", query.created_at_min.toISOString());
  }
  if (query?.code) {
    params.append("code", query.code);
  }
  if (query?.id) {
    params.append("id", query.id);
  }
  if (query?.person_id) {
    params.append("person_id", query.person_id);
  }
  if (query?.min_order_count !== undefined) {
    params.append("min_order_count", query.min_order_count.toString());
  }
  if (query?.lat !== undefined) {
    params.append("lat", query.lat.toString());
  }
  if (query?.long !== undefined) {
    params.append("long", query.long.toString());
  }
  if (query?.mobile) {
    params.append("mobile", query.mobile);
  }
  if (query?.title) {
    params.append("title", query.title);
  }
  if (query?.phone) {
    params.append("phone", query.phone);
  }
  if (query?.type) {
    params.append("type", query.type);
  }
  if (query?.category) {
    params.append("category", query.category);
  }
  if (query?.is_property_owner !== undefined) {
    params.append("is_property_owner", query.is_property_owner.toString());
  }
  if (query?.age !== undefined) {
    params.append("age", query.age.toString());
  }
  if (query?.credibility_by_seller) {
    params.append("credibility_by_seller", query.credibility_by_seller);
  }
  if (query?.behavior_tags && query.behavior_tags.length > 0) {
    query.behavior_tags.forEach((tag) => {
      params.append("behavior_tags", tag);
    });
  }
  if (query?.seller_id) {
    params.append("seller_id", query.seller_id);
  }
  if (query?.capillary_sales_line_id) {
    params.append("capillary_sales_line_id", query.capillary_sales_line_id);
  }
  if (query?.hp_code) {
    params.append("hp_code", query.hp_code);
  }
  if (query?.hp_title) {
    params.append("hp_title", query.hp_title);
  }

  return params.toString();
};

export const customersApi = {
  /**
   * Get list of customers with filters and pagination
   */
  async getCustomers(query?: QueryCustomer): Promise<GetCustomersResponse> {
    const queryString = buildCustomerQueryString(query);
    const endpoint = `/customers${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<GetCustomersResponse>(endpoint);
  },

  /**
   * Get list of indebted customers with filters and pagination
   */
  async getCustomersByDebt(
    query?: QueryCustomer
  ): Promise<GetCustomersByDebtResponse> {
    const queryString = buildCustomerQueryString(query);
    const endpoint = `/customers/by-debt${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get<GetCustomersByDebtResponse>(endpoint);
  },

  /**
   * Get customers report with last order info
   */
  async getCustomersLastOrder(
    query?: QueryCustomer
  ): Promise<GetCustomerReportResponse> {
    const queryString = buildCustomerQueryString(query);
    const endpoint = `/customers/last-order${
      queryString ? `?${queryString}` : ""
    }`;

    return apiClient.get<GetCustomerReportResponse>(endpoint);
  },

  /**
   * Get list of capillary sales lines
   */
  async getCapillarySalesLines(
    query?: QueryCapillarySalesLine
  ): Promise<CapillarySalesLinesResponse> {
    const params = new URLSearchParams();

    if (query?.page) {
      params.append("page", query.page.toString());
    }
    if (query?.["page-size"]) {
      params.append("page-size", query["page-size"].toString());
    }

    const endpoint = `/capillary-sales-lines${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    return apiClient.get<CapillarySalesLinesResponse>(endpoint);
  },
};

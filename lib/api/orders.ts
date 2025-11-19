import { apiClient } from "./client";
import type { GetOrdersResponse, QueryOrder } from "./types";

const buildOrderQueryString = (query?: QueryOrder) => {
  const params = new URLSearchParams();

  if (!query) return "";

  if (query.page) {
    params.append("page", query.page.toString());
  }
  if (query["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query.code !== undefined) {
    params.append("code", query.code.toString());
  }
  if (query.hp_invoice_code !== undefined) {
    params.append("hp_invoice_code", query.hp_invoice_code.toString());
  }
  if (query.step) {
    params.append("step", query.step);
  }
  if (query.seller_id) {
    params.append("seller_id", query.seller_id);
  }
  if (query.archived !== undefined) {
    params.append("archived", query.archived.toString());
  }
  if (query.created_date_min) {
    params.append("created_date_min", query.created_date_min.toISOString());
  }
  if (query.created_date_max) {
    params.append("created_date_max", query.created_date_max.toISOString());
  }
  if (query.capillary_sales_line_id) {
    params.append("capillary_sales_line_id", query.capillary_sales_line_id);
  }
  if (query.bought !== undefined) {
    params.append("bought", query.bought.toString());
  }
  if (query.answered !== undefined) {
    params.append("answered", query.answered.toString());
  }
  if (query.new_customer !== undefined) {
    params.append("new_customer", query.new_customer.toString());
  }
  if (query.delivery_method) {
    params.append("delivery_method", query.delivery_method);
  }
  if (query.customer_id) {
    params.append("customer_id", query.customer_id);
  }
  if (query.did_we_contact !== undefined) {
    params.append("did_we_contact", query.did_we_contact.toString());
  }
  if (query.delivery_date_min) {
    params.append("delivery_date_min", query.delivery_date_min.toISOString());
  }
  if (query.delivery_date_max) {
    params.append("delivery_date_max", query.delivery_date_max.toISOString());
  }
  if (query.person_id) {
    params.append("person_id", query.person_id);
  }
  if (query.in_person_order !== undefined) {
    params.append("in_person_order", query.in_person_order.toString());
  }

  return params.toString();
};

export const ordersApi = {
  async getOrders(query?: QueryOrder): Promise<GetOrdersResponse> {
    const queryString = buildOrderQueryString(query);
    const endpoint = `/orders${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<GetOrdersResponse>(endpoint);
  },
};


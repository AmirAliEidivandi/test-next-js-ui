import { apiClient } from "./client";
import type { GetInvoicesResponse, QueryInvoice } from "./types";

const buildInvoiceQueryString = (query?: QueryInvoice) => {
  const params = new URLSearchParams();

  if (!query) {
    return "";
  }

  if (query.page) {
    params.append("page", query.page.toString());
  }
  if (query["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query.code !== undefined) {
    params.append("code", query.code.toString());
  }
  if (query.customer_id) {
    params.append("customer_id", query.customer_id);
  }
  if (query.seller_id) {
    params.append("seller_id", query.seller_id);
  }
  if (query.order_id) {
    params.append("order_id", query.order_id);
  }
  if (query.due_date_min) {
    params.append("due_date_min", query.due_date_min.toISOString());
  }
  if (query.due_date_max) {
    params.append("due_date_max", query.due_date_max.toISOString());
  }
  if (query.from) {
    params.append("from", query.from.toISOString());
  }
  if (query.to) {
    params.append("to", query.to.toISOString());
  }
  if (query.amount_min !== undefined) {
    params.append("amount_min", query.amount_min.toString());
  }
  if (query.amount_max !== undefined) {
    params.append("amount_max", query.amount_max.toString());
  }
  if (query.payment_status) {
    params.append("payment_status", query.payment_status);
  }
  if (query.type) {
    params.append("type", query.type);
  }

  return params.toString();
};

export const invoicesApi = {
  async getInvoices(query?: QueryInvoice): Promise<GetInvoicesResponse> {
    const queryString = buildInvoiceQueryString(query);
    const endpoint = `/invoices${queryString ? `?${queryString}` : ""}`;

    return apiClient.get<GetInvoicesResponse>(endpoint);
  },
};

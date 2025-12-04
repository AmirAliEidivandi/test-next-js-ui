import { apiClient } from "./client";
import { GetProduceResponse, GetProducesResponse, QueryProduce } from "./types";

const buildProduceQueryString = (query?: QueryProduce) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.code) {
    params.append("code", query.code.toString());
  }
  if (query?.box_weight) {
    params.append("box_weight", query.box_weight.toString());
  }
  if (query?.lost) {
    params.append("lost", query.lost.toString());
  }
  if (query?.waste) {
    params.append("waste", query.waste.toString());
  }
  if (query?.product_id) {
    params.append("product_id", query.product_id);
  }
  if (query?.production_date_min) {
    params.append(
      "production_date_min",
      query.production_date_min.toISOString()
    );
  }
  if (query?.production_date_max) {
    params.append(
      "production_date_max",
      query.production_date_max.toISOString()
    );
  }
  return params.toString();
};

export const producesApi = {
  async getProduces(query?: QueryProduce): Promise<GetProducesResponse> {
    const queryString = buildProduceQueryString(query);
    const endpoint = `/produce${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<GetProducesResponse>(endpoint);
  },
  async getProduce(produceId: string): Promise<GetProduceResponse> {
    const endpoint = `/produce/${produceId}`;
    return apiClient.get<GetProduceResponse>(endpoint);
  },
};

import { apiClient } from "./client";
import { GetFollowUpsResponse, QueryFollowUp } from "./types";

const buildFollowUpQueryString = (query?: QueryFollowUp) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.employee_id) {
    params.append("employee_id", query.employee_id);
  }
  if (query?.capillary_sales_line_id) {
    params.append("capillary_sales_line_id", query.capillary_sales_line_id);
  }
  return params.toString();
};

export const followUpsApi = {
  async getFollowUps(query?: QueryFollowUp): Promise<GetFollowUpsResponse> {
    const queryString = buildFollowUpQueryString(query);
    const endpoint = `/follow-ups${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<GetFollowUpsResponse>(endpoint);
  },
};

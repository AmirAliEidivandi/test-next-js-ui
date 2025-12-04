import { apiClient } from "./client";
import {
  GetReminderResponse,
  GetRemindersResponse,
  QueryReminder,
  UpdateReminderRequest,
  UpdateReminderResponse,
} from "./types";

const buildReminderQueryString = (query?: QueryReminder) => {
  const params = new URLSearchParams();
  if (query?.page) {
    params.append("page", query.page.toString());
  }
  if (query?.["page-size"]) {
    params.append("page-size", query["page-size"].toString());
  }
  if (query?.from) {
    params.append("from", query.from.toISOString());
  }
  if (query?.to) {
    params.append("to", query.to.toISOString());
  }
  if (query?.employee_id) {
    params.append("employee_id", query.employee_id);
  }
  if (query?.seen) {
    params.append("seen", query.seen.toString());
  }
  return params.toString();
};

export const remindersApi = {
  async getReminders(query?: QueryReminder): Promise<GetRemindersResponse> {
    const queryString = buildReminderQueryString(query);
    const endpoint = `/reminders${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<GetRemindersResponse>(endpoint);
  },
  async getReminder(id: string): Promise<GetReminderResponse> {
    const endpoint = `/reminders/${id}`;
    return apiClient.get<GetReminderResponse>(endpoint);
  },
  async updateReminder(
    id: string,
    request: UpdateReminderRequest
  ): Promise<UpdateReminderResponse> {
    const endpoint = `/reminders/${id}`;
    return apiClient.put<UpdateReminderResponse>(endpoint, request);
  },
};

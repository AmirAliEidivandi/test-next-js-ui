import { apiClient } from "./client";
import {
  GetTicketMessagesResponse,
  GetTicketResponse,
  GetTicketsResponse,
  QueryTicket,
  ReplyTicketRequest,
  ReplyTicketResponse,
} from "./types";

export const ticketApi = {
  async getTickets(query: QueryTicket): Promise<GetTicketsResponse> {
    const params = new URLSearchParams();

    if (query.last_sender_type) {
      params.append("last_sender_type", query.last_sender_type);
    }

    if (query.employee_id) {
      params.append("employee_id", query.employee_id);
    }

    if (query.creator_person_id) {
      params.append("creator_person_id", query.creator_person_id);
    }

    if (query.assigned_to_id) {
      params.append("assigned_to_id", query.assigned_to_id);
    }

    if (query.customer_id) {
      params.append("customer_id", query.customer_id);
    }

    if (query.person_id) {
      params.append("person_id", query.person_id);
    }

    if (query.status) {
      params.append("status", query.status);
    }

    if (query.priority) {
      params.append("priority", query.priority);
    }

    if (query.sort_by) {
      params.append("sort_by", query.sort_by);
    }

    if (query.sort_order) {
      params.append("sort_order", query.sort_order);
    }

    if (query.page) {
      params.append("page", query.page.toString());
    }

    if (query["page-size"]) {
      params.append("page-size", query["page-size"].toString());
    }

    if (query.search) {
      params.append("search", query.search);
    }

    if (query.created_at_min) {
      params.append("created_at_min", query.created_at_min.toISOString());
    }

    if (query.created_at_max) {
      params.append("created_at_max", query.created_at_max.toISOString());
    }

    if (query.deleted !== undefined) {
      params.append("deleted", query.deleted.toString());
    }

    const queryString = params.toString();
    return apiClient.get<GetTicketsResponse>(
      `/tickets${queryString ? `?${queryString}` : ""}`
    );
  },
  async getTicket(id: string): Promise<GetTicketResponse> {
    return apiClient.get<GetTicketResponse>(`/tickets/${id}`);
  },
  async getTicketMessages(id: string): Promise<GetTicketMessagesResponse> {
    return apiClient.get<GetTicketMessagesResponse>(`/tickets/${id}/messages`);
  },
  async replyTicket(
    id: string,
    data: ReplyTicketRequest
  ): Promise<ReplyTicketResponse> {
    return apiClient.post<ReplyTicketResponse>(`/tickets/${id}/reply`, data);
  },
  async updateTicketStatus(
    id: string,
    status: string
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.patch<{ success: boolean; message: string }>(
      `/tickets/${id}/status`,
      {
        status,
      }
    );
  },
  async assignTicket(
    id: string,
    employee_id: string
  ): Promise<{ success: boolean; message: string }> {
    return apiClient.patch<{ success: boolean; message: string }>(
      `/tickets/${id}/assign`,
      {
        employee_id,
      }
    );
  },
};

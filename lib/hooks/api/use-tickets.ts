import { ticketApi } from "@/lib/api/ticket";
import type { QueryTicket } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const ticketKeys = {
  all: ["tickets"] as const,
  lists: () => [...ticketKeys.all, "list"] as const,
  list: (filters?: QueryTicket) => [...ticketKeys.lists(), filters] as const,
  detail: (id: string) => [...ticketKeys.all, "detail", id] as const,
  messages: (id: string) => [...ticketKeys.detail(id), "messages"] as const,
};

// Hooks
export function useTickets(filters?: QueryTicket) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: () => ticketApi.getTickets(filters || {}),
    enabled: true,
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ticketKeys.detail(id),
    queryFn: () => ticketApi.getTicket(id),
    enabled: !!id,
  });
}

export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.messages(ticketId),
    queryFn: () => ticketApi.getTicketMessages(ticketId),
    enabled: !!ticketId,
  });
}

export function useReplyTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, data }: { ticketId: string; data: any }) =>
      ticketApi.replyTicket(ticketId, data),
    onSuccess: (_, variables) => {
      // Invalidate ticket details and messages to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ticketKeys.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.messages(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.lists(),
      });
    },
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: string; status: string }) =>
      ticketApi.updateTicketStatus(ticketId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.messages(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.lists(),
      });
    },
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticketId,
      employee_id,
    }: {
      ticketId: string;
      employee_id: string;
    }) => ticketApi.assignTicket(ticketId, employee_id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ticketKeys.detail(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.messages(variables.ticketId),
      });
      queryClient.invalidateQueries({
        queryKey: ticketKeys.lists(),
      });
    },
  });
}

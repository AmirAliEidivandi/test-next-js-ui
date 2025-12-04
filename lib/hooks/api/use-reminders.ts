import { remindersApi } from "@/lib/api/reminders";
import type { QueryReminder, UpdateReminderRequest } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const reminderKeys = {
  all: ["reminders"] as const,
  lists: () => [...reminderKeys.all, "list"] as const,
  list: (filters?: QueryReminder) =>
    [...reminderKeys.lists(), filters] as const,
  detail: (id: string) => [...reminderKeys.all, "detail", id] as const,
};

// Hooks
export function useReminders(filters?: QueryReminder) {
  return useQuery({
    queryKey: reminderKeys.list(filters),
    queryFn: () => remindersApi.getReminders(filters),
    enabled: true,
  });
}

export function useReminder(id: string | null) {
  return useQuery({
    queryKey: reminderKeys.detail(id!),
    queryFn: () => remindersApi.getReminder(id!),
    enabled: !!id,
  });
}

export function useUpdateReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateReminderRequest;
    }) => remindersApi.updateReminder(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reminderKeys.all });
    },
  });
}

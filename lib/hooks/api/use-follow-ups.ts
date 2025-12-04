import { followUpsApi } from "@/lib/api/follow-ups";
import type { QueryFollowUp } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";

// Query Keys
export const followUpKeys = {
  all: ["follow-ups"] as const,
  lists: () => [...followUpKeys.all, "list"] as const,
  list: (filters?: QueryFollowUp) =>
    [...followUpKeys.lists(), filters] as const,
};

// Hooks
export function useFollowUps(filters?: QueryFollowUp) {
  return useQuery({
    queryKey: followUpKeys.list(filters),
    queryFn: () => followUpsApi.getFollowUps(filters),
    enabled: true,
  });
}


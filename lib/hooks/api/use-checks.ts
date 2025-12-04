import { checksApi } from "@/lib/api/checks";
import type { CheckStatusEnum, QueryCheck } from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const checkKeys = {
  all: ["checks"] as const,
  lists: () => [...checkKeys.all, "list"] as const,
  list: (filters?: QueryCheck) => [...checkKeys.lists(), filters] as const,
  details: () => [...checkKeys.all, "detail"] as const,
  detail: (id: string | null) => [...checkKeys.details(), id] as const,
};

// Hooks
export function useChecks(filters?: QueryCheck) {
  return useQuery({
    queryKey: checkKeys.list(filters),
    queryFn: () => checksApi.getChecks(filters),
    enabled: true,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCheck(id: string | null) {
  return useQuery({
    queryKey: checkKeys.detail(id),
    queryFn: () => {
      if (!id) throw new Error("Check ID is required");
      return checksApi.getCheck(id);
    },
    enabled: !!id,
  });
}

export function useChangeCheckStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      checkId,
      status,
    }: {
      checkId: string;
      status: CheckStatusEnum;
    }) => checksApi.changeCheckStatus(checkId, status),
    onSuccess: (_, variables) => {
      // Update the cache optimistically without refetching
      queryClient.setQueriesData(
        { queryKey: checkKeys.all },
        (oldData: any) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            data: oldData.data?.map((check: any) =>
              check.id === variables.checkId
                ? { ...check, status: variables.status }
                : check
            ),
          };
        }
      );
      // Invalidate in background without causing immediate refetch
      queryClient.invalidateQueries({
        queryKey: checkKeys.all,
        refetchType: "none",
      });
    },
  });
}

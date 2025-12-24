import { groupsApi } from "@/lib/api/groups";
import { profileApi } from "@/lib/api/profile";
import type {
  CreateProfileDto,
  QueryProfile,
  UpdateEmployeeProfileRequest,
} from "@/lib/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Query Keys
export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
  list: (filters?: QueryProfile) =>
    [...profileKeys.lists(), filters] as const,
  employeesList: (filters?: QueryProfile) =>
    [...profileKeys.all, "employees", "list", filters] as const,
  detail: (id: string) => [...profileKeys.all, "detail", id] as const,
  groups: () => [...profileKeys.all, "groups"] as const,
};

// Hooks
export function useProfiles(filters?: QueryProfile) {
  return useQuery({
    queryKey: profileKeys.list(filters),
    queryFn: () => profileApi.getProfiles(filters || {}),
    enabled: true,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useEmployeesProfile(filters?: QueryProfile) {
  return useQuery({
    queryKey: profileKeys.employeesList(filters),
    queryFn: () => profileApi.getEmployeesProfile(filters || {}),
    enabled: true,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useProfile(id: string | null) {
  return useQuery({
    queryKey: profileKeys.detail(id!),
    queryFn: () => profileApi.getProfile(id!),
    enabled: !!id,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useGroups() {
  return useQuery({
    queryKey: profileKeys.groups(),
    queryFn: () => groupsApi.getGroups(),
    enabled: true,
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfileDto) => profileApi.createProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.employeesList() });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEmployeeProfileRequest;
    }) => profileApi.updateProfile(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: profileKeys.employeesList(),
      });
    },
  });
}


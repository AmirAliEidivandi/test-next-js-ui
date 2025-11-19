import { employeesApi } from "@/lib/api/employees";
import { useQuery } from "@tanstack/react-query";

export const employeeKeys = {
  all: ["employees"] as const,
  sellers: () => [...employeeKeys.all, "sellers"] as const,
  visitors: () => [...employeeKeys.all, "visitors"] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};

export function useSellers() {
  return useQuery({
    queryKey: employeeKeys.sellers(),
    queryFn: () => employeesApi.getSellers(),
    staleTime: 5 * 60 * 1000, // 5 minutes - لیست فروشندگان کمتر تغییر می‌کند
  });
}

export function useVisitors() {
  return useQuery({
    queryKey: employeeKeys.visitors(),
    queryFn: () => employeesApi.getVisitors(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useEmployeeInfo(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.detail(employeeId),
    queryFn: () => employeesApi.getEmployeeInfo(employeeId),
    enabled: !!employeeId,
  });
}

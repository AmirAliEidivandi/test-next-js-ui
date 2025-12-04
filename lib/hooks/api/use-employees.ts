import { employeesApi } from "@/lib/api/employees";
import { useQuery } from "@tanstack/react-query";

export const employeeKeys = {
  all: ["employees"] as const,
  employees: () => [...employeeKeys.all, "employees"] as const,
  sellers: () => [...employeeKeys.all, "sellers"] as const,
  visitors: () => [...employeeKeys.all, "visitors"] as const,
  detail: (id: string) => [...employeeKeys.all, "detail", id] as const,
};

export function useSellers() {
  return useQuery({
    queryKey: employeeKeys.sellers(),
    queryFn: () => employeesApi.getSellers(),
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days - فروشنده‌ها و نقش‌ها به ندرت تغییر می‌کنند
  });
}

export function useVisitors() {
  return useQuery({
    queryKey: employeeKeys.visitors(),
    queryFn: () => employeesApi.getVisitors(),
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function useEmployees() {
  return useQuery({
    queryKey: employeeKeys.employees(),
    queryFn: () => employeesApi.getEmployees(),
    staleTime: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function useEmployeeInfo(employeeId: string) {
  return useQuery({
    queryKey: employeeKeys.detail(employeeId),
    queryFn: () => employeesApi.getEmployeeInfo(employeeId),
    enabled: !!employeeId,
  });
}

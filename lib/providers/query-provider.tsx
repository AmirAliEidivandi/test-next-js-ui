"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";

const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute - داده‌ها 1 دقیقه fresh می‌مانند
      gcTime: 5 * 60 * 1000, // 5 minutes - cache برای 5 دقیقه نگه داشته می‌شود
      refetchOnWindowFocus: false, // refetch نکردن هنگام focus
      retry: 1, // فقط 1 بار retry در صورت خطا
      refetchOnMount: true, // refetch کردن هنگام mount (اگر stale باشد)
    },
    mutations: {
      retry: 1,
    },
  },
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () => new QueryClient(queryClientOptions)
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}


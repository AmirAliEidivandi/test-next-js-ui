"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { AuthGuard } from "@/components/auth-guard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { QueryProvider } from "@/lib/providers/query-provider";
import { usePathname } from "next/navigation";
import * as React from "react";

const getPageTitle = (pathname: string): string => {
  const titleMap: Record<string, string> = {
    "/dashboard": "داشبورد",
    "/dashboard/customers": "لیست مشتریان",
    "/dashboard/customers/debtors": "مشتریان بدهکار",
    "/dashboard/customers/reports": "گزارش مشتری ها",
    "/dashboard/orders": "لیست سفارشات",
    "/dashboard/orders/history": "تاریخچه سفارشات",
    "/dashboard/payments/history": "تاریخچه پرداخت ها",
    "/dashboard/invoices": "فاکتور ها",
    "/dashboard/shipments/history": "تاریخچه مرسوله ها",
    "/dashboard/customer-requests": "درخواست های مشتریان",
    "/dashboard/return-requests": "درخواست های مرجوعی",
    "/dashboard/categories": "دسته بندی ها",
    "/dashboard/products": "محصولات",
    "/dashboard/warehouses": "لیست انبار ها",
    "/dashboard/distribution/sales-lines": "لیست خط های فروش",
    "/dashboard/distribution/visitors": "لیست ویزیتور ها",
    "/dashboard/distribution/visitor-customers": "مشتری های ویزیتور",
    "/dashboard/distribution/follow-ups": "لیست پیگیری ها",
    "/dashboard/tickets": "تیکت ها",
    "/dashboard/wallets": "کیف پول ها",
    "/dashboard/wallets/history": "تاریخچه کیف پول",
    "/dashboard/logs": "لاگ ها و رهگیری",
    "/dashboard/checks": "چک ها",
    "/dashboard/reminders": "یادآور ها",
    "/dashboard/production/produces": "لیست تولیدات",
    "/dashboard/statistics/customers": "آمار مشتریان",
    "/dashboard/statistics/orders": "آمار سفارشات",
    "/dashboard/statistics/sellers": "آمار فروشندگان",
  };

  // Handle dynamic routes
  if (pathname.startsWith("/dashboard/customer-requests/") && pathname !== "/dashboard/customer-requests") {
    return "جزئیات درخواست مشتری";
  }
  if (pathname.startsWith("/dashboard/return-requests/") && pathname !== "/dashboard/return-requests") {
    return "جزئیات درخواست مرجوعی";
  }
  if (pathname.startsWith("/dashboard/orders/history/") && pathname !== "/dashboard/orders/history") {
    return "جزئیات تاریخچه سفارش";
  }
  if (pathname.startsWith("/dashboard/orders/") && pathname !== "/dashboard/orders" && pathname !== "/dashboard/orders/history") {
    return "جزئیات سفارش";
  }
  if (pathname.startsWith("/dashboard/wallets/") && pathname !== "/dashboard/wallets" && pathname !== "/dashboard/wallets/history") {
    return "جزئیات کیف پول";
  }

  return titleMap[pathname] || "پنل مدیریت";
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  React.useEffect(() => {
    const title = getPageTitle(pathname);
    document.title = `${title} - پنل مدیریت`;
  }, [pathname]);

  return (
    <QueryProvider>
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-mr-1" />
              <Separator orientation="vertical" className="ml-2 h-4" />
              <div className="flex flex-1 items-center gap-2">
                <h1 className="text-lg font-semibold">پنل مدیریت</h1>
              </div>
              <ThemeToggle />
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    </QueryProvider>
  );
}

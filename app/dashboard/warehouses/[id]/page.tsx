"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpFromLine,
  MoreVertical,
  Package,
  RefreshCw,
  TrendingUp,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useWarehouse } from "@/lib/hooks/api/use-warehouses";

const toPersianDigits = (value: string | number): string => {
  const str = typeof value === "number" ? value.toString() : value;
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const translateBranchName = (name: string): string => {
  const branchNames: Record<string, string> = {
    ISFAHAN: "اصفهان",
  };
  return branchNames[name] || name;
};

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;

  const { data: warehouse, isLoading, error } = useWarehouse(warehouseId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری اطلاعات انبار", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !warehouse) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        {/* Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">انبار یافت نشد</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/warehouses")}
        >
          بازگشت به لیست انبارها
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            جزئیات انبار: {warehouse.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل انبار
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/warehouses/${warehouseId}/product-kardex`
                  )
                }
              >
                <span className="flex-1 text-right">گردش موجودی کالا</span>
                <Package className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/warehouses/${warehouseId}/product-turnover`
                  )
                }
              >
                <span className="flex-1 text-right">
                  گردش محصولات در بازه زمانی
                </span>
                <TrendingUp className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/warehouses/${warehouseId}/receivings`)
                }
              >
                <span className="flex-1 text-right">نمایش لیست ورودی‌ها</span>
                <ArrowDownToLine className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/warehouses/${warehouseId}/dispatchings`)
                }
              >
                <span className="flex-1 text-right">نمایش لیست خروجی‌ها</span>
                <ArrowUpFromLine className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/dashboard/warehouses/${warehouseId}/trucks`)
                }
              >
                <span className="flex-1 text-right">نمایش لیست ماشین‌ها</span>
                <Truck className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(
                    `/dashboard/warehouses/${warehouseId}/update-prices`
                  )
                }
              >
                <span className="flex-1 text-right">به‌روزرسانی قیمت‌ها</span>
                <RefreshCw className="size-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/warehouses")}
          >
            <ArrowRight className="size-4 ml-2" />
            بازگشت به لیست
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات اصلی */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات اصلی</CardTitle>
            <CardDescription>اطلاعات پایه انبار</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد انبار
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(warehouse.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                عنوان
              </p>
              <p className="text-base">{warehouse.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آدرس
              </p>
              <p className="text-base">{warehouse.address || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت به‌روزرسانی قیمت‌ها
              </p>
              <p className="text-base">
                {warehouse.are_prices_updated
                  ? "به‌روز شده"
                  : "نیاز به به‌روزرسانی"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات مدیر و شعبه */}
        <Card>
          <CardHeader>
            <CardTitle>مدیر و شعبه</CardTitle>
            <CardDescription>اطلاعات مدیر و شعبه مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                مدیر انبار
              </p>
              <p className="text-base">
                {warehouse.manager?.profile
                  ? `${warehouse.manager.profile.first_name} ${warehouse.manager.profile.last_name}`
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نام شعبه
              </p>
              <p className="text-base">
                {translateBranchName(warehouse.branch.name)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آدرس شعبه
              </p>
              <p className="text-base">{warehouse.branch.address || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت به‌روزرسانی قیمت‌های شعبه
              </p>
              <p className="text-base">
                {warehouse.branch.are_prices_updated
                  ? "به‌روز شده"
                  : "نیاز به به‌روزرسانی"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات موقعیت */}
        {warehouse.location && (
          <Card>
            <CardHeader>
              <CardTitle>موقعیت جغرافیایی</CardTitle>
              <CardDescription>مختصات انبار</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نوع موقعیت
                </p>
                <p className="text-base">{warehouse.location.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  مختصات
                </p>
                <p className="text-base font-mono text-sm">
                  {warehouse.location.coordinates[0]},{" "}
                  {warehouse.location.coordinates[1]}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* اطلاعات زمانی */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات زمانی</CardTitle>
            <CardDescription>تاریخ ایجاد و به‌روزرسانی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">{formatDate(warehouse.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آخرین به‌روزرسانی
              </p>
              <p className="text-base">{formatDate(warehouse.updated_at)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

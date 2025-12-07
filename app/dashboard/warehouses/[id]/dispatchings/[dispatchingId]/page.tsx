"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { ArrowRight } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDispatching } from "@/lib/hooks/api/use-dispatchings";
import { DispatchingSourceEnum } from "@/lib/api/types";

const toPersianDigits = (value: number | string): string => {
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

const formatPrice = (price: number): string => {
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

const dispatchingSourceLabels: Record<DispatchingSourceEnum, string> = {
  RETURN_FROM_RECEIVING: "برگشت از ورودی انبار",
  MANUAL: "دستی",
  AUTOMATIC_FROM_CARGO: "اتوماتیک با مرسوله ارسالی",
};

export default function DispatchingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;
  const dispatchingId = params.dispatchingId as string;

  const { data: dispatching, isLoading, error } = useDispatching(dispatchingId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات خروجی", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !dispatching) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
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

  if (!dispatching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">خروجی یافت نشد</p>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/warehouses/${warehouseId}/dispatchings`)
          }
        >
          بازگشت به لیست خروجی‌ها
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
            جزئیات خروجی: {toPersianDigits(dispatching.code)}
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل خروجی
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/warehouses/${warehouseId}/dispatchings`)
          }
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات اصلی */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات اصلی</CardTitle>
            <CardDescription>اطلاعات پایه خروجی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد خروجی
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(dispatching.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ خروج
              </p>
              <p className="text-base">{formatDate(dispatching.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نوع
              </p>
              <p className="text-base">
                {dispatching.source
                  ? dispatchingSourceLabels[
                      dispatching.source as DispatchingSourceEnum
                    ] || dispatching.source
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                پلاک
              </p>
              <p className="text-base">{dispatching.license_plate || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                راننده
              </p>
              <p className="text-base">{dispatching.driver_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">{formatDate(dispatching.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات کارمند */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات کارمند</CardTitle>
            <CardDescription>اطلاعات کارمند مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کارمند
              </p>
              <p className="text-base">
                {dispatching.employee.profile.first_name}{" "}
                {dispatching.employee.profile.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تعداد اقلام
              </p>
              <p className="text-base">
                {toPersianDigits(dispatching.products_count)} قلم
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* لیست محصولات */}
      {dispatching.products && dispatching.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>لیست محصولات</CardTitle>
            <CardDescription>
              {toPersianDigits(dispatching.products.length)} محصول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ردیف</TableHead>
                    <TableHead className="text-right">عنوان محصول</TableHead>
                    <TableHead className="text-right">وزن خالص</TableHead>
                    <TableHead className="text-right">وزن ناخالص</TableHead>
                    <TableHead className="text-right">وزن جعبه</TableHead>
                    <TableHead className="text-right">قیمت خرید</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dispatching.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {toPersianDigits(index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.product_title}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.net_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.gross_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.box_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(product.purchase_price))}{" "}
                        ریال
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


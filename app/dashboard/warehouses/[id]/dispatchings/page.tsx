"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDispatchings } from "@/lib/hooks/api/use-dispatchings";
import { useWarehouse } from "@/lib/hooks/api/use-warehouses";
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

const dispatchingSourceLabels: Record<DispatchingSourceEnum, string> = {
  RETURN_FROM_RECEIVING: "برگشت از ورودی انبار",
  MANUAL: "دستی",
  AUTOMATIC_FROM_CARGO: "اتوماتیک با مرسوله ارسالی",
};

export default function DispatchingsPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: warehouse } = useWarehouse(warehouseId);
  const { data: dispatchings, isLoading, error } = useDispatchings(
    warehouseId,
    {
      page: currentPage,
      "page-size": 20,
    }
  );

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست خروجی‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleViewDispatching = (dispatchingId: string) => {
    router.push(
      `/dashboard/warehouses/${warehouseId}/dispatchings/${dispatchingId}`
    );
  };

  if (isLoading && !dispatchings) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 7 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">لیست خروجی‌ها</h2>
          <p className="text-sm text-muted-foreground">
            {warehouse?.name && `انبار: ${warehouse.name}`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/warehouses/${warehouseId}`)}
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد</TableHead>
              <TableHead className="text-right">تاریخ خروج</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">راننده</TableHead>
              <TableHead className="text-right">تعداد اقلام</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dispatchings && dispatchings.data.length > 0 ? (
              dispatchings.data.map((dispatching) => (
                <TableRow key={dispatching.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits(dispatching.code)}
                  </TableCell>
                  <TableCell>{formatDate(dispatching.date)}</TableCell>
                  <TableCell>{formatDate(dispatching.created_at)}</TableCell>
                  <TableCell>{dispatching.driver_name || "-"}</TableCell>
                  <TableCell>
                    {toPersianDigits(dispatching.products_count)} قلم
                  </TableCell>
                  <TableCell>
                    {dispatching.source
                      ? dispatchingSourceLabels[
                          dispatching.source as DispatchingSourceEnum
                        ] || dispatching.source
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewDispatching(dispatching.id)}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>مشاهده</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  خروجی‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


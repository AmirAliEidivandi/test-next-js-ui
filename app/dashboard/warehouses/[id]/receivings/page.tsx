"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { ArrowRight, Eye } from "lucide-react";
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
import { ReceivingSourceEnum } from "@/lib/api/types";
import { useReceivings } from "@/lib/hooks/api/use-receivings";
import { useWarehouse } from "@/lib/hooks/api/use-warehouses";

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

const receivingSourceLabels: Record<ReceivingSourceEnum, string> = {
  PURCHASED: "خریداری شده",
  RETURNED: "مرجوعی",
  INVENTORY: "موجودی",
};

export default function ReceivingsPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: warehouse } = useWarehouse(warehouseId);
  const {
    data: receivings,
    isLoading,
    error,
  } = useReceivings(warehouseId, {
    page: currentPage,
    "page-size": 20,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست ورودی‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleViewReceiving = (receivingId: string) => {
    router.push(
      `/dashboard/warehouses/${warehouseId}/receivings/${receivingId}`
    );
  };

  if (isLoading && !receivings) {
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
                {Array.from({ length: 8 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
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

  const totalPages = receivings ? Math.ceil(receivings.count / 20) : 0;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">لیست ورودی‌ها</h2>
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
              <TableHead className="text-right">تاریخ تحویل</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">تعداد اقلام</TableHead>
              <TableHead className="text-right">پلاک/راننده</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receivings && receivings.data.length > 0 ? (
              receivings.data.map((receiving) => (
                <TableRow key={receiving.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits(receiving.code)}
                  </TableCell>
                  <TableCell>{formatDate(receiving.date)}</TableCell>
                  <TableCell>
                    {receivingSourceLabels[receiving.source] ||
                      receiving.source}
                  </TableCell>
                  <TableCell>
                    {receiving.customer ? (
                      <div>
                        <div className="font-medium">
                          {receiving.customer.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          کد: {toPersianDigits(receiving.customer.code)}
                        </div>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(receiving.products_count)} قلم
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{receiving.license_plate || "-"}</div>
                      <div className="text-xs text-muted-foreground">
                        {receiving.driver_name || "-"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(receiving.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewReceiving(receiving.id)}
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
                  colSpan={8}
                  className="text-center text-muted-foreground py-8"
                >
                  ورودی‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

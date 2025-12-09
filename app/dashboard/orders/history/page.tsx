"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import {
  DeliveryMethodEnum,
  OrderChangeTypeEnum,
  OrderStepEnum,
  PaymentStatusEnum,
} from "@/lib/api/types";
import { useOrderHistories } from "@/lib/hooks/api/use-order-histories";

const toPersianDigits = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) {
    return "-";
  }
  const str = typeof value === "number" ? value.toString() : value;
  if (!str) {
    return "-";
  }
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd HH:mm", {
      locale: faIR,
    })
  );
};

const changeTypeLabels: Record<OrderChangeTypeEnum, string> = {
  CREATED: "ایجاد سفارش",
  STEP_CHANGED: "تغییر مرحله",
  PAYMENT_STATUS_CHANGED: "تغییر وضعیت پرداخت",
  FULFILLED_STATUS_CHANGED: "تغییر وضعیت تحویل",
  ARCHIVED_STATUS_CHANGED: "تغییر وضعیت آرشیو",
  DELIVERY_DATE_CHANGED: "تغییر تاریخ تحویل",
  DELIVERY_METHOD_CHANGED: "تغییر روش تحویل",
  SELLER_CHANGED: "تغییر فروشنده",
  VISITOR_CHANGED: "تغییر نماینده",
  WAREHOUSE_CHANGED: "تغییر انبار",
  PRODUCTS_CHANGED: "تغییر محصولات",
  CUSTOMER_CHANGED: "تغییر مشتری",
  DELETED: "حذف سفارش",
  RESTORED: "بازیابی سفارش",
};

const stepLabels: Record<OrderStepEnum, string> = {
  SELLER: "فروشنده",
  SALES_MANAGER: "مدیر فروش",
  PROCESSING: "آماده‌سازی",
  INVENTORY: "انبار",
  ACCOUNTING: "حسابداری",
  CARGO: "مرسوله",
  PARTIALLY_DELIVERED: "تحویل جزئی",
  DELIVERED: "تحویل شده",
  RETURNED: "مرجوعی کامل",
  PARTIALLY_RETURNED: "مرجوعی جزئی",
};

const paymentStatusLabels: Record<PaymentStatusEnum, string> = {
  PAID: "پرداخت شده",
  NOT_PAID: "پرداخت نشده",
  PARTIALLY_PAID: "پرداخت جزئی",
};

const deliveryMethodLabels: Record<DeliveryMethodEnum, string> = {
  FREE_OUR_TRUCK: "رایگان با ماشین شرکت",
  FREE_OTHER_SERVICES: "رایگان با سرویس خارجی",
  PAID: "ارسال با هزینه مشتری",
  AT_INVENTORY: "تحویل درب انبار",
};

export default function OrdersHistoryPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20;

  const query = {
    page: currentPage,
    "page-size": pageSize,
  };

  const { data: orderHistories, isLoading, error } = useOrderHistories(query);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری تاریخچه سفارشات", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const totalPages = orderHistories
    ? Math.ceil(orderHistories.count / pageSize)
    : 0;

  if (isLoading && !orderHistories) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            تاریخچه سفارشات
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده تمام تغییرات انجام شده روی سفارشات
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد سفارش</TableHead>
              <TableHead className="text-right">نوع تغییر</TableHead>
              <TableHead className="text-right">مرحله</TableHead>
              <TableHead className="text-right">وضعیت پرداخت قبل</TableHead>
              <TableHead className="text-right">وضعیت پرداخت بعد</TableHead>
              <TableHead className="text-right">روش تحویل</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">تاریخ تغییر</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderHistories && orderHistories.data.length > 0 ? (
              orderHistories.data.map((history) => (
                <TableRow key={history.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits(history.order.code)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {changeTypeLabels[history.change_type] ||
                        history.change_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {stepLabels[history.step_after] || history.step_after}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        history.payment_status_before === PaymentStatusEnum.PAID
                          ? "default"
                          : "secondary"
                      }
                    >
                      {paymentStatusLabels[history.payment_status_before] ||
                        history.payment_status_before}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        history.payment_status_after === PaymentStatusEnum.PAID
                          ? "default"
                          : "secondary"
                      }
                    >
                      {paymentStatusLabels[history.payment_status_after] ||
                        history.payment_status_after}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deliveryMethodLabels[history.delivery_method_after] ||
                      history.delivery_method_after}
                  </TableCell>
                  <TableCell>
                    <Badge variant={history.by_system ? "secondary" : "outline"}>
                      {history.by_system ? "سیستم" : "کارمند"}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatDate(history.created_at)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              router.push(
                                `/dashboard/orders/history/${history.id}`
                              );
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>مشاهده جزئیات</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground"
                >
                  تاریخچه‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {orderHistories && totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage((page) => page - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page.toLocaleString("fa-IR")}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage((page) => page + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

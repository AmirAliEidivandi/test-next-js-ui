"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Archive, BellPlus, Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

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
import type { QueryOrder } from "@/lib/api/types";
import {
  useCapillarySalesLines,
  useCustomers,
} from "@/lib/hooks/api/use-customers";
import { useSellers } from "@/lib/hooks/api/use-employees";
import { useOrders } from "@/lib/hooks/api/use-orders";
import { OrderFilterDialog } from "./_components/order-filter-dialog";

const stepLabels: Record<string, string> = {
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

const paymentStatusLabels: Record<string, string> = {
  PAID: "پرداخت شده",
  NOT_PAID: "پرداخت نشده",
  PARTIALLY_PAID: "پرداخت جزئی",
};

const deliveryMethodLabels: Record<string, string> = {
  FREE_OUR_TRUCK: "رایگان با ماشین شرکت",
  FREE_OTHER_SERVICES: "رایگان با سرویس خارجی",
  PAID: "ارسال با هزینه مشتری",
  AT_INVENTORY: "تحویل درب انبار",
};

const dayIndexLabels: Record<number, string> = {
  0: "شنبه",
  1: "یکشنبه",
  2: "دوشنبه",
  3: "سه‌شنبه",
  4: "چهارشنبه",
  5: "پنجشنبه",
  6: "جمعه",
};

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

export default function OrdersPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryOrder>({
    "page-size": 20,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;

  // Load filter data
  const { data: salesLines } = useCapillarySalesLines();
  const { data: sellers } = useSellers();
  const { data: customers } = useCustomers({ "page-size": 200 });

  // Load orders
  const query: QueryOrder = {
    ...filters,
    page: currentPage,
  };
  const { data: orders, isLoading, error } = useOrders(query);

  const totalPages = orders ? Math.ceil(orders.count / pageSize) : 0;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست سفارشات", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryOrder) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`);
  };

  if (isLoading && !orders) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
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
          <h2 className="text-2xl font-bold tracking-tight">لیست سفارشات</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده وضعیت سفارش‌ها
          </p>
        </div>
        <div className="flex gap-2">
          <OrderFilterDialog
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
            salesLines={salesLines}
            sellers={sellers}
            customers={customers}
            filters={filters}
            onApply={handleFilterApply}
            onClear={handleClearFilters}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد سفارش</TableHead>
              <TableHead className="text-right">کد حسابداری</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">فروشنده</TableHead>
              <TableHead className="text-right">مرحله</TableHead>
              <TableHead className="text-right">وضعیت پرداخت</TableHead>
              <TableHead className="text-right">روش تحویل</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">تاریخ تحویل</TableHead>
              <TableHead className="text-right">نماینده</TableHead>
              <TableHead className="text-right">خرید انجام شد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders && orders.data.length > 0 ? (
              orders.data.map((order) => {
                const createdDate = new Date(order.created_at);
                const createdDateFormatted = toPersianDigits(
                  format(createdDate, "yyyy/MM/dd", {
                    locale: faIR,
                  })
                );
                const isToday =
                  createdDate.toDateString() === new Date().toDateString();
                const createdDayLabel = isToday
                  ? "امروز"
                  : order.day_index !== undefined
                  ? dayIndexLabels[order.day_index]
                  : undefined;
                const createdDisplay = createdDayLabel
                  ? `${createdDateFormatted} - ${createdDayLabel}`
                  : createdDateFormatted;
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      {order.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </TableCell>
                    <TableCell>
                      {order.hp_invoice_code
                        ? order.hp_invoice_code.toLocaleString("fa-IR", {
                            useGrouping: false,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium max-w-[220px] truncate">
                      {order.customer?.title || "-"}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {order.seller?.profile
                        ? `${order.seller.profile.first_name} ${order.seller.profile.last_name}`
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {stepLabels[order.step] || order.step}
                    </TableCell>
                    <TableCell>
                      {paymentStatusLabels[order.payment_status] ||
                        order.payment_status}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {deliveryMethodLabels[order.delivery_method] ||
                        order.delivery_method}
                    </TableCell>
                    <TableCell>{createdDisplay}</TableCell>
                    <TableCell>
                      {order.delivery_date
                        ? toPersianDigits(
                            format(
                              new Date(order.delivery_date),
                              "yyyy/MM/dd",
                              {
                                locale: faIR,
                              }
                            )
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {order.representative_name || "-"}
                    </TableCell>
                    <TableCell>{order.bought ? "بله" : "خیر"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewOrder(order.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>مشاهده</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Implement edit functionality
                              }}
                              className="h-8 w-8"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ویرایش</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Implement create reminder functionality
                              }}
                              className="h-8 w-8"
                            >
                              <BellPlus className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ایجاد یادآور</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Implement archive functionality
                              }}
                              className="h-8 w-8"
                            >
                              <Archive className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>آرشیو سفارش</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-muted-foreground py-8"
                >
                  داده‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {orders && totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page.toLocaleString("fa-IR")}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
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
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
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

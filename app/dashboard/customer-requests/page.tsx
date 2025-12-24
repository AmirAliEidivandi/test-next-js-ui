"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
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
import type { QueryCustomerRequest } from "@/lib/api/types";
import { useCustomerRequests } from "@/lib/hooks/api/use-customer-requests";
import { useCustomers } from "@/lib/hooks/api/use-customers";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { CustomerRequestFilterDialog } from "./_components/customer-request-filter-dialog";

const paymentMethodLabels: Record<
  NonNullable<QueryCustomerRequest["payment_method"]>,
  string
> = {
  ONLINE: "آنلاین",
  WALLET: "کیف پول",
  BANK_RECEIPT: "فیش بانکی",
};

const statusLabels: Record<
  NonNullable<QueryCustomerRequest["status"]>,
  string
> = {
  PENDING: "در انتظار",
  CONVERTED_TO_ORDER: "تبدیل شده به سفارش",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
  CANCELLED: "لغو شده",
  DELIVERED: "تحویل شده",
  PROCESSING: "آماده سازی",
};

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);

const formatDate = (date?: Date) => {
  if (!date) return "-";
  return toPersianDigits(
    format(date, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

export default function CustomerRequestsPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<QueryCustomerRequest>({
    "page-size": 20,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;

  // Load filter data
  const { data: customers } = useCustomers({ "page-size": 200 });

  // Load customer requests
  const query: QueryCustomerRequest = {
    ...filters,
    page: currentPage,
  };
  const {
    data: customerRequests,
    isLoading,
    error,
  } = useCustomerRequests(query);

  const totalPages = customerRequests
    ? Math.ceil(customerRequests.count / pageSize)
    : 0;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری درخواست‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryCustomerRequest) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  if (isLoading && !customerRequests) {
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
            لیست درخواست‌های مشتریان
          </h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و بررسی درخواست‌های ثبت شده
          </p>
        </div>
        <CustomerRequestFilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          customers={customers ?? null}
          filters={filters}
          onApply={handleFilterApply}
          onClear={handleClearFilters}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد درخواست</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">نماینده</TableHead>
              <TableHead className="text-right">روش پرداخت</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">تعداد اقلام</TableHead>
              <TableHead className="text-right">مبلغ کل</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerRequests && customerRequests.data.length > 0 ? (
              customerRequests.data.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.code.toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{request.customer?.title || "-"}</span>
                      {request.customer?.code && (
                        <span className="text-xs text-muted-foreground">
                          کد:{" "}
                          {request.customer.code.toLocaleString("fa-IR", {
                            useGrouping: false,
                          })}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{request.representative_name || "-"}</TableCell>
                  <TableCell>
                    {paymentMethodLabels[request.payment_method] ||
                      request.payment_method}
                  </TableCell>
                  <TableCell>
                    {statusLabels[request.status] || request.status}
                  </TableCell>
                  <TableCell>
                    {request.products_count.toLocaleString("fa-IR")}
                  </TableCell>
                  <TableCell>
                    {request.total_price
                      ? `${request.total_price.toLocaleString("fa-IR")} ریال`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {formatDate(new Date(request.created_at))}
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
                                `/dashboard/customer-requests/${request.id}`
                              );
                            }}
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
                  colSpan={9}
                  className="py-8 text-center text-muted-foreground"
                >
                  درخواستی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {customerRequests && totalPages > 1 && (
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

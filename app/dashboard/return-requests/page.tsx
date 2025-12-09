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
import type { QueryReturnRequest } from "@/lib/api/types";
import { useReturnRequests } from "@/lib/hooks/api/use-return-requests";
import { ReturnRequestFilterDialog } from "./_components/return-request-filter-dialog";

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);

const formatDate = (date?: Date | string, withTime = false) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  const pattern = withTime ? "yyyy/MM/dd HH:mm" : "yyyy/MM/dd";
  return toPersianDigits(
    format(d, pattern, {
      locale: faIR,
    })
  );
};

const statusLabels: Record<string, string> = {
  PENDING: "در انتظار",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
  RECEIVED: "دریافت شده",
};

export default function ReturnRequestsPage() {
  const router = useRouter();
  const [filters, setFilters] = React.useState<QueryReturnRequest>({
    "page-size": 20,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;

  const query: QueryReturnRequest = {
    ...filters,
    page: currentPage,
  };

  const { data: returnRequests, isLoading, error } = useReturnRequests(query);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری درخواست‌های مرجوعی", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryReturnRequest) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const totalPages = returnRequests
    ? Math.ceil(returnRequests.count / pageSize)
    : 0;

  if (isLoading && !returnRequests) {
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
            درخواست‌های مرجوعی
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده و مدیریت درخواست‌های مرجوعی
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ReturnRequestFilterDialog
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
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
              <TableHead className="text-right">کد درخواست</TableHead>
              <TableHead className="text-right">کد سفارش</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">نماینده</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-right">تعداد اقلام</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {returnRequests && returnRequests.data.length > 0 ? (
              returnRequests.data.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.request.code
                      ? request.request.code.toLocaleString("fa-IR", {
                          useGrouping: false,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {request.order.code
                      ? request.order.code.toLocaleString("fa-IR", {
                          useGrouping: false,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {request.customer ? (
                      <div className="max-w-[260px] truncate text-sm">
                        {request.customer.title}
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {request.representative_name || "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {statusLabels[request.status] || request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm">
                      {formatDate(request.created_at, true)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {request.return_items_count
                      ? request.return_items_count.toLocaleString("fa-IR", {
                          useGrouping: false,
                        })
                      : "۰"}
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
                                `/dashboard/return-requests/${request.id}`
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
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  درخواست مرجوعی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {returnRequests && totalPages > 1 && (
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


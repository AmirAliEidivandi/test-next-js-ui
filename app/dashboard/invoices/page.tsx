"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye } from "lucide-react";
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
import { useInvoices } from "@/lib/hooks/api/use-invoices";
import { useCustomers } from "@/lib/hooks/api/use-customers";
import { useSellers } from "@/lib/hooks/api/use-employees";
import type { QueryInvoice } from "@/lib/api/types";
import { InvoiceFilterDialog } from "./_components/invoice-filter-dialog";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

const paymentStatusLabels: Record<
  NonNullable<QueryInvoice["payment_status"]>,
  string
> = {
  PAID: "پرداخت شده",
  NOT_PAID: "پرداخت نشده",
  PARTIALLY_PAID: "پرداخت جزئی",
};

const invoiceTypeLabels: Record<NonNullable<QueryInvoice["type"]>, string> = {
  PURCHASE: "خرید",
  RETURN_FROM_PURCHASE: "مرجوعی خرید",
  SELL: "فروش",
};

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);

const formatDate = (date?: Date) => {
  if (!date) {
    return "-";
  }
  return toPersianDigits(
    format(date, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

export default function InvoicesPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryInvoice>({ "page-size": 20 });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const pageSize = filters["page-size"] || 20;

  // Load filter data
  const { data: customers } = useCustomers({ "page-size": 200 });
  const { data: sellers } = useSellers();

  // Load invoices
  const query: QueryInvoice = {
    ...filters,
    page: currentPage,
  };
  const { data: invoices, isLoading, error } = useInvoices(query);

  const totalPages = invoices ? Math.ceil(invoices.count / pageSize) : 0;
  
  const handleViewInvoice = (invoiceId: string) => {
    router.push(`/dashboard/invoices/${invoiceId}`);
  };

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست فاکتورها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryInvoice) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  if (isLoading && !invoices) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>

        <TableSkeleton rows={10} columns={9} />

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-2">
          <Skeleton className="h-10 w-10" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10" />
          ))}
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">لیست فاکتورها</h2>
          <p className="text-sm text-muted-foreground">
            مشاهده وضعیت فاکتورهای ثبت شده
          </p>
        </div>
        <InvoiceFilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          customers={customers}
          sellers={sellers}
          filters={filters}
          onApply={handleFilterApply}
          onClear={handleClearFilters}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد فاکتور</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">مبلغ</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              <TableHead className="text-right">تاریخ سررسید</TableHead>
              <TableHead className="text-right">وضعیت پرداخت</TableHead>
              <TableHead className="text-right">نوع فاکتور</TableHead>
              <TableHead className="text-right">کد سفارش</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices && invoices.data.length > 0 ? (
              invoices.data.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.code.toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}
                  </TableCell>
                  <TableCell>{invoice.customer?.title || "نامشخص"}</TableCell>
                  <TableCell>
                    {invoice.amount.toLocaleString("fa-IR")} ریال
                  </TableCell>
                  <TableCell>{formatDate(new Date(invoice.date))}</TableCell>
                  <TableCell>
                    {formatDate(new Date(invoice.due_date))}
                  </TableCell>
                  <TableCell>
                    {paymentStatusLabels[invoice.payment_status] ||
                      invoice.payment_status}
                  </TableCell>
                  <TableCell>
                    {invoiceTypeLabels[invoice.type] || invoice.type}
                  </TableCell>
                  <TableCell>
                    {invoice.order?.code
                      ? invoice.order.code.toLocaleString("fa-IR", {
                          useGrouping: false,
                        })
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewInvoice(invoice.id)}
                            className="h-8 w-8"
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
                  فاکتوری برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {invoices && totalPages > 1 && (
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

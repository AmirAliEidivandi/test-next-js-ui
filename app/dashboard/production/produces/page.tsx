"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye, Filter } from "lucide-react";
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
import type { QueryProduce } from "@/lib/api/types";
import { useProduces } from "@/lib/hooks/api/use-produces";
import { ProduceDetailDialog } from "./_components/produce-detail-dialog";

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return toPersianDigits(
    format(new Date(date), "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

export default function ProducesPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryProduce>({
    "page-size": 20,
  });
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [detailProduceId, setDetailProduceId] = React.useState<string | null>(
    null
  );

  const pageSize = filters["page-size"] || 20;

  // Load produces
  const query: QueryProduce = {
    ...filters,
    page: currentPage,
  };
  const { data: produces, isLoading, error } = useProduces(query);

  const totalPages = produces ? Math.ceil(produces.count / pageSize) : 0;

  // Memoize produces data to prevent unnecessary re-renders
  const producesData = React.useMemo(() => produces?.data ?? [], [produces?.data]);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست تولیدات", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleViewDetails = React.useCallback((id: string) => {
    setDetailProduceId(id);
    setDetailDialogOpen(true);
  }, []);

  if (isLoading && !produces) {
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
          <h2 className="text-2xl font-bold tracking-tight">لیست تولیدات</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده تولیدات ثبت شده
          </p>
        </div>
        <Button variant="outline" onClick={() => {}}>
          <Filter className="ml-2 size-4" />
          فیلتر
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد</TableHead>
              <TableHead className="text-right">اسم محصول ورودی</TableHead>
              <TableHead className="text-right">محصولات خروجی</TableHead>
              <TableHead className="text-right">تاریخ تولید</TableHead>
              <TableHead className="text-right">میزان اضافات</TableHead>
              <TableHead className="text-right">میزان افت</TableHead>
              <TableHead className="text-right">تعداد کارتن</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {producesData.length > 0 ? (
              producesData.map((produce) => (
                <TableRow key={produce.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits(
                      produce.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })
                    )}
                  </TableCell>
                  <TableCell>
                    {produce.input_product?.product_title || "-"}
                  </TableCell>
                  <TableCell>
                    {produce.output_products && produce.output_products.length > 0
                      ? produce.output_products
                          .map((p) => p.product_title)
                          .join("، ")
                      : "-"}
                  </TableCell>
                  <TableCell>{formatDate(produce.production_date)}</TableCell>
                  <TableCell>
                    {toPersianDigits(produce.waste.toLocaleString("fa-IR"))} کیلوگرم
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(produce.lost.toLocaleString("fa-IR"))} کیلوگرم
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(produce.box_weight.toLocaleString("fa-IR"))}
                  </TableCell>
                  <TableCell>{formatDate(produce.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(produce.id)}
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
                  className="text-center text-muted-foreground py-8"
                >
                  تولیدی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {produces && totalPages > 1 && (
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
                          {toPersianDigits(page.toLocaleString("fa-IR"))}
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

      {/* Produce Detail Dialog */}
      <ProduceDetailDialog
        open={detailDialogOpen}
        onOpenChange={(open) => {
          setDetailDialogOpen(open);
          if (!open) {
            setDetailProduceId(null);
          }
        }}
        produceId={detailProduceId}
      />
    </div>
  );
}


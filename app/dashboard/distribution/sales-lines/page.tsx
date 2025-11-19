"use client";

import * as React from "react";
import { toast } from "sonner";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useCapillarySalesLines } from "@/lib/hooks/api/use-customers";
import type { QueryCapillarySalesLine } from "@/lib/api/types";

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export default function SalesLinesPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);

  const query: QueryCapillarySalesLine = {
    page: currentPage,
    "page-size": pageSize,
  };

  const { data: salesLines, isLoading, error } = useCapillarySalesLines(query);

  const totalPages = salesLines ? Math.ceil(salesLines.count / pageSize) : 0;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری خط‌های فروش", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setCurrentPage(1);
  };

  if (isLoading && !salesLines) {
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
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">خط‌های فروش</h2>
          <p className="text-sm text-muted-foreground">
            لیست خطوط پخش مویرگی
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">تعداد در صفحه</label>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="تعداد" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size.toLocaleString("fa-IR")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">عنوان خط</TableHead>
              <TableHead className="text-right">شماره خط</TableHead>
              <TableHead className="text-right">توضیحات</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {salesLines && salesLines.data.length > 0 ? (
              salesLines.data.map((line) => (
                <TableRow key={line.id}>
                  <TableCell className="font-medium">{line.title}</TableCell>
                  <TableCell>
                    {line.line_number.toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}
                  </TableCell>
                  <TableCell className="max-w-[400px]">
                    {line.description
                      ? line.description.length > 120
                        ? `${line.description.slice(0, 117)}...`
                        : line.description
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            // TODO: navigate to sales line details when available
                          }}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>مشاهده</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-8 text-center text-muted-foreground"
                >
                  خط فروشی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {salesLines && totalPages > 1 && (
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


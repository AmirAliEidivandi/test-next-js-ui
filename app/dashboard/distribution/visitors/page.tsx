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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useVisitors } from "@/lib/hooks/api/use-employees";

export default function VisitorsPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20;

  const { data: visitors, isLoading, error } = useVisitors();

  const totalPages = visitors ? Math.ceil(visitors.count / pageSize) : 0;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست ویزیتورها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const paginatedVisitors = visitors
    ? visitors.data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  if (isLoading && !visitors) {
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
          <h2 className="text-2xl font-bold tracking-tight">لیست ویزیتورها</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده ویزیتورهای فعال
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">نام و نام خانوادگی</TableHead>
              <TableHead className="text-right">خط فروش</TableHead>
              <TableHead className="text-right">شماره خط</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVisitors.length > 0 ? (
              paginatedVisitors.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="font-medium">
                    {visitor.profile
                      ? `${visitor.profile.first_name} ${visitor.profile.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {visitor.capillary_sales_lines?.[0]?.title || "-"}
                  </TableCell>
                  <TableCell>
                    {visitor.capillary_sales_lines?.[0]?.line_number !==
                    undefined
                      ? visitor.capillary_sales_lines[0].line_number.toLocaleString(
                          "fa-IR",
                          { useGrouping: false }
                        )
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
                            // TODO: navigate to visitor detail page when available
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
                  ویزیتوری برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
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
                          isActive={page === currentPage}
                          onClick={(event) => {
                            event.preventDefault();
                            setCurrentPage(page);
                          }}
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


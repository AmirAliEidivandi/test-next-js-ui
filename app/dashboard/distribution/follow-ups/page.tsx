"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye } from "lucide-react";
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
import type { QueryFollowUp } from "@/lib/api/types";
import { useCapillarySalesLines } from "@/lib/hooks/api/use-customers";
import { useEmployees } from "@/lib/hooks/api/use-employees";
import { useFollowUps } from "@/lib/hooks/api/use-follow-ups";
import { FollowUpFilterDialog } from "./_components/follow-up-filter-dialog";

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

const formatDate = (date?: Date) => {
  if (!date) return "-";
  return toPersianDigits(
    format(date, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const resultLabels: Record<
  "CUSTOMER" | "NOT_CUSTOMER" | "REQUIRES_FOLLOW_UP" | "NOT_ANSWERED",
  string
> = {
  CUSTOMER: "مشتری",
  NOT_CUSTOMER: "مشتری نیست",
  REQUIRES_FOLLOW_UP: "نیاز به پیگیری",
  NOT_ANSWERED: "پاسخ نداده",
};

const resultBadgeVariants: Record<
  "CUSTOMER" | "NOT_CUSTOMER" | "REQUIRES_FOLLOW_UP" | "NOT_ANSWERED",
  "default" | "secondary" | "destructive" | "outline"
> = {
  CUSTOMER: "default",
  NOT_CUSTOMER: "destructive",
  REQUIRES_FOLLOW_UP: "secondary",
  NOT_ANSWERED: "outline",
};

export default function FollowUpsPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryFollowUp>({
    "page-size": 20,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;

  // Load filter data
  const { data: employees } = useEmployees();
  const { data: salesLines } = useCapillarySalesLines();

  // Load follow-ups
  const query: QueryFollowUp = {
    ...filters,
    page: currentPage,
  };
  const { data: followUps, isLoading, error } = useFollowUps(query);

  const totalPages = followUps ? Math.ceil(followUps.count / pageSize) : 0;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست پیگیری‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryFollowUp) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleViewDetails = (id: string) => {
    // TODO: Implement detail view when API is available
    toast.info("نمایش جزئیات پیگیری", {
      description: "این قابلیت به زودی اضافه خواهد شد",
    });
  };

  if (isLoading && !followUps) {
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
          <h2 className="text-2xl font-bold tracking-tight">لیست پیگیری‌ها</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده پیگیری‌های ثبت شده
          </p>
        </div>
        <FollowUpFilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          employees={employees}
          salesLines={salesLines}
          filters={filters}
          onApply={handleFilterApply}
          onClear={handleClearFilters}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">کارمند</TableHead>
              <TableHead className="text-right">نتیجه</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {followUps && followUps.data.length > 0 ? (
              followUps.data.map((followUp) => {
                const createdDate = new Date(followUp.created_at);
                return (
                  <TableRow key={followUp.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {followUp.customer?.title || "-"}
                        </span>
                        {followUp.customer?.code && (
                          <span className="text-xs text-muted-foreground">
                            کد:{" "}
                            {followUp.customer.code.toLocaleString("fa-IR", {
                              useGrouping: false,
                            })}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {followUp.employee?.profile
                        ? `${followUp.employee.profile.first_name} ${followUp.employee.profile.last_name}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          resultBadgeVariants[followUp.result] || "default"
                        }
                      >
                        {resultLabels[followUp.result] || followUp.result}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(createdDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewDetails(followUp.id)}
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
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  پیگیری‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {followUps && totalPages > 1 && (
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


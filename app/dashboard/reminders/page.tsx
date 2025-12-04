"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CheckCircle2, Eye } from "lucide-react";
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
import type { QueryReminder } from "@/lib/api/types";
import { useEmployees } from "@/lib/hooks/api/use-employees";
import { useReminders, useUpdateReminder } from "@/lib/hooks/api/use-reminders";
import { ReminderDetailDialog } from "./_components/reminder-detail-dialog";
import { ReminderFilterDialog } from "./_components/reminder-filter-dialog";

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

export default function RemindersPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryReminder>({
    "page-size": 20,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [activeReminderId, setActiveReminderId] = React.useState<string | null>(
    null
  );

  const pageSize = filters["page-size"] || 20;

  // Load filter data
  const { data: employees } = useEmployees();

  // Load reminders
  const query: QueryReminder = {
    ...filters,
    page: currentPage,
  };
  const { data: reminders, isLoading, error } = useReminders(query);
  const updateReminderMutation = useUpdateReminder();

  const totalPages = reminders ? Math.ceil(reminders.count / pageSize) : 0;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست یادآورها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryReminder) => {
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
    setActiveReminderId(id);
    setDetailDialogOpen(true);
  };

  const handleToggleSeen = async (id: string, currentSeen: boolean) => {
    try {
      await updateReminderMutation.mutateAsync({
        id,
        request: { seen: !currentSeen },
      });
      toast.success(
        currentSeen
          ? "یادآور به عنوان دیده نشده علامت‌گذاری شد"
          : "یادآور به عنوان دیده شده علامت‌گذاری شد"
      );
    } catch (error) {
      toast.error("خطا در به‌روزرسانی وضعیت یادآور", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  };

  if (isLoading && !reminders) {
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
          <h2 className="text-2xl font-bold tracking-tight">لیست یادآورها</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده یادآورهای ثبت شده
          </p>
        </div>
        <ReminderFilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          employees={employees}
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
              <TableHead className="text-right">پیام</TableHead>
              <TableHead className="text-right">تاریخ یادآوری</TableHead>
              <TableHead className="text-right">نماینده</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reminders && reminders.data.length > 0 ? (
              reminders.data.map((reminder) => {
                const reminderDate = new Date(reminder.date);
                const createdDate = new Date(reminder.created_at);
                return (
                  <TableRow key={reminder.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {reminder.customer?.title || "-"}
                        </span>
                        {reminder.customer?.code && (
                          <span className="text-xs text-muted-foreground">
                            کد:{" "}
                            {reminder.customer.code.toLocaleString("fa-IR", {
                              useGrouping: false,
                            })}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate" title={reminder.message}>
                        {reminder.message || "-"}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(reminderDate)}</TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {reminder.representative_name || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={reminder.seen ? "default" : "secondary"}
                        className={
                          reminder.seen
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        }
                      >
                        {reminder.seen ? "دیده شده" : "دیده نشده"}
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
                              onClick={() => handleViewDetails(reminder.id)}
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
                              onClick={() =>
                                handleToggleSeen(reminder.id, reminder.seen)
                              }
                              disabled={updateReminderMutation.isPending}
                              className="h-8 w-8"
                            >
                              <CheckCircle2
                                className={`size-4 ${
                                  reminder.seen
                                    ? "text-green-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {reminder.seen
                                ? "علامت‌گذاری به عنوان دیده نشده"
                                : "علامت‌گذاری به عنوان دیده شده"}
                            </p>
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
                  colSpan={7}
                  className="text-center text-muted-foreground py-8"
                >
                  یادآوری برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {reminders && totalPages > 1 && (
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

      {/* Detail Dialog */}
      <ReminderDetailDialog
        open={detailDialogOpen}
        onOpenChange={(open) => {
          setDetailDialogOpen(open);
          if (!open) setActiveReminderId(null);
        }}
        reminderId={activeReminderId}
      />
    </div>
  );
}


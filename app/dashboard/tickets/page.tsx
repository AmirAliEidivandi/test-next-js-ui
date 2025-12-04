"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import type { QueryTicket } from "@/lib/api/types";
import { useEmployees } from "@/lib/hooks/api/use-employees";
import {
  useAssignTicket,
  useTickets,
  useUpdateTicketStatus,
  useTicket,
} from "@/lib/hooks/api/use-tickets";
import { Eye, Repeat, UserPlus } from "lucide-react";
import { TicketFilterDialog } from "./_components/ticket-filter-dialog";
import TicketMessages from "./_components/ticket-messages";
import { TicketReplyForm } from "./_components/ticket-reply-form";
import { Separator } from "@/components/ui/separator";

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

const truncate = (text: string | undefined | null, length = 80) => {
  if (!text) return "-";
  return String(text).trim();
};

const statusLabels: Record<string, string> = {
  OPEN: "باز",
  CLOSED: "بسته",
  REOPENED: "باز شده",
  RESOLVED: "حل شده",
  WAITING_CUSTOMER: "در انتظار مشتری",
  WAITING_SUPPORT: "در انتظار پشتیبان",
};

const priorityLabels: Record<string, string> = {
  LOW: "کم",
  NORMAL: "متوسط",
  HIGH: "بالا",
  URGENT: "فوری",
};

export default function TicketsPage() {
  const [filters, setFilters] = React.useState<QueryTicket>({
    "page-size": 20,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;

  const query: QueryTicket = {
    ...filters,
    page: currentPage,
  };

  const { data: tickets, isLoading, error } = useTickets(query);
  const employeesQuery = useEmployees();

  const assignMutation = useAssignTicket();
  const statusMutation = useUpdateTicketStatus();

  const [assignOpen, setAssignOpen] = React.useState(false);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [activeTicketId, setActiveTicketId] = React.useState<string | null>(
    null
  );
  const ticketDetailQuery = useTicket(activeTicketId || "");
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("");

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری تیکت‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryTicket) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const totalPages = tickets ? Math.ceil(tickets.count / pageSize) : 0;

  if (isLoading && !tickets) {
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
          <h2 className="text-2xl font-bold tracking-tight">لیست تیکت‌ها</h2>
          <p className="text-sm text-muted-foreground">
            مشاهده و مدیریت تیکت‌های ثبت شده
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TicketFilterDialog
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
              <TableHead className="text-right">موضوع</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">ایجاد کننده</TableHead>
              <TableHead className="text-right">ارجاع شده به</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-right">الویت</TableHead>
              <TableHead className="text-right">ایجاد</TableHead>
              <TableHead className="text-right">آخرین به‌روزرسانی</TableHead>
              <TableHead className="text-right">آخرین پیام</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets && tickets.data.length > 0 ? (
              tickets.data.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium max-w-[260px] truncate">
                    {ticket.subject}
                  </TableCell>
                  <TableCell>
                    {ticket.customer ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="max-w-[260px] truncate text-sm">
                            {ticket.customer.title}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <div className="flex flex-col">
                            <div className="font-medium">
                              {ticket.customer.title}
                            </div>
                            {ticket.customer.code != null && (
                              <div className="text-xs text-muted-foreground">
                                کد:{" "}
                                {ticket.customer.code.toLocaleString("fa-IR", {
                                  useGrouping: false,
                                })}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {ticket.creator_person
                      ? `${ticket.creator_person.profile.first_name} ${ticket.creator_person.profile.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {ticket.assigned_to
                      ? `${ticket.assigned_to.profile.first_name} ${ticket.assigned_to.profile.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {statusLabels[ticket.status] || ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {priorityLabels[ticket.priority] || ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm">
                      {formatDate(ticket.created_at, true)}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="text-sm">
                      {formatDate(ticket.updated_at, true)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {ticket.last_message ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="max-w-[280px] truncate text-sm">
                            {ticket.last_message.message}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="whitespace-pre-wrap">
                            {ticket.last_message.message}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
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
                              setActiveTicketId(ticket.id);
                              setDetailOpen(true);
                            }}
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
                            className="h-8 w-8"
                            onClick={() => {
                              setActiveTicketId(ticket.id);
                              setSelectedEmployee(ticket.assigned_to?.id || "");
                              setAssignOpen(true);
                            }}
                          >
                            <UserPlus className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ارجاع به</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              setActiveTicketId(ticket.id);
                              setSelectedStatus(ticket.status || "");
                              setStatusOpen(true);
                            }}
                          >
                            <Repeat className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>تغییر وضعیت</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="py-8 text-center text-muted-foreground"
                >
                  تیکتی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {tickets && totalPages > 1 && (
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

      {/* Detail Dialog */}
      <Dialog
        open={detailOpen}
        onOpenChange={(v) => {
          setDetailOpen(v);
          if (!v) setActiveTicketId(null);
        }}
      >
        <DialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden p-0">
          <div className="px-6 pt-6 pb-4">
            <DialogHeader className="pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <DialogTitle className="text-xl mb-2">
                    {ticketDetailQuery.data?.subject || "جزئیات تیکت"}
                  </DialogTitle>
                  {ticketDetailQuery.data && (
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline">
                        {statusLabels[ticketDetailQuery.data.status] ||
                          ticketDetailQuery.data.status}
                      </Badge>
                      <Badge variant="secondary">
                        {priorityLabels[ticketDetailQuery.data.priority] ||
                          ticketDetailQuery.data.priority}
                      </Badge>
                      {ticketDetailQuery.data.customer && (
                        <Badge variant="outline" className="text-xs">
                          {ticketDetailQuery.data.customer.title}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Info */}
              {ticketDetailQuery.data && (
                <div className="mt-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">ایجاد کننده:</span>{" "}
                      <span className="font-medium">
                        {ticketDetailQuery.data.creator_person
                          ? `${ticketDetailQuery.data.creator_person.profile.first_name} ${ticketDetailQuery.data.creator_person.profile.last_name}`
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ارجاع شده به:</span>{" "}
                      <span className="font-medium">
                        {ticketDetailQuery.data.assigned_to
                          ? `${ticketDetailQuery.data.assigned_to.profile.first_name} ${ticketDetailQuery.data.assigned_to.profile.last_name}`
                          : "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">تاریخ ایجاد:</span>{" "}
                      <span className="font-medium">
                        {formatDate(ticketDetailQuery.data.created_at, true)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>{" "}
                      <span className="font-medium">
                        {formatDate(ticketDetailQuery.data.updated_at, true)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </DialogHeader>
          </div>

          <Separator />

          {/* Messages Area - Scrollable */}
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto min-h-0">
              {activeTicketId ? (
                <TicketMessages ticketId={activeTicketId} className="h-full" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
                    <p className="text-sm">در حال بارگذاری...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Form - Fixed at bottom */}
            {activeTicketId && (
              <div className="border-t px-6 pt-4 pb-6 bg-background shrink-0">
                <TicketReplyForm
                  ticketId={activeTicketId}
                  ticketStatus={ticketDetailQuery.data?.status}
                  onSuccess={() => {
                    // Messages will auto-refresh via query invalidation
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ارجاع تیکت</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-2">
              کارمند مورد نظر را انتخاب کنید
            </p>
            <Select
              value={selectedEmployee}
              onValueChange={(v) => setSelectedEmployee(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب کارمند" />
              </SelectTrigger>
              <SelectContent>
                {employeesQuery.data?.map((s: any) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.profile.first_name} {s.profile.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setAssignOpen(false);
                setActiveTicketId(null);
                setSelectedEmployee("");
              }}
            >
              انصراف
            </Button>
            <Button
              disabled={!selectedEmployee || (assignMutation as any).isLoading}
              onClick={() => {
                if (!activeTicketId) return;
                assignMutation.mutate(
                  { ticketId: activeTicketId, employee_id: selectedEmployee },
                  {
                    onSuccess: () => {
                      toast.success("تیکت با موفقیت ارجاع داده شد");
                      setAssignOpen(false);
                      setActiveTicketId(null);
                      setSelectedEmployee("");
                    },
                    onError: () => {
                      toast.error("خطا در ارجاع تیکت");
                    },
                  }
                );
              }}
            >
              {(assignMutation as any).isLoading ? "در حال ارسال..." : "تایید"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغییر وضعیت تیکت</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-2">
              وضعیت جدید را انتخاب کنید
            </p>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(statusLabels).map((key) => (
                  <SelectItem key={key} value={key}>
                    {statusLabels[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setStatusOpen(false);
                setActiveTicketId(null);
                setSelectedStatus("");
              }}
            >
              انصراف
            </Button>
            <Button
              disabled={!selectedStatus || (statusMutation as any).isLoading}
              onClick={() => {
                if (!activeTicketId) return;
                statusMutation.mutate(
                  { ticketId: activeTicketId, status: selectedStatus },
                  {
                    onSuccess: () => {
                      toast.success("وضعیت تیکت تغییر کرد");
                      setStatusOpen(false);
                      setActiveTicketId(null);
                      setSelectedStatus("");
                    },
                    onError: () => {
                      toast.error("خطا در تغییر وضعیت");
                    },
                  }
                );
              }}
            >
              {(statusMutation as any).isLoading ? "در حال ارسال..." : "تایید"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye, Repeat } from "lucide-react";
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
import type { BankEnum, CheckStatusEnum, QueryCheck } from "@/lib/api/types";
import { useChangeCheckStatus, useChecks } from "@/lib/hooks/api/use-checks";
import { CheckDetailDialog } from "./_components/check-detail-dialog";
import { CheckFilterDialog } from "./_components/check-filter-dialog";

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

const statusLabels: Record<CheckStatusEnum, string> = {
  RECEIVED_BY_ACCOUNTING: "دریافت چک توسط حسابداری",
  DELIVERED_TO_PROCUREMENT: "تحویل به کارپرداز",
  DELIVERED_TO_BANK: "تحویل به بانک",
  CLEARED: "پاس شده",
  RETURNED: "برگشت خورده",
};

const statusBadgeVariants: Record<
  CheckStatusEnum,
  "default" | "secondary" | "destructive" | "outline"
> = {
  RECEIVED_BY_ACCOUNTING: "secondary",
  DELIVERED_TO_PROCUREMENT: "outline",
  DELIVERED_TO_BANK: "default",
  CLEARED: "default",
  RETURNED: "destructive",
};

const bankLabels: Record<BankEnum, string> = {
  SEPAH: "صادرات",
  MELLI: "ملی",
  TEJARAT: "تجارت",
  REFAH: "رفاه",
  MASKAN: "مسکن",
  KESHAVARZI: "کشاورزی",
  SANAT_VA_MADAN: "صنعت و معدن",
  POST_BANK: "پست بانک",
  MELLAT: "ملت",
  SADERAT: "صادرات",
  PARSIAN: "پارسیان",
  PASARGAD: "پاسارگاد",
  SAMAN: "سامان",
  EGHTESAD_NOVIN: "اقتصاد نوین",
  DEY: "دی",
  KARAFARIN: "کارآفرین",
  SINA: "سینا",
  SARMAYEH: "سرمایه",
  SHAHR: "شهر",
  AYANDEH: "آینده",
  ANSAR: "انصار",
  GARDESHGARI: "گردشگری",
  HEKMAT_IRANIAN: "حکمت ایرانیان",
  MEHREGAN: "مهرگان",
  RESALAT: "رسالت",
  KOSAR: "کوثر",
  MIDDLE_EAST: "خاورمیانه",
  IRAN_ZAMIN: "ایران زمین",
  MEHR_EGHTESAD: "مهر اقتصاد",
  TOSEE_TAAVON: "توسعه تعاون",
  EXPORT_DEVELOPMENT_BANK: "توسعه صادرات",
  TOSEE_CREDIT: "توسعه اعتبارات",
  MEHR_IRAN: "مهر ایران",
  NOOR: "نور",
  OTHER: "سایر",
};

type CheckTableRowProps = {
  check: {
    id: string;
    check_number: number;
    check_date: string; // ISO date string from API
    account_number: string;
    amount: number;
    issuer_bank: BankEnum;
    destination_bank: BankEnum | null;
    status: CheckStatusEnum;
    created_at: string; // ISO date string from API
  };
  onViewDetails: (id: string) => void;
  onOpenStatusDialog: (id: string, status: CheckStatusEnum) => void;
};

const CheckTableRow = React.memo<CheckTableRowProps>(
  ({ check, onViewDetails, onOpenStatusDialog }) => {
    const checkDate = new Date(check.check_date);
    const createdDate = new Date(check.created_at);
    return (
      <TableRow>
        <TableCell className="font-medium">
          {toPersianDigits(
            check.check_number.toLocaleString("fa-IR", {
              useGrouping: false,
            })
          )}
        </TableCell>
        <TableCell>
          {check.account_number ? toPersianDigits(check.account_number) : "-"}
        </TableCell>
        <TableCell>{formatDate(checkDate)}</TableCell>
        <TableCell>
          {toPersianDigits(check.amount.toLocaleString("fa-IR"))} ریال
        </TableCell>
        <TableCell>
          {bankLabels[check.issuer_bank] || check.issuer_bank}
        </TableCell>
        <TableCell>
          {check.destination_bank
            ? bankLabels[check.destination_bank] || check.destination_bank
            : "-"}
        </TableCell>
        <TableCell className="w-[200px] min-w-[200px]">
          <Badge variant={statusBadgeVariants[check.status] || "default"}>
            {statusLabels[check.status] || check.status}
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
                  onClick={() => onViewDetails(check.id)}
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
                  onClick={() => onOpenStatusDialog(check.id, check.status)}
                  className="h-8 w-8"
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
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if check data actually changed
    // Compare dates as strings since they come from API as ISO strings
    return (
      prevProps.check.id === nextProps.check.id &&
      prevProps.check.status === nextProps.check.status &&
      prevProps.check.amount === nextProps.check.amount &&
      prevProps.check.check_date === nextProps.check.check_date &&
      prevProps.check.created_at === nextProps.check.created_at &&
      prevProps.check.check_number === nextProps.check.check_number &&
      prevProps.check.account_number === nextProps.check.account_number &&
      prevProps.check.issuer_bank === nextProps.check.issuer_bank &&
      prevProps.check.destination_bank === nextProps.check.destination_bank
    );
  }
);
CheckTableRow.displayName = "CheckTableRow";

export default function ChecksPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryCheck>({
    "page-size": 20,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [activeCheckId, setActiveCheckId] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<
    CheckStatusEnum | ""
  >("");
  const [detailCheckId, setDetailCheckId] = React.useState<string | null>(null);

  const pageSize = filters["page-size"] || 20;

  // Load checks
  const query: QueryCheck = {
    ...filters,
    page: currentPage,
  };
  const { data: checks, isLoading, error } = useChecks(query);
  const changeStatusMutation = useChangeCheckStatus();

  const totalPages = checks ? Math.ceil(checks.count / pageSize) : 0;

  // Memoize checks data to prevent unnecessary re-renders
  const checksData = React.useMemo(() => checks?.data ?? [], [checks?.data]);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست چک‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleFilterApply = (newFilters: QueryCheck) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleViewDetails = React.useCallback((id: string) => {
    setDetailCheckId(id);
    setDetailDialogOpen(true);
  }, []);

  const handleOpenStatusDialog = React.useCallback(
    (checkId: string, currentStatus: CheckStatusEnum) => {
      setActiveCheckId(checkId);
      setSelectedStatus(currentStatus);
      setStatusDialogOpen(true);
    },
    []
  );

  const handleConfirmStatusChange = () => {
    if (!activeCheckId || !selectedStatus) {
      return;
    }

    changeStatusMutation.mutate(
      {
        checkId: activeCheckId,
        status: selectedStatus as CheckStatusEnum,
      },
      {
        onSuccess: () => {
          toast.success("وضعیت چک با موفقیت تغییر کرد", {
            description: `وضعیت به "${
              statusLabels[selectedStatus as CheckStatusEnum]
            }" تغییر یافت`,
          });
          setStatusDialogOpen(false);
          setActiveCheckId(null);
          setSelectedStatus("");
        },
        onError: () => {
          toast.error("خطا در تغییر وضعیت چک", {
            description: "لطفا دوباره تلاش کنید",
          });
        },
      }
    );
  };

  if (isLoading && !checks) {
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
          <h2 className="text-2xl font-bold tracking-tight">لیست چک‌ها</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده چک‌های ثبت شده
          </p>
        </div>
        <CheckFilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          filters={filters}
          onApply={handleFilterApply}
          onClear={handleClearFilters}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">شماره چک</TableHead>
              <TableHead className="text-right">شماره حساب</TableHead>
              <TableHead className="text-right">تاریخ چک</TableHead>
              <TableHead className="text-right">مبلغ</TableHead>
              <TableHead className="text-right">بانک صادرکننده</TableHead>
              <TableHead className="text-right">بانک مقصد</TableHead>
              <TableHead className="text-right w-[200px] min-w-[200px]">
                وضعیت
              </TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checksData.length > 0 ? (
              checksData.map((check) => (
                <CheckTableRow
                  key={check.id}
                  check={check}
                  onViewDetails={handleViewDetails}
                  onOpenStatusDialog={handleOpenStatusDialog}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground py-8"
                >
                  چکی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {checks && totalPages > 1 && (
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

      {/* Status Change Dialog */}
      <Dialog
        open={statusDialogOpen}
        onOpenChange={(open) => {
          setStatusDialogOpen(open);
          if (!open) {
            setActiveCheckId(null);
            setSelectedStatus("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تغییر وضعیت چک</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-muted-foreground mb-2">
              وضعیت جدید را انتخاب کنید
            </p>
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as CheckStatusEnum)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="انتخاب وضعیت" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(statusLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setStatusDialogOpen(false);
                setActiveCheckId(null);
                setSelectedStatus("");
              }}
            >
              انصراف
            </Button>
            <Button
              disabled={!selectedStatus || changeStatusMutation.isPending}
              onClick={handleConfirmStatusChange}
            >
              {changeStatusMutation.isPending ? "در حال ارسال..." : "تایید"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Check Detail Dialog */}
      <CheckDetailDialog
        open={detailDialogOpen}
        onOpenChange={(open) => {
          setDetailDialogOpen(open);
          if (!open) {
            setDetailCheckId(null);
          }
        }}
        checkId={detailCheckId}
      />
    </div>
  );
}

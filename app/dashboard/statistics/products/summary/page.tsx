"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CalendarIcon, Filter } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PeriodEnum, type QueryStats } from "@/lib/api/types";
import { useSellers } from "@/lib/hooks/api/use-employees";
import { useProductsSummary } from "@/lib/hooks/api/use-stats";
import { cn } from "@/lib/utils";

const periodLabels: Record<PeriodEnum, string> = {
  TODAY: "امروز",
  YESTERDAY: "دیروز",
  LAST_WEEK: "هفته گذشته",
  LAST_MONTH: "ماه گذشته",
  ALL: "همه",
};

const toPersianDigits = (value: number | string | undefined | null): string => {
  if (value === undefined || value === null) {
    return "-";
  }
  const str = typeof value === "number" ? value.toString() : value;
  if (!str) {
    return "-";
  }
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0";
  }
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

export default function ProductsSummaryPage() {
  const [filters, setFilters] = React.useState<QueryStats>({
    period: PeriodEnum.LAST_MONTH,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodEnum>(
    PeriodEnum.LAST_MONTH
  );
  const [selectedSellerId, setSelectedSellerId] = React.useState<
    string | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = React.useState(1);

  const { data: sellers } = useSellers();
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useProductsSummary(filters);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری خلاصه محصولات", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleApplyFilters = () => {
    const newFilters: QueryStats = {
      period: fromDate || toDate ? undefined : selectedPeriod,
      from: fromDate,
      to: toDate,
      seller_id: selectedSellerId,
    };
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
    refetch();
  };

  const handleClearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedPeriod(PeriodEnum.LAST_MONTH);
    setSelectedSellerId(undefined);
    const newFilters: QueryStats = {
      period: PeriodEnum.LAST_MONTH,
    };
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
    refetch();
  };

  if (isLoading && !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">داده‌ای یافت نشد</p>
        <Button onClick={() => refetch()}>تلاش مجدد</Button>
      </div>
    );
  }

  const totalPages = stats.total_pages || 1;
  const displayedProducts = stats.products || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">خلاصه محصولات</h2>
          <p className="text-sm text-muted-foreground">
            گزارش جامع محصولات شامل ورود، خروج، تولید و موجودی
          </p>
        </div>
        <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
          <Filter className="size-4 ml-2" />
          فیلتر
        </Button>
      </div>

      {/* Summary Info */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">کل محصولات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(formatPrice(stats.total_products))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">از تاریخ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{formatDate(stats.from)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">تا تاریخ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">{formatDate(stats.to)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">صفحه</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {toPersianDigits(stats.current_page.toString())} از{" "}
              {toPersianDigits(stats.total_pages.toString())}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش کامل خلاصه محصولات</CardTitle>
          <CardDescription>
            لیست کامل محصولات با جزئیات ورود، خروج، تولید و موجودی
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کد محصول</TableHead>
                  <TableHead className="text-right">نام محصول</TableHead>
                  <TableHead className="text-right">انبار</TableHead>
                  <TableHead className="text-right">تعداد ورود</TableHead>
                  <TableHead className="text-right">وزن ورود</TableHead>
                  <TableHead className="text-right">مبلغ ورود</TableHead>
                  <TableHead className="text-right">تعداد خروج</TableHead>
                  <TableHead className="text-right">وزن خروج</TableHead>
                  <TableHead className="text-right">مبلغ خروج</TableHead>
                  <TableHead className="text-right">موجودی انبار</TableHead>
                  <TableHead className="text-right">
                    موجودی محاسبه شده
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((item) => (
                    <TableRow key={`${item.product_id}-${item.warehouse_id}`}>
                      <TableCell className="font-medium">
                        {toPersianDigits(item.product.code.toString())}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product.title}
                      </TableCell>
                      <TableCell>{item.warehouse_id}</TableCell>
                      <TableCell>
                        {toPersianDigits(item.receiving_count.toString())}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.receiving_weight))}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.receiving_amount))}{" "}
                        ریال
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.dispatching_count.toString())}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.dispatching_weight))}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.dispatching_amount))}{" "}
                        ریال
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.warehouse_inventory))}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          formatPrice(item.calculated_remaining)
                        )}{" "}
                        کیلوگرم
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center text-muted-foreground py-8"
                    >
                      داده‌ای برای نمایش وجود ندارد
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>فیلتر خلاصه محصولات</DialogTitle>
            <DialogDescription>
              فیلترهای مورد نظر را انتخاب کنید
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">دوره زمانی</label>
              <Select
                value={selectedPeriod}
                onValueChange={(value) =>
                  setSelectedPeriod(value as PeriodEnum)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دوره" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(periodLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">از تاریخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !fromDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 size-4" />
                      {fromDate ? (
                        formatDate(fromDate)
                      ) : (
                        <span>انتخاب تاریخ</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fromDate}
                      onSelect={setFromDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">تا تاریخ</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-right font-normal",
                        !toDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="ml-2 size-4" />
                      {toDate ? formatDate(toDate) : <span>انتخاب تاریخ</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={toDate}
                      onSelect={setToDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">فروشنده</label>
              <Select
                value={selectedSellerId || "all"}
                onValueChange={(value) =>
                  setSelectedSellerId(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب فروشنده" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {sellers?.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.profile.first_name} {seller.profile.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClearFilters}>
              پاک کردن فیلترها
            </Button>
            <Button onClick={handleApplyFilters}>اعمال فیلتر</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

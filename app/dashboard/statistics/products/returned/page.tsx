"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CalendarIcon, Filter, Package, RotateCcw } from "lucide-react";
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
import { useReturnedProducts } from "@/lib/hooks/api/use-stats";
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

const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return "0%";
  }
  return `${value.toFixed(1)}%`;
};

export default function ReturnedProductsPage() {
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

  const { data: sellers } = useSellers();
  const {
    data: stats,
    isLoading,
    error,
    refetch,
  } = useReturnedProducts(filters);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری آمار محصولات مرجوعی", {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            آمار محصولات مرجوعی
          </h2>
          <p className="text-sm text-muted-foreground">
            گزارش کامل محصولات مرجوعی شده
          </p>
        </div>
        <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
          <Filter className="size-4 ml-2" />
          فیلتر
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              محصولات منحصر به فرد
            </CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_unique_products)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تعداد مرجوعی‌ها
            </CardTitle>
            <RotateCcw className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_return_incidents)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل وزن مرجوعی</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_returned_weight)
              )}{" "}
              کیلوگرم
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              کل مبلغ مرجوعی
            </CardTitle>
            <RotateCcw className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {toPersianDigits(
                formatPrice(stats.summary.total_returned_amount)
              )}{" "}
              ریال
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              میانگین درصد مرجوعی
            </CardTitle>
            <RotateCcw className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(stats.summary.average_return_percentage)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Products */}
      {stats.summary.top_5_products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>۵ محصول برتر مرجوعی</CardTitle>
            <CardDescription>
              محصولاتی که بیشترین مرجوعی را داشته‌اند
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.summary.top_5_products.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 text-destructive font-semibold">
                      {toPersianDigits((index + 1).toString())}
                    </div>
                    <div>
                      <p className="font-medium">{product.product_title}</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">
                      {toPersianDigits(formatPrice(product.returned_weight))}{" "}
                      کیلوگرم
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش کامل محصولات مرجوعی</CardTitle>
          <CardDescription>
            لیست کامل محصولات مرجوعی (
            {toPersianDigits(stats.report.length.toString())} محصول)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کد محصول</TableHead>
                  <TableHead className="text-right">نام محصول</TableHead>
                  <TableHead className="text-right">دسته‌بندی</TableHead>
                  <TableHead className="text-right">تعداد مرجوعی</TableHead>
                  <TableHead className="text-right">وزن مرجوعی</TableHead>
                  <TableHead className="text-right">وزن سفارش</TableHead>
                  <TableHead className="text-right">وزن تحویل</TableHead>
                  <TableHead className="text-right">مبلغ مرجوعی</TableHead>
                  <TableHead className="text-right">درصد مرجوعی</TableHead>
                  <TableHead className="text-right">
                    سفارشات تاثیرپذیر
                  </TableHead>
                  <TableHead className="text-right">
                    مشتریان تاثیرپذیر
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.report.length > 0 ? (
                  stats.report.map((product) => (
                    <TableRow key={product.product_id}>
                      <TableCell className="font-medium">
                        {toPersianDigits(product.product_code.toString())}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.product_title}
                      </TableCell>
                      <TableCell>{product.categories || "-"}</TableCell>
                      <TableCell>
                        {toPersianDigits(product.total_return_count.toString())}
                      </TableCell>
                      <TableCell className="text-destructive">
                        {toPersianDigits(
                          formatPrice(product.total_returned_weight)
                        )}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          formatPrice(product.total_ordered_weight)
                        )}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          formatPrice(product.total_fulfilled_weight)
                        )}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell className="text-destructive font-semibold">
                        {toPersianDigits(
                          formatPrice(product.total_returned_amount)
                        )}{" "}
                        ریال
                      </TableCell>
                      <TableCell>
                        {formatPercentage(product.return_percentage)}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          product.affected_orders_count.toString()
                        )}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          product.affected_customers_count.toString()
                        )}
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

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>فیلتر آمار محصولات مرجوعی</DialogTitle>
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

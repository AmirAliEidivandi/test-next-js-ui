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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { useCategorySales } from "@/lib/hooks/api/use-stats";
import { cn } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

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

export default function CategorySalesPage() {
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
  const { data: stats, isLoading, error, refetch } = useCategorySales(filters);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری آمار فروش دسته‌بندی‌ها", {
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

  const chartData =
    stats?.data.map((item) => ({
      name: item.title,
      amount: item.total_sales_amount,
      weight: item.total_sales_weight,
    })) || [];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            آمار فروش دسته‌بندی‌ها
          </h2>
          <p className="text-sm text-muted-foreground">
            گزارش فروش بر اساس دسته‌بندی محصولات
          </p>
        </div>
        <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
          <Filter className="size-4 ml-2" />
          فیلتر
        </Button>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نمودار فروش دسته‌بندی‌ها</CardTitle>
            <CardDescription>مقایسه فروش دسته‌بندی‌های مختلف</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                amount: {
                  label: "مبلغ (ریال)",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش کامل فروش دسته‌بندی‌ها</CardTitle>
          <CardDescription>
            لیست کامل دسته‌بندی‌ها با جزئیات فروش
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">دسته‌بندی</TableHead>
                  <TableHead className="text-right">کل وزن فروش</TableHead>
                  <TableHead className="text-right">کل مبلغ فروش</TableHead>
                  <TableHead className="text-right">تعداد محصولات</TableHead>
                  <TableHead className="text-right">محصولات با فروش</TableHead>
                  <TableHead className="text-right">میانگین وزن</TableHead>
                  <TableHead className="text-right">میانگین مبلغ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.data.length > 0 ? (
                  stats.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.title}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.total_sales_weight))}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell className="font-semibold">
                        {toPersianDigits(formatPrice(item.total_sales_amount))}{" "}
                        ریال
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.products_count.toString())}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.products_with_sales.toString())}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          formatPrice(item.average_sales_weight)
                        )}{" "}
                        کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          formatPrice(item.average_sales_amount)
                        )}{" "}
                        ریال
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
            <DialogTitle>فیلتر آمار فروش دسته‌بندی‌ها</DialogTitle>
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

function formatDate(date?: Date | string) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
}

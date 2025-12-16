"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CalendarIcon, Filter } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import { useCustomers } from "@/lib/hooks/api/use-customers";
import { useSellers } from "@/lib/hooks/api/use-employees";
import { usePaymentStatus } from "@/lib/hooks/api/use-stats";
import { cn } from "@/lib/utils";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

export default function PaymentStatusPage() {
  const [filters, setFilters] = React.useState<QueryStats>({
    period: PeriodEnum.LAST_MONTH,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodEnum>(
    PeriodEnum.LAST_MONTH
  );
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedSellerId, setSelectedSellerId] = React.useState<
    string | undefined
  >(undefined);

  const { data: customers } = useCustomers({ "page-size": 200 });
  const { data: sellers } = useSellers();
  const { data: stats, isLoading, error, refetch } = usePaymentStatus(filters);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری آمار وضعیت پرداخت‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleApplyFilters = () => {
    const newFilters: QueryStats = {
      period: fromDate || toDate ? undefined : selectedPeriod,
      from: fromDate,
      to: toDate,
      customer_id: selectedCustomerId,
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
    setSelectedCustomerId(undefined);
    setSelectedSellerId(undefined);
    const newFilters: QueryStats = {
      period: PeriodEnum.LAST_MONTH,
    };
    setFilters(newFilters);
    setFilterDialogOpen(false);
    refetch();
  };

  const chartData =
    stats?.data.map((item, index) => ({
      name: item.title,
      value: item.count,
      fill: COLORS[index % COLORS.length],
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
            آمار وضعیت پرداخت‌ها
          </h2>
          <p className="text-sm text-muted-foreground">گزارش وضعیت پرداخت‌ها</p>
        </div>
        <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
          <Filter className="size-4 ml-2" />
          فیلتر
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>کل پرداخت‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {toPersianDigits(formatPrice(stats.count))}
          </div>
        </CardContent>
      </Card>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>نمودار وضعیت پرداخت‌ها</CardTitle>
            <CardDescription>توزیع پرداخت‌ها بر اساس وضعیت</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: {
                  label: "تعداد",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent ?? 0 * 100).toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش کامل وضعیت پرداخت‌ها</CardTitle>
          <CardDescription>لیست کامل وضعیت‌های پرداخت</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تعداد</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.data.length > 0 ? (
                  stats.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <Badge
                          variant={
                            item.title.includes("پرداخت شده")
                              ? "default"
                              : item.title.includes("پرداخت نشده")
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {item.title}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.count.toString())}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={2}
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
            <DialogTitle>فیلتر آمار وضعیت پرداخت‌ها</DialogTitle>
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
              <label className="text-sm font-medium">مشتری</label>
              <Select
                value={selectedCustomerId || "all"}
                onValueChange={(value) =>
                  setSelectedCustomerId(value === "all" ? undefined : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مشتری" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {customers?.data.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.title} (
                      {toPersianDigits(customer.code.toString())})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

function formatPrice(price: number | undefined | null): string {
  if (price === undefined || price === null || isNaN(price)) {
    return "0";
  }
  return price.toLocaleString("fa-IR", { useGrouping: true });
}

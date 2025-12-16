"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  BarChart3,
  CalendarIcon,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Filter,
  Package,
  Phone,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCustomers } from "@/lib/hooks/api/use-customers";
import { useSellers } from "@/lib/hooks/api/use-employees";
import { useCustomerStats } from "@/lib/hooks/api/use-stats";
import type { PeriodEnum, QueryStats } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

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

export default function CustomerStatisticsPage() {
  const [filters, setFilters] = React.useState<QueryStats>({
    period: "LAST_MONTH",
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<PeriodEnum>("LAST_MONTH");
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<
    string | undefined
  >(undefined);
  const [selectedSellerId, setSelectedSellerId] = React.useState<
    string | undefined
  >(undefined);

  // Load filter data
  const { data: customers } = useCustomers({ "page-size": 200 });
  const { data: sellers } = useSellers();

  // Load stats
  const { data: stats, isLoading, error, refetch } = useCustomerStats(filters);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری آمار مشتریان", {
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
    setSelectedPeriod("LAST_MONTH");
    setSelectedCustomerId(undefined);
    setSelectedSellerId(undefined);
    const newFilters: QueryStats = {
      period: "LAST_MONTH",
    };
    setFilters(newFilters);
    setFilterDialogOpen(false);
    refetch();
  };

  // Prepare chart data
  const registrationChartData = stats?.summary.registration_breakdown
    ? [
        {
          name: "با خرید",
          value: stats.summary.registration_breakdown.with_purchases,
          fill: "#22c55e",
        },
        {
          name: "بدون خرید",
          value: stats.summary.registration_breakdown.without_purchases,
          fill: "#ef4444",
        },
      ]
    : [];

  const mobileVerificationData = stats?.summary.mobile_verification
    ? [
        {
          name: "تایید شده",
          value: stats.summary.mobile_verification.verified,
          fill: "#22c55e",
        },
        {
          name: "تایید نشده",
          value: stats.summary.mobile_verification.not_verified,
          fill: "#ef4444",
        },
      ]
    : [];

  const orderStatusData = stats?.summary.order_statistics
    ? [
        {
          name: "موفق",
          value: stats.summary.order_statistics.successful_orders,
          fill: "#22c55e",
        },
        {
          name: "ناموفق",
          value: stats.summary.order_statistics.failed_orders,
          fill: "#ef4444",
        },
      ]
    : [];

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
          {Array.from({ length: 8 }).map((_, i) => (
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            آمار مشتریان آنلاین
          </h2>
          <p className="text-sm text-muted-foreground">
            گزارش جامع و دقیق از مشتریان آنلاین
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setFilterDialogOpen(true)}
        >
          <Filter className="size-4 ml-2" />
          فیلتر
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              کل مشتریان شعبه
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_customers_in_branch)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              مشتریان آنلاین
            </CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_online_customers)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {toPersianDigits(
                formatPrice(stats.summary.online_customers_in_period)
              )}{" "}
              در این دوره
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              مشتریان آفلاین
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_offline_customers)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              کل مبلغ خرید
            </CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.financial_summary.total_purchase_amount)
              )}{" "}
              ریال
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              میانگین:{" "}
              {toPersianDigits(
                formatPrice(stats.summary.financial_summary.avg_customer_value)
              )}{" "}
              ریال
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل بدهی</CardTitle>
            <CreditCard className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {toPersianDigits(
                formatPrice(stats.summary.financial_summary.total_debt)
              )}{" "}
              ریال
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل سفارشات</CardTitle>
            <ShoppingCart className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.order_statistics.total_orders)
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              نرخ تبدیل:{" "}
              {formatPercentage(
                stats.summary.order_statistics.avg_conversion_rate
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              سفارشات موفق
            </CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {toPersianDigits(
                formatPrice(stats.summary.order_statistics.successful_orders)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              سفارشات ناموفق
            </CardTitle>
            <XCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {toPersianDigits(
                formatPrice(stats.summary.order_statistics.failed_orders)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registration Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>وضعیت ثبت‌نام</CardTitle>
            <CardDescription>تقسیم‌بندی مشتریان ثبت‌نام شده</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">کل ثبت‌نام شده</span>
                <span className="font-semibold">
                  {toPersianDigits(
                    formatPrice(
                      stats.summary.registration_breakdown.total_registered
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">با خرید</span>
                <span className="font-semibold text-green-600">
                  {toPersianDigits(
                    formatPrice(
                      stats.summary.registration_breakdown.with_purchases
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">بدون خرید</span>
                <span className="font-semibold text-red-600">
                  {toPersianDigits(
                    formatPrice(
                      stats.summary.registration_breakdown.without_purchases
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">فعال</span>
                <span className="font-semibold text-blue-600">
                  {toPersianDigits(
                    formatPrice(
                      stats.summary.registration_breakdown.active_customers
                    )
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">غیرفعال</span>
                <span className="font-semibold text-gray-600">
                  {toPersianDigits(
                    formatPrice(
                      stats.summary.registration_breakdown.inactive_customers
                    )
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>نمودار ثبت‌نام</CardTitle>
            <CardDescription>مشتریان با خرید و بدون خرید</CardDescription>
          </CardHeader>
          <CardContent>
            {registrationChartData.length > 0 ? (
              <ChartContainer
                config={{
                  value: {
                    label: "تعداد",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={registrationChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {registrationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تایید موبایل</CardTitle>
            <CardDescription>وضعیت تایید شماره موبایل</CardDescription>
          </CardHeader>
          <CardContent>
            {mobileVerificationData.length > 0 ? (
              <ChartContainer
                config={{
                  value: {
                    label: "تعداد",
                  },
                }}
                className="h-[200px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mobileVerificationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mobileVerificationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Customers and Debtors */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>۵ مشتری برتر</CardTitle>
            <CardDescription>مشتریان با بیشترین خرید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.summary.top_5_customers.length > 0 ? (
                stats.summary.top_5_customers.map((customer, index) => (
                  <div
                    key={customer.customer_code}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {toPersianDigits((index + 1).toString())}
                      </div>
                      <div>
                        <p className="font-medium">{customer.customer_title}</p>
                        <p className="text-sm text-muted-foreground">
                          کد: {toPersianDigits(customer.customer_code.toString())}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">
                        {toPersianDigits(
                          formatPrice(customer.total_purchase_amount)
                        )}{" "}
                        ریال
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {toPersianDigits(
                          customer.successful_orders.toString()
                        )}{" "}
                        سفارش موفق
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  داده‌ای یافت نشد
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>۵ بدهکار برتر</CardTitle>
            <CardDescription>مشتریان با بیشترین بدهی</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.summary.top_5_debtors.length > 0 ? (
                stats.summary.top_5_debtors.map((debtor, index) => (
                  <div
                    key={debtor.customer_code}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-destructive/10 text-destructive font-semibold">
                        {toPersianDigits((index + 1).toString())}
                      </div>
                      <div>
                        <p className="font-medium">{debtor.customer_title}</p>
                        <p className="text-sm text-muted-foreground">
                          {debtor.mobile}
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-destructive">
                        {toPersianDigits(formatPrice(debtor.debt))} ریال
                      </p>
                      <p className="text-xs text-muted-foreground">
                        کد: {toPersianDigits(debtor.customer_code.toString())}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  داده‌ای یافت نشد
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Report Table */}
      <Card>
        <CardHeader>
          <CardTitle>گزارش کامل مشتریان</CardTitle>
          <CardDescription>
            لیست کامل مشتریان با جزئیات ({toPersianDigits(stats.report.length.toString())} مشتری)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کد مشتری</TableHead>
                  <TableHead className="text-right">نام مشتری</TableHead>
                  <TableHead className="text-right">نوع</TableHead>
                  <TableHead className="text-right">دسته‌بندی</TableHead>
                  <TableHead className="text-right">موبایل</TableHead>
                  <TableHead className="text-right">تایید موبایل</TableHead>
                  <TableHead className="text-right">تاریخ ثبت</TableHead>
                  <TableHead className="text-right">کل سفارشات</TableHead>
                  <TableHead className="text-right">سفارشات موفق</TableHead>
                  <TableHead className="text-right">نرخ تبدیل</TableHead>
                  <TableHead className="text-right">مبلغ کل خرید</TableHead>
                  <TableHead className="text-right">بدهی</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.report.length > 0 ? (
                  stats.report.map((customer) => (
                    <TableRow key={customer.customer_id}>
                      <TableCell className="font-medium">
                        {toPersianDigits(customer.customer_code.toString())}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.customer_title}
                      </TableCell>
                      <TableCell>{customer.customer_type}</TableCell>
                      <TableCell>{customer.customer_category}</TableCell>
                      <TableCell>{customer.mobile}</TableCell>
                      <TableCell>
                        {customer.mobile_verified ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle2 className="size-3 ml-1" />
                            تایید شده
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="size-3 ml-1" />
                            تایید نشده
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(customer.registration_date)}</TableCell>
                      <TableCell>
                        {toPersianDigits(customer.total_orders.toString())}
                      </TableCell>
                      <TableCell className="text-green-600">
                        {toPersianDigits(customer.successful_orders.toString())}
                      </TableCell>
                      <TableCell>
                        {formatPercentage(customer.conversion_rate)}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          formatPrice(customer.total_purchase_amount)
                        )}{" "}
                        ریال
                      </TableCell>
                      <TableCell className={customer.debt > 0 ? "text-destructive" : ""}>
                        {toPersianDigits(formatPrice(customer.debt))} ریال
                      </TableCell>
                      <TableCell>
                        {customer.is_active ? (
                          <Badge variant="default" className="bg-green-500">
                            فعال
                          </Badge>
                        ) : (
                          <Badge variant="secondary">غیرفعال</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={13}
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
            <DialogTitle>فیلتر آمار مشتریان</DialogTitle>
            <DialogDescription>
              فیلترهای مورد نظر را انتخاب کنید
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Period */}
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

            {/* Date Range */}
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
                      {toDate ? (
                        formatDate(toDate)
                      ) : (
                        <span>انتخاب تاریخ</span>
                      )}
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

            {/* Customer */}
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
                      {customer.title} ({toPersianDigits(customer.code.toString())})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Seller */}
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


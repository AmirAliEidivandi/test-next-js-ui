"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  CalendarIcon,
  Filter,
  Phone,
  TrendingDown,
  Users,
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
import { useSellers } from "@/lib/hooks/api/use-employees";
import { useCustomersWithoutPurchase } from "@/lib/hooks/api/use-stats";
import type { PeriodEnum, QueryStats } from "@/lib/api/types";
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

export default function CustomersWithoutPurchasePage() {
  const [filters, setFilters] = React.useState<QueryStats>({
    period: "LAST_MONTH",
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<PeriodEnum>("LAST_MONTH");
  const [selectedSellerId, setSelectedSellerId] = React.useState<
    string | undefined
  >(undefined);

  const { data: sellers } = useSellers();
  const { data: stats, isLoading, error, refetch } =
    useCustomersWithoutPurchase(filters);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری آمار مشتریان بدون خرید", {
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
    setSelectedPeriod("LAST_MONTH");
    setSelectedSellerId(undefined);
    const newFilters: QueryStats = {
      period: "LAST_MONTH",
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
          {Array.from({ length: 4 }).map((_, i) => (
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
            آمار مشتریان بدون خرید
          </h2>
          <p className="text-sm text-muted-foreground">
            گزارش مشتریانی که ثبت‌نام کرده‌اند اما هنوز خرید نکرده‌اند
          </p>
        </div>
        <Button variant="outline" onClick={() => setFilterDialogOpen(true)}>
          <Filter className="size-4 ml-2" />
          فیلتر
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              کل مشتریان بدون خرید
            </CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.total_customers_without_purchase)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              هرگز تماس گرفته نشده
            </CardTitle>
            <Phone className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(formatPrice(stats.summary.never_contacted))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              تماس گرفته شده بدون خرید
            </CardTitle>
            <XCircle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(formatPrice(stats.summary.contacted_no_purchase))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              میانگین روزهای ثبت‌نام
            </CardTitle>
            <TrendingDown className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {toPersianDigits(
                formatPrice(stats.summary.avg_days_since_registration)
              )}{" "}
              روز
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Reasons and Oldest Registered */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>۵ دلیل اصلی عدم خرید</CardTitle>
            <CardDescription>رایج‌ترین دلایل عدم خرید</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.summary.top_5_not_purchased_reasons.length > 0 ? (
                stats.summary.top_5_not_purchased_reasons.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {toPersianDigits((index + 1).toString())}
                      </div>
                      <div>
                        <p className="font-medium">{item.reason || "نامشخص"}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">
                        {toPersianDigits(item.count.toString())} مورد
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
            <CardTitle>قدیمی‌ترین ثبت‌نام‌ها</CardTitle>
            <CardDescription>
              مشتریانی که مدت زمان زیادی است ثبت‌نام کرده‌اند
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.summary.oldest_registered.length > 0 ? (
                stats.summary.oldest_registered.map((customer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-semibold">
                        {toPersianDigits((index + 1).toString())}
                      </div>
                      <div>
                        <p className="font-medium">{customer.customer_title}</p>
                        <p className="text-sm text-muted-foreground">
                          {toPersianDigits(
                            customer.days_since_registration.toString()
                          )}{" "}
                          روز از ثبت‌نام
                        </p>
                      </div>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">
                        {toPersianDigits(customer.total_contacts.toString())}{" "}
                        تماس
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
          <CardTitle>گزارش کامل مشتریان بدون خرید</CardTitle>
          <CardDescription>
            لیست کامل مشتریان بدون خرید (
            {toPersianDigits(stats.report.length.toString())} مشتری)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">کد مشتری</TableHead>
                  <TableHead className="text-right">نام مشتری</TableHead>
                  <TableHead className="text-right">دسته‌بندی</TableHead>
                  <TableHead className="text-right">نوع</TableHead>
                  <TableHead className="text-right">تلفن</TableHead>
                  <TableHead className="text-right">فروشنده</TableHead>
                  <TableHead className="text-right">تاریخ ثبت</TableHead>
                  <TableHead className="text-right">روزهای ثبت‌نام</TableHead>
                  <TableHead className="text-right">تعداد تماس</TableHead>
                  <TableHead className="text-right">سفارشات ناموفق</TableHead>
                  <TableHead className="text-right">آخرین تماس</TableHead>
                  <TableHead className="text-right">دلیل اصلی</TableHead>
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
                      <TableCell>{customer.customer_category || "-"}</TableCell>
                      <TableCell>{customer.customer_type || "-"}</TableCell>
                      <TableCell>{customer.customer_phone || "-"}</TableCell>
                      <TableCell>{customer.seller_name || "-"}</TableCell>
                      <TableCell>
                        {formatDate(customer.registered_date)}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(
                          customer.days_since_registration.toString()
                        )}{" "}
                        روز
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(customer.total_contacts.toString())}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(customer.failed_orders.toString())}
                      </TableCell>
                      <TableCell>
                        {formatDate(customer.last_contact_date)}
                      </TableCell>
                      <TableCell>
                        {customer.most_common_not_purchased_reason || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.status}</Badge>
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
            <DialogTitle>فیلتر آمار مشتریان بدون خرید</DialogTitle>
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
                      {fromDate ? formatDate(fromDate) : <span>انتخاب تاریخ</span>}
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


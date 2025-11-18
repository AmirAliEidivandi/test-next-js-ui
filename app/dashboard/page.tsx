"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { BarChart3, CalendarIcon, Filter, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
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
import { employeesApi } from "@/lib/api/employees";
import { profileApi } from "@/lib/api/profile";
import { statsApi } from "@/lib/api/stats";
import type {
  GetHeadCategorySalesResponse,
  GetProductsSalesResponse,
  GetProfileInfoResponse,
  GetSellersResponse,
  GetTopProductsSalesResponse,
  QueryStats,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

type PeriodType = "TODAY" | "YESTERDAY" | "LAST_WEEK" | "LAST_MONTH" | "ALL";

const periodLabels: Record<PeriodType, string> = {
  TODAY: "امروز",
  YESTERDAY: "دیروز",
  LAST_WEEK: "هفته گذشته",
  LAST_MONTH: "ماه گذشته",
  ALL: "همه",
};

export default function DashboardPage() {
  const [profile, setProfile] = React.useState<GetProfileInfoResponse | null>(
    null
  );
  const [sellers, setSellers] = React.useState<GetSellersResponse[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filtering, setFiltering] = React.useState(false);
  const [periodLoading, setPeriodLoading] = React.useState(false);

  // Filter states
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [selectedSeller, setSelectedSeller] = React.useState<string>("all");
  const [period, setPeriod] = React.useState<PeriodType>("LAST_MONTH");

  // Data states
  const [chartData, setChartData] =
    React.useState<GetHeadCategorySalesResponse | null>(null);
  const [topProducts, setTopProducts] =
    React.useState<GetTopProductsSalesResponse | null>(null);
  const [productsSales, setProductsSales] =
    React.useState<GetProductsSalesResponse | null>(null);

  // Load initial data
  React.useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [
        profileData,
        sellersData,
        chartDataRes,
        topProductsRes,
        productsSalesRes,
      ] = await Promise.all([
        profileApi.getProfileInfo(),
        employeesApi.getSellers(),
        statsApi.getHeadCategorySales({ period: "LAST_MONTH" }),
        statsApi.getTopProductsSales({ period: "LAST_MONTH" }),
        statsApi.getProductsSales({ period: "LAST_MONTH" }),
      ]);

      setProfile(profileData);
      setSellers(sellersData);
      setChartData(chartDataRes);
      setTopProducts(topProductsRes);
      setProductsSales(productsSalesRes);
    } catch (error) {
      toast.error("خطا در بارگذاری اطلاعات", {
        description: "لطفا دوباره تلاش کنید",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setFiltering(true);
      const query: QueryStats = {
        // اگر تاریخ انتخاب شده باشد، period را ارسال نکن
        period: fromDate || toDate ? undefined : period,
        seller_id:
          selectedSeller && selectedSeller !== "all"
            ? selectedSeller
            : undefined,
        from: fromDate,
        to: toDate,
      };

      const [chartDataRes, topProductsRes, productsSalesRes] =
        await Promise.all([
          statsApi.getHeadCategorySales(query),
          statsApi.getTopProductsSales(query),
          statsApi.getProductsSales(query),
        ]);

      setChartData(chartDataRes);
      setTopProducts(topProductsRes);
      setProductsSales(productsSalesRes);
      toast.success("فیلتر اعمال شد");
    } catch (error) {
      toast.error("خطا در اعمال فیلتر", {
        description: "لطفا دوباره تلاش کنید",
      });
    } finally {
      setFiltering(false);
    }
  };

  const handlePeriodChange = async (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    try {
      setPeriodLoading(true);
      const query: QueryStats = {
        // اگر تاریخ انتخاب شده باشد، period را ارسال نکن
        period: fromDate || toDate ? undefined : newPeriod,
        seller_id:
          selectedSeller && selectedSeller !== "all"
            ? selectedSeller
            : undefined,
        from: fromDate,
        to: toDate,
      };

      const [chartDataRes, topProductsRes, productsSalesRes] =
        await Promise.all([
          statsApi.getHeadCategorySales(query),
          statsApi.getTopProductsSales(query),
          statsApi.getProductsSales(query),
        ]);

      setChartData(chartDataRes);
      setTopProducts(topProductsRes);
      setProductsSales(productsSalesRes);
    } catch (error) {
      toast.error("خطا در بارگذاری اطلاعات");
    } finally {
      setPeriodLoading(false);
    }
  };

  const handleClearFilters = async () => {
    // پاک کردن همه فیلترها
    setFromDate(undefined);
    setToDate(undefined);
    setSelectedSeller("all");
    setPeriod("LAST_MONTH");

    try {
      setPeriodLoading(true);
      const query: QueryStats = {
        period: "LAST_MONTH",
      };

      const [chartDataRes, topProductsRes, productsSalesRes] =
        await Promise.all([
          statsApi.getHeadCategorySales(query),
          statsApi.getTopProductsSales(query),
          statsApi.getProductsSales(query),
        ]);

      setChartData(chartDataRes);
      setTopProducts(topProductsRes);
      setProductsSales(productsSalesRes);
      toast.success("فیلترها پاک شدند");
    } catch (error) {
      toast.error("خطا در بارگذاری اطلاعات", {
        description: "لطفا دوباره تلاش کنید",
      });
    } finally {
      setPeriodLoading(false);
    }
  };

  const chartConfig = {
    total_price: {
      label: "فروش (ریال)",
      color: "hsl(var(--chart-1))",
    },
  };

  const chartDataFormatted =
    chartData?.data.map((item) => ({
      name: item.title,
      value: item.total_price,
    })) || [];

  if (loading) {
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
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {profile
            ? `خوش آمدید ${profile.first_name} ${profile.last_name}`
            : "داشبورد"}
        </h2>
        <p className="text-sm text-muted-foreground">
          به پنل مدیریت خوش آمدید. از منوی سمت راست می‌توانید به بخش‌های مختلف
          دسترسی داشته باشید.
        </p>
      </div>

      {/* Filters Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">فیلترها</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-end gap-3">
            {/* From Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-right font-normal",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 size-4" />
                  {fromDate ? (
                    format(fromDate, "yyyy/MM/dd", { locale: faIR })
                  ) : (
                    <span>از تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                />
              </PopoverContent>
            </Popover>

            {/* To Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-right font-normal",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 size-4" />
                  {toDate ? (
                    format(toDate, "yyyy/MM/dd", { locale: faIR })
                  ) : (
                    <span>تا تاریخ</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                />
              </PopoverContent>
            </Popover>

            {/* Seller Select */}
            <Select
              value={selectedSeller || "all"}
              onValueChange={(value) =>
                setSelectedSeller(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="فروشنده" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه فروشندگان</SelectItem>
                {sellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    {seller.profile.first_name} {seller.profile.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button onClick={handleFilter} disabled={filtering}>
              <Filter className="ml-2 size-4" />
              {filtering ? "در حال فیلتر..." : "فیلتر"}
            </Button>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={filtering || periodLoading}
            >
              <X className="ml-2 size-4" />
              پاک کردن فیلترها
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Period Selection Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">بازه زمانی</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-1.5">
            {(Object.keys(periodLabels) as PeriodType[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => handlePeriodChange(p)}
                disabled={periodLoading}
              >
                {periodLoading && period === p
                  ? "در حال بارگذاری..."
                  : periodLabels[p]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart and Table Section - Side by Side */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Chart Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="size-4" />
              چارت فروش بر اساس دسته بندی
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {chartDataFormatted.length > 0 ? (
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartDataFormatted}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="value"
                      fill="var(--color-total_price)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">محصولات برتر</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topProducts && topProducts.data.length > 0 ? (
              <div className="rounded-md border max-h-[320px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right text-xs">
                        نام محصول
                      </TableHead>
                      <TableHead className="text-center text-xs">
                        تعداد
                      </TableHead>
                      <TableHead className="text-center text-xs">
                        وزن خالص
                      </TableHead>
                      <TableHead className="text-left text-xs">
                        قیمت کل
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.data.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-right text-sm">
                          {product.title}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {product.count.toLocaleString("fa-IR")}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {product.net_weight.toLocaleString("fa-IR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-left font-medium text-sm">
                          {product.total_price.toLocaleString("fa-IR")} ریال
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Products Sales by Category Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">آمار فروش بر اساس دسته بندی</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {productsSales && productsSales.data.length > 0 ? (
            <div className="rounded-md border max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right text-xs">نوع</TableHead>
                    <TableHead className="text-center text-xs">تعداد</TableHead>
                    <TableHead className="text-center text-xs">وزن</TableHead>
                    <TableHead className="text-left text-xs">قیمت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsSales.data.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-right text-sm">
                        {item.title}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {item.count.toLocaleString("fa-IR")}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {item.net_weight.toLocaleString("fa-IR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-left font-medium text-sm">
                        {item.total_price.toLocaleString("fa-IR")} ریال
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
              داده‌ای برای نمایش وجود ندارد
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

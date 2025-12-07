"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CalendarIcon, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
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
import { useProducts } from "@/lib/hooks/api/use-products";
import { useProductKardex } from "@/lib/hooks/api/use-stats";
import { useWarehouse } from "@/lib/hooks/api/use-warehouses";
import { ProductKardexType } from "@/lib/api/types";

const toPersianDigits = (value: string | number): string => {
  const str = typeof value === "number" ? value.toString() : value;
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
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

const formatPrice = (price: number): string => {
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

const kardexTypeLabels: Record<ProductKardexType, string> = {
  CARGO_DISPATCH: "مرسوله ارسالی",
  CARGO_RETURN: "مرجوعی",
  RECEIVING: "ورودی انبار",
  DISPATCHING: "خروجی انبار",
  ADVANCE_INVENTORY: "موجودی قبل",
  PRODUCE_INPUT: "استفاده شده در تولید",
  PRODUCE_OUTPUT: "تولید شده",
};

export default function ProductKardexPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;

  const { data: warehouse } = useWarehouse(warehouseId);
  const { data: products, isLoading: isLoadingProducts } = useProducts(
    warehouseId
  );

  const [selectedProductId, setSelectedProductId] = React.useState<
    string | null
  >(null);
  const [fromDate, setFromDate] = React.useState<Date | undefined>(undefined);
  const [toDate, setToDate] = React.useState<Date | undefined>(undefined);
  const [query, setQuery] = React.useState<{
    product_id: string;
    from?: Date;
    to?: Date;
  } | null>(null);

  const { data: kardexData, isLoading: isLoadingKardex } = useProductKardex(
    query
  );

  const handleGenerateReport = () => {
    if (!selectedProductId) {
      toast.error("لطفا محصول را انتخاب کنید");
      return;
    }

    setQuery({
      product_id: selectedProductId,
      from: fromDate,
      to: toDate,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            گردش موجودی کالا
          </h2>
          <p className="text-sm text-muted-foreground">
            {warehouse?.name && `انبار: ${warehouse.name}`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/warehouses/${warehouseId}`)}
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>فیلترها</CardTitle>
          <CardDescription>انتخاب محصول و بازه زمانی</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {/* Product Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium">انتخاب محصول</label>
              <Select
                value={selectedProductId || ""}
                onValueChange={setSelectedProductId}
                disabled={isLoadingProducts}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب محصول" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">از تاریخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right font-normal"
                  >
                    <CalendarIcon className="ml-2 size-4" />
                    {fromDate ? (
                      formatDate(fromDate)
                    ) : (
                      <span className="text-muted-foreground">انتخاب تاریخ</span>
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

            {/* To Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium">تا تاریخ</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-right font-normal"
                  >
                    <CalendarIcon className="ml-2 size-4" />
                    {toDate ? (
                      formatDate(toDate)
                    ) : (
                      <span className="text-muted-foreground">انتخاب تاریخ</span>
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

            {/* Generate Report Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium opacity-0">دکمه</label>
              <Button
                onClick={handleGenerateReport}
                disabled={!selectedProductId || isLoadingKardex}
                className="w-full"
              >
                {isLoadingKardex ? "در حال بارگذاری..." : "ایجاد گزارش"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {query && (
        <Card>
          <CardHeader>
            <CardTitle>نتایج گزارش</CardTitle>
            <CardDescription>
              {kardexData?.product && (
                <>
                  محصول: {kardexData.product.title} (کد:{" "}
                  {toPersianDigits(kardexData.product.code)})
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingKardex ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : kardexData && kardexData.items.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">ردیف</TableHead>
                      <TableHead className="text-right">تاریخ</TableHead>
                      <TableHead className="text-right">کد</TableHead>
                      <TableHead className="text-right">نوع</TableHead>
                      <TableHead className="text-right">مشتری</TableHead>
                      <TableHead className="text-right">ورودی</TableHead>
                      <TableHead className="text-right">خروجی</TableHead>
                      <TableHead className="text-right">فی</TableHead>
                      <TableHead className="text-right">مبلغ</TableHead>
                      <TableHead className="text-right">مانده انبار</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kardexData.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {toPersianDigits(index + 1)}
                        </TableCell>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>{toPersianDigits(item.code)}</TableCell>
                        <TableCell>
                          {kardexTypeLabels[item.type] || item.type}
                        </TableCell>
                        <TableCell>
                          {item.customer ? (
                            <div>
                              <div className="font-medium">
                                {item.customer.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                کد: {toPersianDigits(item.customer.code)}
                              </div>
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>
                          {item.import !== null
                            ? `${toPersianDigits(item.import)} کیلوگرم`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {item.export !== null
                            ? `${toPersianDigits(item.export)} کیلوگرم`
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {toPersianDigits(formatPrice(item.fee))} ریال
                        </TableCell>
                        <TableCell>
                          {toPersianDigits(formatPrice(item.amount))} ریال
                        </TableCell>
                        <TableCell>
                          {toPersianDigits(item.remaining)} کیلوگرم
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                داده‌ای برای نمایش وجود ندارد
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


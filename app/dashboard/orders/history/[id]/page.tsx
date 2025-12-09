"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ArrowRight,
  FileText,
  History,
  Package,
  User,
  Globe,
  Network,
  MapPin,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DeliveryMethodEnum,
  OrderChangeTypeEnum,
  OrderStepEnum,
  PaymentStatusEnum,
} from "@/lib/api/types";
import { useOrderHistory } from "@/lib/hooks/api/use-order-histories";

const toPersianDigits = (
  value: number | string | undefined | null
): string => {
  if (value === undefined || value === null) {
    return "-";
  }
  const str = typeof value === "number" ? value.toString() : value;
  if (!str) {
    return "-";
  }
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd HH:mm", {
      locale: faIR,
    })
  );
};

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) {
    return "0";
  }
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

const changeTypeLabels: Record<OrderChangeTypeEnum, string> = {
  CREATED: "ایجاد سفارش",
  STEP_CHANGED: "تغییر مرحله",
  PAYMENT_STATUS_CHANGED: "تغییر وضعیت پرداخت",
  FULFILLED_STATUS_CHANGED: "تغییر وضعیت تحویل",
  ARCHIVED_STATUS_CHANGED: "تغییر وضعیت آرشیو",
  DELIVERY_DATE_CHANGED: "تغییر تاریخ تحویل",
  DELIVERY_METHOD_CHANGED: "تغییر روش تحویل",
  SELLER_CHANGED: "تغییر فروشنده",
  VISITOR_CHANGED: "تغییر نماینده",
  WAREHOUSE_CHANGED: "تغییر انبار",
  PRODUCTS_CHANGED: "تغییر محصولات",
  CUSTOMER_CHANGED: "تغییر مشتری",
  DELETED: "حذف سفارش",
  RESTORED: "بازیابی سفارش",
};

const stepLabels: Record<OrderStepEnum, string> = {
  SELLER: "فروشنده",
  SALES_MANAGER: "مدیر فروش",
  PROCESSING: "آماده‌سازی",
  INVENTORY: "انبار",
  ACCOUNTING: "حسابداری",
  CARGO: "مرسوله",
  PARTIALLY_DELIVERED: "تحویل جزئی",
  DELIVERED: "تحویل شده",
  RETURNED: "مرجوعی کامل",
  PARTIALLY_RETURNED: "مرجوعی جزئی",
};

const paymentStatusLabels: Record<PaymentStatusEnum, string> = {
  PAID: "پرداخت شده",
  NOT_PAID: "پرداخت نشده",
  PARTIALLY_PAID: "پرداخت جزئی",
};

const deliveryMethodLabels: Record<DeliveryMethodEnum, string> = {
  FREE_OUR_TRUCK: "رایگان با ماشین شرکت",
  FREE_OTHER_SERVICES: "رایگان با سرویس خارجی",
  PAID: "ارسال با هزینه مشتری",
  AT_INVENTORY: "تحویل درب انبار",
};

// Parse IP address information
const parseIpAddress = (ipString: string) => {
  if (!ipString) return null;
  const parts = ipString.split(", ");
  return {
    ip: parts[0] || "-",
    city: parts[1] || "-",
    region: parts[2] || "-",
    timezone: parts[3] || "-",
    latitude: parts[4] || "-",
    longitude: parts[5] || "-",
    country: parts[6] || "-",
    isp: parts[7] || "-",
    network: parts[8] || "-",
    asn: parts[9] || "-",
    countryCode: parts[10] || "-",
    regionName: parts[11] || "-",
  };
};

export default function OrderHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = params.id as string;

  const { data: history, isLoading, error } = useOrderHistory(historyId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات تاریخچه", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !history) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!history) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">تاریخچه یافت نشد</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/orders/history")}
        >
          بازگشت به لیست تاریخچه
        </Button>
      </div>
    );
  }

  const ipInfo = parseIpAddress(history.ip_address);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            جزئیات تاریخچه سفارش
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل تغییرات انجام شده
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/orders/history")}
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت به لیست
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات تغییر */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-5" />
              اطلاعات تغییر
            </CardTitle>
            <CardDescription>جزئیات تغییر انجام شده</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نوع تغییر
              </p>
              <Badge variant="outline" className="text-base">
                {changeTypeLabels[history.change_type] || history.change_type}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد سفارش
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(history.order.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نوع تغییر دهنده
              </p>
              <Badge variant={history.by_system ? "secondary" : "outline"}>
                {history.by_system ? "سیستم" : "کارمند"}
              </Badge>
            </div>
            {history.employee && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  کارمند تغییر دهنده
                </p>
                <p className="text-base">
                  {history.employee.profile.first_name}{" "}
                  {history.employee.profile.last_name}
                </p>
                {history.employee.profile.email && (
                  <p className="text-xs text-muted-foreground">
                    {history.employee.profile.email}
                  </p>
                )}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ تغییر
              </p>
              <p className="text-base">{formatDate(history.created_at)}</p>
            </div>
            {history.reason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  دلیل تغییر
                </p>
                <p className="text-base whitespace-pre-wrap">
                  {history.reason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* اطلاعات IP و شبکه */}
        {ipInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5" />
                اطلاعات IP و شبکه
              </CardTitle>
              <CardDescription>اطلاعات شبکه و موقعیت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  آدرس IP
                </p>
                <p className="text-base font-mono">{ipInfo.ip}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    شهر
                  </p>
                  <p className="text-base">{ipInfo.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    استان
                  </p>
                  <p className="text-base">{ipInfo.region}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    کشور
                  </p>
                  <p className="text-base">{ipInfo.country}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    کد کشور
                  </p>
                  <p className="text-base">{ipInfo.countryCode}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    منطقه زمانی
                  </p>
                  <p className="text-base">{ipInfo.timezone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    ISP
                  </p>
                  <p className="text-base text-xs">{ipInfo.isp}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    شبکه
                  </p>
                  <p className="text-base font-mono text-xs">{ipInfo.network}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    ASN
                  </p>
                  <p className="text-base">{ipInfo.asn}</p>
                </div>
                {(ipInfo.latitude !== "-" || ipInfo.longitude !== "-") && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      موقعیت جغرافیایی
                    </p>
                    <p className="text-base">
                      {ipInfo.latitude}, {ipInfo.longitude}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* تغییرات مرحله */}
        <Card>
          <CardHeader>
            <CardTitle>تغییرات مرحله</CardTitle>
            <CardDescription>مرحله قبل و بعد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  قبل
                </p>
                <Badge variant="secondary">
                  {stepLabels[history.step_before] || history.step_before}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  بعد
                </p>
                <Badge variant="default">
                  {stepLabels[history.step_after] || history.step_after}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تغییرات وضعیت پرداخت */}
        <Card>
          <CardHeader>
            <CardTitle>تغییرات وضعیت پرداخت</CardTitle>
            <CardDescription>وضعیت پرداخت قبل و بعد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  قبل
                </p>
                <Badge
                  variant={
                    history.payment_status_before === PaymentStatusEnum.PAID
                      ? "default"
                      : "secondary"
                  }
                >
                  {paymentStatusLabels[history.payment_status_before] ||
                    history.payment_status_before}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  بعد
                </p>
                <Badge
                  variant={
                    history.payment_status_after === PaymentStatusEnum.PAID
                      ? "default"
                      : "secondary"
                  }
                >
                  {paymentStatusLabels[history.payment_status_after] ||
                    history.payment_status_after}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تغییرات روش تحویل */}
        <Card>
          <CardHeader>
            <CardTitle>تغییرات روش تحویل</CardTitle>
            <CardDescription>روش تحویل قبل و بعد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  قبل
                </p>
                <p className="text-base">
                  {deliveryMethodLabels[history.delivery_method_before] ||
                    history.delivery_method_before}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  بعد
                </p>
                <p className="text-base">
                  {deliveryMethodLabels[history.delivery_method_after] ||
                    history.delivery_method_after}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تغییرات تاریخ تحویل */}
        {(history.delivery_date_before || history.delivery_date_after) && (
          <Card>
            <CardHeader>
              <CardTitle>تغییرات تاریخ تحویل</CardTitle>
              <CardDescription>تاریخ تحویل قبل و بعد</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    قبل
                  </p>
                  <p className="text-base">
                    {formatDate(history.delivery_date_before || undefined)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    بعد
                  </p>
                  <p className="text-base">
                    {formatDate(history.delivery_date_after || undefined)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* تغییرات وضعیت تحویل */}
        <Card>
          <CardHeader>
            <CardTitle>تغییرات وضعیت تحویل</CardTitle>
            <CardDescription>وضعیت تحویل قبل و بعد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  قبل
                </p>
                <Badge variant={history.fulfilled_before ? "default" : "secondary"}>
                  {history.fulfilled_before ? "تحویل شده" : "تحویل نشده"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  بعد
                </p>
                <Badge variant={history.fulfilled_after ? "default" : "secondary"}>
                  {history.fulfilled_after ? "تحویل شده" : "تحویل نشده"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* تغییرات وضعیت آرشیو */}
        <Card>
          <CardHeader>
            <CardTitle>تغییرات وضعیت آرشیو</CardTitle>
            <CardDescription>وضعیت آرشیو قبل و بعد</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  قبل
                </p>
                <Badge variant={history.archived_before ? "default" : "secondary"}>
                  {history.archived_before ? "آرشیو شده" : "آرشیو نشده"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  بعد
                </p>
                <Badge variant={history.archived_after ? "default" : "secondary"}>
                  {history.archived_after ? "آرشیو شده" : "آرشیو نشده"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* اطلاعات سفارش */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            اطلاعات سفارش
          </CardTitle>
          <CardDescription>اطلاعات سفارش مرتبط</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد سفارش
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(history.order.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                مشتری
              </p>
              <p className="text-base">{history.order.customer.title}</p>
            </div>
            {history.order.person?.profile && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نماینده
                </p>
                <p className="text-base">
                  {history.order.person.profile.first_name}{" "}
                  {history.order.person.profile.last_name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* مقایسه سبد خرید قبل و بعد */}
      {history.old_order?.ordered_basket &&
        history.new_order?.ordered_basket && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                مقایسه سبد خرید
              </CardTitle>
              <CardDescription>
                مقایسه محصولات قبل و بعد از تغییر
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* سبد خرید قبل */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-muted-foreground">قبل:</span>
                    {history.old_order.ordered_basket.length > 0 && (
                      <Badge variant="secondary">
                        {toPersianDigits(history.old_order.ordered_basket.length)}{" "}
                        محصول
                      </Badge>
                    )}
                  </h3>
                  {history.old_order.ordered_basket.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">ردیف</TableHead>
                            <TableHead className="text-right">
                              عنوان محصول
                            </TableHead>
                            <TableHead className="text-right">کد محصول</TableHead>
                            <TableHead className="text-right">وزن</TableHead>
                            <TableHead className="text-right">
                              وزن تحویل شده
                            </TableHead>
                            <TableHead className="text-right">
                              وزن مرجوعی
                            </TableHead>
                            <TableHead className="text-right">
                              وزن لغو شده
                            </TableHead>
                            <TableHead className="text-right">قیمت</TableHead>
                            <TableHead className="text-center">وضعیت</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.old_order.ordered_basket.map((item, idx) => (
                            <TableRow key={item.id || idx}>
                              <TableCell className="font-medium">
                                {toPersianDigits(idx + 1)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.product.title}
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.product.code)}
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.weight)} کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.fulfilled_weight)}{" "}
                                کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.returned_weight)}{" "}
                                کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.cancelled_weight)}{" "}
                                کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(formatPrice(item.price))} ریال
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    item.fulfilled ? "default" : "secondary"
                                  }
                                >
                                  {item.fulfilled ? "تحویل شده" : "تحویل نشده"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      سبد خرید خالی بود
                    </p>
                  )}
                </div>

                <Separator />

                {/* سبد خرید بعد */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span className="text-muted-foreground">بعد:</span>
                    {history.new_order.ordered_basket.length > 0 && (
                      <Badge variant="default">
                        {toPersianDigits(history.new_order.ordered_basket.length)}{" "}
                        محصول
                      </Badge>
                    )}
                  </h3>
                  {history.new_order.ordered_basket.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">ردیف</TableHead>
                            <TableHead className="text-right">
                              عنوان محصول
                            </TableHead>
                            <TableHead className="text-right">کد محصول</TableHead>
                            <TableHead className="text-right">وزن</TableHead>
                            <TableHead className="text-right">
                              وزن تحویل شده
                            </TableHead>
                            <TableHead className="text-right">
                              وزن مرجوعی
                            </TableHead>
                            <TableHead className="text-right">
                              وزن لغو شده
                            </TableHead>
                            <TableHead className="text-right">قیمت</TableHead>
                            <TableHead className="text-center">وضعیت</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {history.new_order.ordered_basket.map((item, idx) => (
                            <TableRow key={item.id || idx}>
                              <TableCell className="font-medium">
                                {toPersianDigits(idx + 1)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {item.product.title}
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.product.code)}
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.weight)} کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.fulfilled_weight)}{" "}
                                کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.returned_weight)}{" "}
                                کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(item.cancelled_weight)}{" "}
                                کیلوگرم
                              </TableCell>
                              <TableCell>
                                {toPersianDigits(formatPrice(item.price))} ریال
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  variant={
                                    item.fulfilled ? "default" : "secondary"
                                  }
                                >
                                  {item.fulfilled ? "تحویل شده" : "تحویل نشده"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      سبد خرید خالی است
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* اطلاعات کامل سفارش قبل */}
      {history.old_order && (
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات کامل سفارش قبل از تغییر</CardTitle>
            <CardDescription>
              تمام اطلاعات سفارش در زمان قبل از تغییر
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  کد سفارش
                </p>
                <p className="text-base font-semibold">
                  {toPersianDigits(history.old_order.code)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  مرحله
                </p>
                <Badge variant="secondary">
                  {stepLabels[history.old_order.step] ||
                    history.old_order.step}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  وضعیت پرداخت
                </p>
                <Badge
                  variant={
                    history.old_order.payment_status === PaymentStatusEnum.PAID
                      ? "default"
                      : "secondary"
                  }
                >
                  {paymentStatusLabels[history.old_order.payment_status] ||
                    history.old_order.payment_status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ ایجاد
                </p>
                <p className="text-base">
                  {formatDate(history.old_order.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ بروزرسانی
                </p>
                <p className="text-base">
                  {formatDate(history.old_order.updated_at)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ تحویل
                </p>
                <p className="text-base">
                  {formatDate(history.old_order.delivery_date || undefined)}
                </p>
              </div>
              {history.old_order.address && (
                <div className="col-span-full">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    آدرس
                  </p>
                  <p className="text-base flex items-start gap-2">
                    <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                    <span>{history.old_order.address}</span>
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* اطلاعات کامل سفارش بعد */}
      {history.new_order && (
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات کامل سفارش بعد از تغییر</CardTitle>
            <CardDescription>
              تمام اطلاعات سفارش در زمان بعد از تغییر
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  کد سفارش
                </p>
                <p className="text-base font-semibold">
                  {toPersianDigits(history.new_order.code)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  مرحله
                </p>
                <Badge variant="default">
                  {stepLabels[history.new_order.step] ||
                    history.new_order.step}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  وضعیت پرداخت
                </p>
                <Badge
                  variant={
                    history.new_order.payment_status === PaymentStatusEnum.PAID
                      ? "default"
                      : "secondary"
                  }
                >
                  {paymentStatusLabels[history.new_order.payment_status] ||
                    history.new_order.payment_status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ ایجاد
                </p>
                <p className="text-base">
                  {formatDate(history.new_order.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ بروزرسانی
                </p>
                <p className="text-base">
                  {formatDate(history.new_order.updated_at)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ تحویل
                </p>
                <p className="text-base">
                  {formatDate(history.new_order.delivery_date || undefined)}
                </p>
              </div>
              {history.new_order.address && (
                <div className="col-span-full">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    آدرس
                  </p>
                  <p className="text-base flex items-start gap-2">
                    <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                    <span>{history.new_order.address}</span>
                  </p>
                </div>
              )}
              {history.new_order.customer && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    مشتری
                  </p>
                  <p className="text-base">{history.new_order.customer.title}</p>
                </div>
              )}
              {history.new_order.person && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    نماینده
                  </p>
                  <p className="text-base">
                    {history.new_order.person.title || "-"}
                  </p>
                </div>
              )}
              {history.new_order.seller && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    فروشنده
                  </p>
                  <p className="text-base">
                    {history.new_order.seller.kid || "-"}
                  </p>
                </div>
              )}
              {history.new_order.warehouse && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    انبار
                  </p>
                  <p className="text-base">
                    {history.new_order.warehouse.name} (کد:{" "}
                    {toPersianDigits(history.new_order.warehouse.code)})
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


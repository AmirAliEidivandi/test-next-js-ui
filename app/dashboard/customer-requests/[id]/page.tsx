"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ArrowRight,
  CreditCard,
  FileText,
  MapPin,
  Package,
  ShoppingCart,
  User,
  UserCircle,
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  CustomerRequestStatusEnum,
  DeliveryMethodEnum,
  OrderStepEnum,
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@/lib/api/types";
import { useCustomerRequest } from "@/lib/hooks/api/use-customer-requests";
import { fileUrl } from "@/lib/utils/file-url";

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

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
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

const statusLabels: Record<CustomerRequestStatusEnum, string> = {
  PENDING: "در انتظار",
  CONVERTED_TO_ORDER: "تبدیل شده به سفارش",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
  CANCELLED: "لغو شده",
  DELIVERED: "تحویل شده",
};

const paymentMethodLabels: Record<PaymentMethodEnum, string> = {
  ONLINE: "آنلاین",
  WALLET: "کیف پول",
  BANK_RECEIPT: "فیش بانکی",
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

export default function CustomerRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const { data: request, isLoading, error } = useCustomerRequest(requestId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات درخواست", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !request) {
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

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">درخواست یافت نشد</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/customer-requests")}
        >
          بازگشت به لیست درخواست‌ها
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            جزئیات درخواست: {toPersianDigits(request.code)}
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل درخواست مشتری
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/customer-requests")}
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت به لیست
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات اصلی درخواست */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              اطلاعات اصلی درخواست
            </CardTitle>
            <CardDescription>اطلاعات پایه درخواست</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد درخواست
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(request.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت
              </p>
              <Badge
                variant={
                  request.status === CustomerRequestStatusEnum.APPROVED ||
                  request.status === CustomerRequestStatusEnum.DELIVERED
                    ? "default"
                    : request.status === CustomerRequestStatusEnum.REJECTED ||
                      request.status === CustomerRequestStatusEnum.CANCELLED
                    ? "destructive"
                    : "secondary"
                }
              >
                {statusLabels[request.status] || request.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                روش پرداخت
              </p>
              <Badge variant="outline">
                {paymentMethodLabels[request.payment_method] ||
                  request.payment_method}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                مبلغ کل
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(formatPrice(request.total_price))} ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                هزینه باربری
              </p>
              <p className="text-base">
                {toPersianDigits(formatPrice(request.freight_price))} ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">{formatDate(request.created_at)}</p>
            </div>
            {request.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  توضیحات
                </p>
                <p className="text-base whitespace-pre-wrap">
                  {request.description}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آدرس
              </p>
              <p className="text-base flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{request.address}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات مشتری */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              اطلاعات مشتری
            </CardTitle>
            <CardDescription>اطلاعات مشتری مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نام مشتری
              </p>
              <p className="text-base font-medium">{request.customer.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد مشتری
              </p>
              <p className="text-base">
                {toPersianDigits(request.customer.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تلفن
              </p>
              <p className="text-base">{request.customer.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آدرس مشتری
              </p>
              <p className="text-base flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{request.customer.address}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات نماینده */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="size-5" />
              اطلاعات نماینده
            </CardTitle>
            <CardDescription>اطلاعات نماینده ثبت کننده</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {request.person && (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    نام و نام خانوادگی
                  </p>
                  <p className="text-base">
                    {request.person.profile.first_name}{" "}
                    {request.person.profile.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    موبایل
                  </p>
                  <p className="text-base">
                    {toPersianDigits(request.person.profile.mobile)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    نام کاربری
                  </p>
                  <p className="text-base">{request.person.profile.username}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* محصولات درخواستی */}
      {request.request_items && request.request_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="size-5" />
              محصولات درخواستی
            </CardTitle>
            <CardDescription>
              {toPersianDigits(request.request_items.length)} محصول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {request.request_items.map((item, index) => (
                <div
                  key={item.product_id}
                  className="border rounded-lg p-4 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          ردیف {toPersianDigits(index + 1)}:
                        </span>
                        <h4 className="text-base font-semibold">
                          {item.product_title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">کد محصول</p>
                          <p className="font-medium">
                            {toPersianDigits(item.product_code)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">وزن</p>
                          <p className="font-medium">
                            {toPersianDigits(item.weight)} کیلوگرم
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">قیمت واحد</p>
                          <p className="font-medium">
                            {toPersianDigits(formatPrice(item.online_price))}{" "}
                            ریال
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">قیمت کل</p>
                          <p className="font-medium">
                            {toPersianDigits(formatPrice(item.total_price))}{" "}
                            ریال
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {item.images && item.images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">تصاویر محصول:</p>
                      <Carousel
                        className="w-full"
                        opts={{ align: "start", loop: true }}
                      >
                        <CarouselContent className="-mr-0">
                          {item.images.map((image) => {
                            const imageUrl = fileUrl(
                              image.thumbnail_url || image.url
                            );
                            if (!imageUrl) return null;
                            return (
                              <CarouselItem
                                key={image.id}
                                className="pr-0 basis-1/3"
                              >
                                <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                                  <img
                                    src={imageUrl}
                                    alt={image.name || item.product_title}
                                    className="max-w-full max-h-full object-contain"
                                  />
                                </div>
                              </CarouselItem>
                            );
                          })}
                        </CarouselContent>
                        {item.images.length > 3 && (
                          <>
                            <CarouselPrevious className="bg-background/90 hover:bg-background shadow-lg border size-8" />
                            <CarouselNext className="bg-background/90 hover:bg-background shadow-lg border size-8" />
                          </>
                        )}
                      </Carousel>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* سفارش‌های ثبت شده */}
      {request.orders && request.orders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              سفارش‌های ثبت شده
            </CardTitle>
            <CardDescription>
              {toPersianDigits(request.orders.length)} سفارش
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {request.orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-base font-semibold">
                          سفارش: {toPersianDigits(order.code)}
                        </h4>
                        <Badge variant="outline">
                          {stepLabels[order.step] || order.step}
                        </Badge>
                        <Badge
                          variant={
                            order.payment_status === PaymentStatusEnum.PAID
                              ? "default"
                              : "secondary"
                          }
                        >
                          {paymentStatusLabels[order.payment_status] ||
                            order.payment_status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">تاریخ ایجاد</p>
                          <p className="font-medium">
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">روش تحویل</p>
                          <p className="font-medium">
                            {deliveryMethodLabels[order.delivery_method] ||
                              order.delivery_method}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">آدرس</p>
                          <p className="font-medium flex items-start gap-1">
                            <MapPin className="size-3 mt-0.5 flex-shrink-0" />
                            <span className="text-xs">{order.address}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* سبد سفارش */}
                  {order.ordered_basket && order.ordered_basket.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">
                        سبد سفارش (
                        {toPersianDigits(order.ordered_basket.length)} محصول):
                      </p>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right">ردیف</TableHead>
                              <TableHead className="text-right">
                                عنوان محصول
                              </TableHead>
                              <TableHead className="text-right">
                                کد محصول
                              </TableHead>
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
                              <TableHead className="text-center">
                                وضعیت
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {order.ordered_basket.map((basketItem, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">
                                  {toPersianDigits(idx + 1)}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {basketItem.product_title}
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(basketItem.product_code)}
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(basketItem.weight)} کیلوگرم
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(basketItem.fulfilled_weight)}{" "}
                                  کیلوگرم
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(basketItem.returned_weight)}{" "}
                                  کیلوگرم
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(basketItem.cancelled_weight)}{" "}
                                  کیلوگرم
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(
                                    formatPrice(basketItem.price)
                                  )}{" "}
                                  ریال
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge
                                    variant={
                                      basketItem.fulfilled
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {basketItem.fulfilled
                                      ? "تحویل شده"
                                      : "تحویل نشده"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  {/* فاکتورهای صادر شده */}
                  {order.invoices && order.invoices.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="size-4" />
                        <p className="text-sm font-medium">
                          فاکتورهای صادر شده (
                          {toPersianDigits(order.invoices.length)} فاکتور)
                        </p>
                      </div>
                      <div className="space-y-4">
                        {order.invoices.map((invoice) => (
                          <div
                            key={invoice.id}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">
                                  کد فاکتور
                                </p>
                                <p className="font-medium">
                                  {toPersianDigits(invoice.code)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">مبلغ</p>
                                <p className="font-medium">
                                  {toPersianDigits(formatPrice(invoice.amount))}{" "}
                                  ریال
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">تاریخ</p>
                                <p className="font-medium">
                                  {formatDate(invoice.date)}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  وضعیت پرداخت
                                </p>
                                <Badge
                                  variant={
                                    invoice.payment_status ===
                                    PaymentStatusEnum.PAID
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {paymentStatusLabels[
                                    invoice.payment_status
                                  ] || invoice.payment_status}
                                </Badge>
                              </div>
                              {invoice.description && (
                                <div className="col-span-full">
                                  <p className="text-muted-foreground">
                                    توضیحات
                                  </p>
                                  <p className="font-medium">
                                    {invoice.description}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ArrowRight,
  FileText,
  MapPin,
  Package,
  ShoppingCart,
  User,
  UserCircle,
  RotateCcw,
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
  ReturnRequestReasonEnum,
  ReturnRequestStatusEnum,
} from "@/lib/api/types";
import { useReturnRequest } from "@/lib/hooks/api/use-return-requests";

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

const statusLabels: Record<ReturnRequestStatusEnum, string> = {
  PENDING: "در انتظار",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
  RECEIVED: "دریافت شده",
};

const reasonLabels: Record<ReturnRequestReasonEnum, string> = {
  NOT_GOOD: "کیفیت نامناسب",
};

const customerRequestStatusLabels: Record<
  CustomerRequestStatusEnum,
  string
> = {
  PENDING: "در انتظار",
  CONVERTED_TO_ORDER: "تبدیل شده به سفارش",
  APPROVED: "تایید شده",
  REJECTED: "رد شده",
  CANCELLED: "لغو شده",
  DELIVERED: "تحویل شده",
  PROCESSING: "آماده سازی",
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

export default function ReturnRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const returnRequestId = params.id as string;

  const { data: returnRequest, isLoading, error } =
    useReturnRequest(returnRequestId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات درخواست مرجوعی", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !returnRequest) {
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

  if (!returnRequest) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">
          درخواست مرجوعی یافت نشد
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/return-requests")}
        >
          بازگشت به لیست درخواست‌های مرجوعی
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
            جزئیات درخواست مرجوعی
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل درخواست مرجوعی
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/return-requests")}
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت به لیست
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات اصلی درخواست مرجوعی */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="size-5" />
              اطلاعات اصلی درخواست مرجوعی
            </CardTitle>
            <CardDescription>اطلاعات پایه درخواست</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت
              </p>
              <Badge
                variant={
                  returnRequest.status === ReturnRequestStatusEnum.APPROVED ||
                  returnRequest.status === ReturnRequestStatusEnum.RECEIVED
                    ? "default"
                    : returnRequest.status === ReturnRequestStatusEnum.REJECTED
                      ? "destructive"
                      : "secondary"
                }
              >
                {statusLabels[returnRequest.status] || returnRequest.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                دلیل مرجوعی
              </p>
              <Badge variant="outline">
                {reasonLabels[returnRequest.reason] || returnRequest.reason}
              </Badge>
            </div>
            {returnRequest.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  توضیحات
                </p>
                <p className="text-base whitespace-pre-wrap">
                  {returnRequest.description}
                </p>
              </div>
            )}
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
              <p className="text-base font-medium">
                {returnRequest.customer.title}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد مشتری
              </p>
              <p className="text-base">
                {toPersianDigits(returnRequest.customer.code)}
              </p>
            </div>
            {returnRequest.representative_name && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نماینده
                </p>
                <p className="text-base font-medium">
                  {returnRequest.representative_name}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* اطلاعات نماینده */}
        {returnRequest.person && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="size-5" />
                اطلاعات نماینده
              </CardTitle>
              <CardDescription>اطلاعات نماینده ثبت‌کننده</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نام و نام خانوادگی
                </p>
                <p className="text-base">
                  {returnRequest.person.profile.first_name}{" "}
                  {returnRequest.person.profile.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  موبایل
                </p>
                <p className="text-base">
                  {toPersianDigits(returnRequest.person.profile.mobile)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نام کاربری
                </p>
                <p className="text-base">
                  {returnRequest.person.profile.username}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* اطلاعات سفارش */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="size-5" />
              اطلاعات سفارش
            </CardTitle>
            <CardDescription>اطلاعات سفارش مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد سفارش
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(returnRequest.order.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                مرحله
              </p>
              <Badge variant="outline">
                {stepLabels[returnRequest.order.step] ||
                  returnRequest.order.step}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">
                {formatDate(returnRequest.order.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آدرس
              </p>
              <p className="text-base flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{returnRequest.order.address}</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات درخواست */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              اطلاعات درخواست
            </CardTitle>
            <CardDescription>اطلاعات درخواست مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد درخواست
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(returnRequest.request.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت
              </p>
              <Badge
                variant={
                  returnRequest.request.status ===
                    CustomerRequestStatusEnum.APPROVED ||
                  returnRequest.request.status ===
                    CustomerRequestStatusEnum.DELIVERED
                    ? "default"
                    : returnRequest.request.status ===
                        CustomerRequestStatusEnum.REJECTED ||
                        returnRequest.request.status ===
                          CustomerRequestStatusEnum.CANCELLED
                      ? "destructive"
                      : "secondary"
                }
              >
                {customerRequestStatusLabels[returnRequest.request.status] ||
                  returnRequest.request.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                روش پرداخت
              </p>
              <Badge variant="outline">
                {paymentMethodLabels[returnRequest.request.payment_method] ||
                  returnRequest.request.payment_method}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">
                {formatDate(returnRequest.request.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ بروزرسانی
              </p>
              <p className="text-base">
                {formatDate(returnRequest.request.updated_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آدرس
              </p>
              <p className="text-base flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 flex-shrink-0" />
                <span>{returnRequest.request.address}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* محصولات مرجوعی */}
      {returnRequest.return_items &&
        returnRequest.return_items.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="size-5" />
                محصولات مرجوعی
              </CardTitle>
              <CardDescription>
                {toPersianDigits(returnRequest.return_items.length)} محصول
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">ردیف</TableHead>
                      <TableHead className="text-right">عنوان محصول</TableHead>
                      <TableHead className="text-right">وزن</TableHead>
                      <TableHead className="text-right">قیمت واحد</TableHead>
                      <TableHead className="text-right">قیمت کل</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {returnRequest.return_items.map((item, index) => (
                      <TableRow key={item.request_item_id || index}>
                        <TableCell className="font-medium">
                          {toPersianDigits(index + 1)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {item.product_title}
                        </TableCell>
                        <TableCell>
                          {toPersianDigits(item.weight)} کیلوگرم
                        </TableCell>
                        <TableCell>
                          {toPersianDigits(formatPrice(item.online_price))}{" "}
                          ریال
                        </TableCell>
                        <TableCell>
                          {toPersianDigits(formatPrice(item.total_price))} ریال
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
}


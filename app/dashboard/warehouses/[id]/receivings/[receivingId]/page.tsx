"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { ArrowRight, Download } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

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
import { PaymentStatusEnum, ReceivingSourceEnum } from "@/lib/api/types";
import { useReceiving } from "@/lib/hooks/api/use-receivings";
import { fileUrl } from "@/lib/utils/file-url";

const toPersianDigits = (value: number | string): string => {
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

const receivingSourceLabels: Record<ReceivingSourceEnum, string> = {
  PURCHASED: "خریداری شده",
  RETURNED: "مرجوعی",
  INVENTORY: "موجودی",
};

const FilePreview = ({
  file,
  title,
}: {
  file: { id: string; url: string; thumbnail_url?: string } | null;
  title: string;
}) => {
  if (!file) return null;

  const fullUrl = fileUrl(file.url);
  const thumbnailUrl = fileUrl(file.thumbnail_url || file.url);
  const isImage = file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  if (!fullUrl) return null;

  if (isImage && thumbnailUrl) {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group block rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
        >
          <div className="relative w-full h-48 bg-muted">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <Download className="size-6 text-white drop-shadow-lg" />
                <span className="text-white drop-shadow-lg text-sm">
                  مشاهده فایل کامل
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary hover:underline"
      >
        <Download className="size-4" />
        دانلود فایل
      </a>
    </div>
  );
};

export default function ReceivingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;
  const receivingId = params.receivingId as string;

  const { data: receiving, isLoading, error } = useReceiving(receivingId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات ورودی", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !receiving) {
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

  if (!receiving) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">ورودی یافت نشد</p>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/warehouses/${warehouseId}/receivings`)
          }
        >
          بازگشت به لیست ورودی‌ها
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
            جزئیات ورودی: {toPersianDigits(receiving.code)}
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل ورودی
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() =>
            router.push(`/dashboard/warehouses/${warehouseId}/receivings`)
          }
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات اصلی */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات اصلی</CardTitle>
            <CardDescription>اطلاعات پایه ورودی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد ورودی
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(receiving.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ تحویل
              </p>
              <p className="text-base">{formatDate(receiving.date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نوع
              </p>
              <p className="text-base">
                {receivingSourceLabels[receiving.source] || receiving.source}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                پلاک
              </p>
              <p className="text-base">{receiving.license_plate || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                راننده
              </p>
              <p className="text-base">{receiving.driver_name || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">{formatDate(receiving.created_at)}</p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات مشتری و کارمند */}
        <Card>
          <CardHeader>
            <CardTitle>مشتری و کارمند</CardTitle>
            <CardDescription>اطلاعات مشتری و کارمند مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {receiving.customer ? (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  مشتری
                </p>
                <div>
                  <p className="text-base font-medium">
                    {receiving.customer.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    کد: {toPersianDigits(receiving.customer.code)}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  مشتری
                </p>
                <p className="text-base">-</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تحویل گیرنده
              </p>
              <p className="text-base">
                {receiving.employee.profile.first_name}{" "}
                {receiving.employee.profile.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تعداد اقلام
              </p>
              <p className="text-base">
                {toPersianDigits(receiving.products_count)} قلم
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فایل‌ها و عکس‌ها */}
      {(receiving.waybill ||
        receiving.veterinary ||
        receiving.origin_scale ||
        receiving.destination_scale ||
        (receiving.other_files && receiving.other_files.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>فایل‌ها و عکس‌ها</CardTitle>
            <CardDescription>بارنامه، مجوزها و سایر فایل‌ها</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <FilePreview file={receiving.waybill} title="بارنامه" />
              <FilePreview file={receiving.veterinary} title="مجوز دامپزشکی" />
              <FilePreview
                file={receiving.origin_scale}
                title="پته باسکول مبدا"
              />
              <FilePreview
                file={receiving.destination_scale}
                title="پته باسکول مقصد"
              />
              {receiving.other_files && receiving.other_files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    سایر
                  </p>
                  <div className="grid gap-4 grid-cols-2">
                    {receiving.other_files.map((file) => (
                      <FilePreview key={file.id} file={file} title="" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* لیست محصولات */}
      {receiving.products && receiving.products.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>لیست محصولات</CardTitle>
            <CardDescription>
              {toPersianDigits(receiving.products.length)} محصول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ردیف</TableHead>
                    <TableHead className="text-right">عنوان محصول</TableHead>
                    <TableHead className="text-right">وزن خالص مبدا</TableHead>
                    <TableHead className="text-right">
                      وزن ناخالص مبدا
                    </TableHead>
                    <TableHead className="text-right">وزن خالص مقصد</TableHead>
                    <TableHead className="text-right">
                      وزن ناخالص مقصد
                    </TableHead>
                    <TableHead className="text-right">قیمت خرید</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receiving.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {toPersianDigits(index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.product_title}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.origin_net_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.origin_gross_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.net_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(product.gross_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(product.purchase_price))}{" "}
                        ریال
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* فاکتورها */}
      {receiving.invoices && receiving.invoices.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>فاکتورها</CardTitle>
            <CardDescription>
              {toPersianDigits(receiving.invoices.length)} فاکتور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">کد</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">وضعیت پرداخت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receiving.invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {toPersianDigits(invoice.code)}
                      </TableCell>
                      <TableCell>
                        {invoice.date ? formatDate(invoice.date) : "-"}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(invoice.amount))} ریال
                      </TableCell>
                      <TableCell>
                        {invoice.payment_status === PaymentStatusEnum.PAID
                          ? "پرداخت شده"
                          : invoice.payment_status ===
                            PaymentStatusEnum.NOT_PAID
                          ? "پرداخت نشده"
                          : "پرداخت جزئی"}
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

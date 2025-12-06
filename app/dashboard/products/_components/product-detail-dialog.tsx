"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useProduct } from "@/lib/hooks/api/use-products";
import { fileUrl } from "@/lib/utils/file-url";

const toPersianDigits = (value: string | number) => {
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

const settlementMethodLabels: Record<string, string> = {
  CASH: "نقدی",
  CHEQUE: "چک",
  CREDIT: "اعتباری",
};

type Props = {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProductDetailDialog({ productId, open, onOpenChange }: Props) {
  const { data: product, isLoading } = useProduct(productId);

  if (!productId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>جزئیات محصول</DialogTitle>
          <DialogDescription>مشاهده اطلاعات کامل محصول</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : product ? (
          <div className="space-y-6">
            {/* Images Carousel */}
            {product.images && product.images.length > 0 && (
              <div className="relative w-full">
                <Carousel className="w-full" opts={{ align: "start", loop: true }}>
                  <CarouselContent className="-mr-0">
                    {product.images.map((image, index) => {
                      const imageUrl = fileUrl(
                        image.thumbnail_url || image.url
                      );
                      if (!imageUrl) return null;
                      return (
                        <CarouselItem key={image.id} className="pr-0 basis-full">
                          <div className="relative w-full h-80 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                            <img
                              src={imageUrl}
                              alt={`${product.title} - تصویر ${index + 1}`}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  {product.images.length > 1 && (
                    <>
                      <CarouselPrevious 
                        className="bg-background/90 hover:bg-background shadow-lg border size-10" 
                        style={{ position: 'absolute', top: '50%', right: '16px', left: 'auto', transform: 'translateY(-50%)', zIndex: 10 }}
                      />
                      <CarouselNext 
                        className="bg-background/90 hover:bg-background shadow-lg border size-10" 
                        style={{ position: 'absolute', top: '50%', left: '16px', right: 'auto', transform: 'translateY(-50%)', zIndex: 10 }}
                      />
                    </>
                  )}
                </Carousel>
                {product.images.length > 1 && (
                  <div className="text-center mt-2 text-sm text-muted-foreground">
                    {product.images.length} تصویر
                  </div>
                )}
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">اطلاعات پایه</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      عنوان:
                    </span>
                    <span className="font-medium">{product.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">کد:</span>
                    <Badge variant="outline">
                      {toPersianDigits(product.code)}
                    </Badge>
                  </div>
                  {product.hp_code && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        کد حسابداری:
                      </span>
                      <Badge variant="outline">
                        {toPersianDigits(product.hp_code)}
                      </Badge>
                    </div>
                  )}
                  {product.hp_title && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        عنوان حسابداری:
                      </span>
                      <span className="font-medium">{product.hp_title}</span>
                    </div>
                  )}
                  {product.invoice_title && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        عنوان فاکتور:
                      </span>
                      <span className="font-medium">
                        {product.invoice_title}
                      </span>
                    </div>
                  )}
                  {product.description && (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-muted-foreground">
                        توضیحات:
                      </span>
                      <p className="text-sm whitespace-pre-wrap">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {product.categories && product.categories.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">دسته‌بندی‌ها</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <Badge key={category.id} variant="secondary">
                        {category.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Prices */}
              <div>
                <h3 className="text-lg font-semibold mb-2">قیمت‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">قیمت خرده:</span>
                    <span className="font-medium">
                      {toPersianDigits(formatPrice(product.retail_price))} ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">قیمت عمده:</span>
                    <span className="font-medium">
                      {toPersianDigits(formatPrice(product.wholesale_price))}{" "}
                      ریال
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">قیمت آنلاین:</span>
                    <span className="font-medium">
                      {toPersianDigits(formatPrice(product.online_price))} ریال
                    </span>
                  </div>
                  {product.purchase_price > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">قیمت خرید:</span>
                      <span className="font-medium">
                        {toPersianDigits(formatPrice(product.purchase_price))}{" "}
                        ریال
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Weights */}
              <div>
                <h3 className="text-lg font-semibold mb-2">وزن‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">وزن خالص:</span>
                    <span className="font-medium">
                      {toPersianDigits(product.net_weight)} کیلوگرم
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">وزن ناخالص:</span>
                    <span className="font-medium">
                      {toPersianDigits(product.gross_weight)} کیلوگرم
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold mb-2">وضعیت</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={product.is_online ? "default" : "secondary"}
                    className={
                      product.is_online ? "bg-green-500 hover:bg-green-600" : ""
                    }
                  >
                    {product.is_online ? "آنلاین" : "آفلاین"}
                  </Badge>
                  <Badge variant={product.is_special ? "default" : "outline"}>
                    {product.is_special ? "ویژه" : "عادی"}
                  </Badge>
                  {product.locked && (
                    <Badge variant="destructive">قفل شده</Badge>
                  )}
                </div>
              </div>

              {/* Settlement Methods */}
              {product.settlement_methods &&
                product.settlement_methods.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      روش‌های تسویه
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.settlement_methods.map((method) => (
                        <Badge key={method} variant="outline">
                          {settlementMethodLabels[method] || method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Dates */}
              <div>
                <h3 className="text-lg font-semibold mb-2">تاریخ‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">تاریخ ایجاد:</span>
                    <span>{formatDate(product.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      آخرین بروزرسانی:
                    </span>
                    <span>{formatDate(product.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            محصول یافت نشد
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

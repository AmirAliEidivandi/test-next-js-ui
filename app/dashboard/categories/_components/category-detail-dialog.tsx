"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Package, Snowflake, Thermometer } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategory } from "@/lib/hooks/api/use-categories";
import { fileUrl } from "@/lib/utils/file-url";

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const temperatureLabels: Record<string, string> = {
  COLD: "سرد",
  HOT: "گرم",
};

const temperatureIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  COLD: Snowflake,
  HOT: Thermometer,
};

type Props = {
  categoryId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CategoryDetailDialog({
  categoryId,
  open,
  onOpenChange,
}: Props) {
  const { data: category, isLoading } = useCategory(categoryId);

  if (!categoryId) return null;

  const TemperatureIcon =
    temperatureIcons[category?.temperature_type || ""] || Thermometer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>جزئیات دسته‌بندی</DialogTitle>
          <DialogDescription>مشاهده اطلاعات کامل دسته‌بندی</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : category ? (
          <div className="space-y-6">
            {/* Image */}
            {category.image &&
              fileUrl(category.image.thumbnail_url || category.image.url) && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
                  <img
                    src={
                      fileUrl(
                        category.image.thumbnail_url || category.image.url
                      )!
                    }
                    alt={category.title}
                    className="max-w-full max-h-full object-contain"
                  />
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
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">کد:</span>
                    <Badge variant="outline">
                      {category.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </Badge>
                  </div>
                  {category.priority > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        اولویت:
                      </span>
                      <Badge variant="secondary">{category.priority}</Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      نوع دما:
                    </span>
                    <div className="flex items-center gap-2">
                      <TemperatureIcon className="size-4" />
                      <span>
                        {temperatureLabels[category.temperature_type]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Parent Category */}
              {category.parent && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">دسته‌بندی والد</h3>
                  <div className="p-3 rounded-lg border bg-muted/50">
                    <div className="font-medium">{category.parent.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      کد:{" "}
                      {category.parent.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Children Count */}
              {category.children && category.children.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">زیردسته‌ها</h3>
                  <div className="text-sm text-muted-foreground">
                    {category.children.length} زیردسته
                  </div>
                </div>
              )}

              {/* Products Count */}
              {category._count.products > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">محصولات</h3>
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <span>
                      {category._count.products.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}{" "}
                      محصول
                    </span>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div>
                <h3 className="text-lg font-semibold mb-2">تاریخ‌ها</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">تاریخ ایجاد:</span>
                    <span>{formatDate(category.created_at)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      آخرین بروزرسانی:
                    </span>
                    <span>{formatDate(category.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            دسته‌بندی یافت نشد
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useReminder } from "@/lib/hooks/api/use-reminders";

type ReminderDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminderId: string | null;
};

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

const formatDate = (date?: Date) => {
  if (!date) return "-";
  return toPersianDigits(
    format(date, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const formatDateTime = (date?: Date) => {
  if (!date) return "-";
  return toPersianDigits(
    format(date, "yyyy/MM/dd HH:mm", {
      locale: faIR,
    })
  );
};

const stepLabels: Record<string, string> = {
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

const customerTypeLabels: Record<string, string> = {
  PERSONAL: "شخصی",
  CORPORATE: "شرکتی",
};

const categoryLabels: Record<string, string> = {
  RESTAURANT: "رستوران",
  HOTEL: "هتل",
  CHAIN_STORE: "فروشگاه زنجیره‌ای",
  GOVERNMENTAL: "دولتی",
  FAST_FOOD: "فست فود",
  CHARITY: "خیریه",
  BUTCHER: "قصابی",
  WHOLESALER: "عمده‌فروش",
  FELLOW: "همکار",
  CATERING: "پذیرایی",
  KEBAB: "کبابی",
  DISTRIBUTOR: "توزیع‌کننده",
  HOSPITAL: "بیمارستان",
  FACTORY: "کارخانه",
};

export function ReminderDetailDialog({
  open,
  onOpenChange,
  reminderId,
}: ReminderDetailDialogProps) {
  const { data: reminder, isLoading } = useReminder(reminderId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">جزئیات یادآور</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
            </div>
          </div>
        ) : reminder ? (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge
                variant={reminder.seen ? "default" : "secondary"}
                className={
                  reminder.seen
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }
              >
                {reminder.seen ? "دیده شده" : "دیده نشده"}
              </Badge>
            </div>

            <Separator />

            {/* Message */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">پیام</h3>
              <p className="text-sm">{reminder.message || "-"}</p>
            </div>

            <Separator />

            {/* Reminder Date */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                تاریخ یادآوری
              </h3>
              <p className="text-sm">{formatDate(new Date(reminder.date))}</p>
            </div>

            <Separator />

            {/* Representative */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">نماینده</h3>
              <p className="text-sm">{reminder.representative_name || "-"}</p>
            </div>

            <Separator />

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                اطلاعات مشتری
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">نام:</span>
                  <p className="text-sm font-medium">{reminder.customer.title}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">کد:</span>
                  <p className="text-sm font-medium">
                    {reminder.customer.code.toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">نوع:</span>
                  <p className="text-sm font-medium">
                    {customerTypeLabels[reminder.customer.type] ||
                      reminder.customer.type}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">دسته‌بندی:</span>
                  <p className="text-sm font-medium">
                    {categoryLabels[reminder.customer.category] ||
                      reminder.customer.category}
                  </p>
                </div>
              </div>
            </div>

            {reminder.order && (
              <>
                <Separator />
                {/* Order Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    اطلاعات سفارش
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">کد سفارش:</span>
                      <p className="text-sm font-medium">
                        {reminder.order.code.toLocaleString("fa-IR", {
                          useGrouping: false,
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">مرحله:</span>
                      <p className="text-sm font-medium">
                        {stepLabels[reminder.order.step] || reminder.order.step}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-muted-foreground">آدرس:</span>
                      <p className="text-sm font-medium">
                        {reminder.order.address || "-"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">
                        تاریخ ایجاد سفارش:
                      </span>
                      <p className="text-sm font-medium">
                        {formatDate(new Date(reminder.order.created_at))}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Created At */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                تاریخ ایجاد یادآور
              </h3>
              <p className="text-sm">{formatDateTime(new Date(reminder.created_at))}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            یادآور یافت نشد
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


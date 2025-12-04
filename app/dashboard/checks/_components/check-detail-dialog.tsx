"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { BankEnum, CheckStatusEnum } from "@/lib/api/types";
import { useCheck } from "@/lib/hooks/api/use-checks";
import { fileUrl } from "@/lib/utils/file-url";

type CheckDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkId: string | null;
};

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit, 10)]);
};

const formatDate = (date?: string) => {
  if (!date) return "-";
  return toPersianDigits(
    format(new Date(date), "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const formatDateTime = (date?: string) => {
  if (!date) return "-";
  return toPersianDigits(
    format(new Date(date), "yyyy/MM/dd HH:mm", {
      locale: faIR,
    })
  );
};

const statusLabels: Record<CheckStatusEnum, string> = {
  RECEIVED_BY_ACCOUNTING: "دریافت چک توسط حسابداری",
  DELIVERED_TO_PROCUREMENT: "تحویل به کارپرداز",
  DELIVERED_TO_BANK: "تحویل به بانک",
  CLEARED: "پاس شده",
  RETURNED: "برگشت خورده",
};

const statusBadgeVariants: Record<
  CheckStatusEnum,
  "default" | "secondary" | "destructive" | "outline"
> = {
  RECEIVED_BY_ACCOUNTING: "secondary",
  DELIVERED_TO_PROCUREMENT: "outline",
  DELIVERED_TO_BANK: "default",
  CLEARED: "default",
  RETURNED: "destructive",
};

const bankLabels: Record<BankEnum, string> = {
  SEPAH: "صادرات",
  MELLI: "ملی",
  TEJARAT: "تجارت",
  REFAH: "رفاه",
  MASKAN: "مسکن",
  KESHAVARZI: "کشاورزی",
  SANAT_VA_MADAN: "صنعت و معدن",
  POST_BANK: "پست بانک",
  MELLAT: "ملت",
  SADERAT: "صادرات",
  PARSIAN: "پارسیان",
  PASARGAD: "پاسارگاد",
  SAMAN: "سامان",
  EGHTESAD_NOVIN: "اقتصاد نوین",
  DEY: "دی",
  KARAFARIN: "کارآفرین",
  SINA: "سینا",
  SARMAYEH: "سرمایه",
  SHAHR: "شهر",
  AYANDEH: "آینده",
  ANSAR: "انصار",
  GARDESHGARI: "گردشگری",
  HEKMAT_IRANIAN: "حکمت ایرانیان",
  MEHREGAN: "مهرگان",
  RESALAT: "رسالت",
  KOSAR: "کوثر",
  MIDDLE_EAST: "خاورمیانه",
  IRAN_ZAMIN: "ایران زمین",
  MEHR_EGHTESAD: "مهر اقتصاد",
  TOSEE_TAAVON: "توسعه تعاون",
  EXPORT_DEVELOPMENT_BANK: "توسعه صادرات",
  TOSEE_CREDIT: "توسعه اعتبارات",
  MEHR_IRAN: "مهر ایران",
  NOOR: "نور",
  OTHER: "سایر",
};

export function CheckDetailDialog({
  open,
  onOpenChange,
  checkId,
}: CheckDetailDialogProps) {
  const { data: check, isLoading } = useCheck(checkId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">جزئیات چک</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-4">
              <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">
                در حال بارگذاری...
              </p>
            </div>
          </div>
        ) : check ? (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge variant={statusBadgeVariants[check.status] || "default"}>
                {statusLabels[check.status] || check.status}
              </Badge>
            </div>

            <Separator />

            {/* Check Image */}
            {check.image && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    عکس چک
                  </h3>
                  <div className="relative group">
                    <a
                      href={fileUrl(check.image.url) || undefined}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                    >
                      <div className="relative w-full bg-muted">
                        <img
                          src={
                            fileUrl(check.image.thumbnail_url) ||
                            fileUrl(check.image.url) ||
                            undefined
                          }
                          alt="عکس چک"
                          className="w-full h-auto max-h-[400px] object-contain"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                            <Download className="size-6 text-white drop-shadow-lg" />
                            <span className="text-white drop-shadow-lg text-sm">
                              مشاهده تصویر کامل
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Check Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                اطلاعات چک
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    شماره چک:
                  </span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(
                      check.check_number.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    تاریخ چک:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDate(check.check_date)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">مبلغ:</span>
                  <p className="text-sm font-medium">
                    {toPersianDigits(check.amount.toLocaleString("fa-IR"))} ریال
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    شماره حساب:
                  </span>
                  <p className="text-sm font-medium">
                    {check.account_number
                      ? toPersianDigits(check.account_number)
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bank Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                اطلاعات بانک
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    بانک صادرکننده:
                  </span>
                  <p className="text-sm font-medium">
                    {bankLabels[check.issuer_bank] || check.issuer_bank}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    بانک مقصد:
                  </span>
                  <p className="text-sm font-medium">
                    {check.destination_bank
                      ? bankLabels[check.destination_bank] ||
                        check.destination_bank
                      : "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {check.description && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    توضیحات
                  </h3>
                  <p className="text-sm">{check.description}</p>
                </div>
              </>
            )}

            {/* Customer Information */}
            {check.customer && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    اطلاعات مشتری
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-muted-foreground">
                        نام:
                      </span>
                      <p className="text-sm font-medium">
                        {check.customer.title}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">کد:</span>
                      <p className="text-sm font-medium">
                        {toPersianDigits(
                          check.customer.code.toLocaleString("fa-IR", {
                            useGrouping: false,
                          })
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Dates */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                تاریخ‌ها
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-muted-foreground">
                    تاریخ ایجاد:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDateTime(check.created_at)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    آخرین به‌روزرسانی:
                  </span>
                  <p className="text-sm font-medium">
                    {formatDateTime(check.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            چک یافت نشد
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

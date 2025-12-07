"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useTruck } from "@/lib/hooks/api/use-trucks";
import { TruckTypeEnum } from "@/lib/api/types";

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

const truckTypeLabels: Record<TruckTypeEnum, string> = {
  NISSAN: "نیسان",
  TRUCK: "کامیون",
  CAMIONET: "کامیونت",
};

type Props = {
  truckId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TruckDetailDialog({ truckId, open, onOpenChange }: Props) {
  const { data: truck, isLoading } = useTruck(truckId);

  if (!truckId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>جزئیات ماشین</DialogTitle>
          <DialogDescription>مشاهده اطلاعات کامل ماشین</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : truck ? (
          <div className="space-y-6">
            {/* اطلاعات اصلی */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  کد ماشین
                </p>
                <p className="text-base font-semibold">
                  {toPersianDigits(truck.code)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نوع ماشین
                </p>
                <p className="text-base">
                  {truckTypeLabels[truck.type as TruckTypeEnum] || truck.type}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  پلاک
                </p>
                <p className="text-base">{truck.license_plate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  ظرفیت
                </p>
                <p className="text-base">
                  {toPersianDigits(truck.capacity)} تن
                </p>
              </div>
            </div>

            {/* اطلاعات بیمه */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">اطلاعات بیمه</h3>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ انقضای بیمه بدنه
                </p>
                <p className="text-base">
                  {formatDate(truck.body_insurance_exp_date)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ انقضای بیمه ماشین
                </p>
                <p className="text-base">
                  {formatDate(truck.insurance_exp_date)}
                </p>
              </div>
            </div>

            {/* اطلاعات راننده */}
            {truck.driver && (
              <div className="space-y-4 border-t pt-4">
                <h3 className="text-lg font-semibold">اطلاعات راننده</h3>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    نام و نام خانوادگی
                  </p>
                  <p className="text-base">
                    {truck.driver.first_name} {truck.driver.last_name}
                  </p>
                </div>
              </div>
            )}

            {/* اطلاعات زمانی */}
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold">اطلاعات زمانی</h3>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  تاریخ ایجاد
                </p>
                <p className="text-base">{formatDate(truck.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  آخرین به‌روزرسانی
                </p>
                <p className="text-base">{formatDate(truck.updated_at)}</p>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}


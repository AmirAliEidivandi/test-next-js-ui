"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CalendarIcon, Filter, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import type { CheckStatusEnum, QueryCheck } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type CheckFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: QueryCheck;
  onApply: (filters: QueryCheck) => void;
  onClear: () => void;
};

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

const statusOptions: { value: CheckStatusEnum; label: string }[] = [
  {
    value: "RECEIVED_BY_ACCOUNTING",
    label: "دریافت چک توسط حسابداری",
  },
  {
    value: "DELIVERED_TO_PROCUREMENT",
    label: "تحویل به کارپرداز",
  },
  {
    value: "DELIVERED_TO_BANK",
    label: "تحویل به بانک",
  },
  {
    value: "CLEARED",
    label: "پاس شده",
  },
  {
    value: "RETURNED",
    label: "برگشت خورده",
  },
];

const renderDatePicker = (
  label: string,
  value?: Date,
  onChange?: (date?: Date) => void
) => (
  <div className="space-y-2">
    <label className="text-sm font-medium">{label}</label>
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-right font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="ml-2 size-4" />
          {value ? (
            format(value, "yyyy/MM/dd", {
              locale: faIR,
            })
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => onChange?.(date || undefined)}
        />
      </PopoverContent>
    </Popover>
  </div>
);

export function CheckFilterDialog({
  open,
  onOpenChange,
  filters,
  onApply,
  onClear,
}: CheckFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryCheck>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryCheck = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.check_date_min) {
      cleanFilters.check_date_min = localFilters.check_date_min;
    }
    if (localFilters.check_date_max) {
      cleanFilters.check_date_max = localFilters.check_date_max;
    }
    if (localFilters.amount_min !== undefined) {
      cleanFilters.amount_min = localFilters.amount_min;
    }
    if (localFilters.amount_max !== undefined) {
      cleanFilters.amount_max = localFilters.amount_max;
    }
    if (localFilters.status) {
      cleanFilters.status = localFilters.status;
    }

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="ml-2 size-4" />
          فیلتر
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>فیلتر چک‌ها</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">تعداد در هر صفحه</label>
              <Select
                value={(localFilters["page-size"] || 20).toString()}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    "page-size": parseInt(value, 10),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب تعداد" />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size.toLocaleString("fa-IR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">وضعیت</label>
              <Select
                value={localFilters.status || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    status:
                      value === "all" ? undefined : (value as CheckStatusEnum),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderDatePicker(
              "از تاریخ چک",
              localFilters.check_date_min,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  check_date_min: date,
                })
            )}

            {renderDatePicker(
              "تا تاریخ چک",
              localFilters.check_date_max,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  check_date_max: date,
                })
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">حداقل مبلغ (ریال)</label>
              <Input
                type="number"
                value={localFilters.amount_min || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    amount_min: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="حداقل مبلغ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">حداکثر مبلغ (ریال)</label>
              <Input
                type="number"
                value={localFilters.amount_max || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    amount_max: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                placeholder="حداکثر مبلغ"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button onClick={handleApply}>اعمال فیلتر</Button>
            <Button variant="outline" onClick={handleClear}>
              <X className="ml-2 size-4" />
              پاک کردن
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


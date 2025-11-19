"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { CalendarIcon, Filter } from "lucide-react";
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
import type {
  GetCustomersResponse,
  QueryCustomerRequest,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

type CustomerRequestFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: GetCustomersResponse | null;
  filters: QueryCustomerRequest;
  onApply: (filters: QueryCustomerRequest) => void;
  onClear: () => void;
};

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export function CustomerRequestFilterDialog({
  open,
  onOpenChange,
  customers,
  filters,
  onApply,
  onClear,
}: CustomerRequestFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryCustomerRequest>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryCustomerRequest = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.code !== undefined) {
      cleanFilters.code = localFilters.code;
    }
    if (localFilters.customer_id) {
      cleanFilters.customer_id = localFilters.customer_id;
    }
    if (localFilters.payment_method) {
      cleanFilters.payment_method = localFilters.payment_method;
    }
    if (localFilters.status) {
      cleanFilters.status = localFilters.status;
    }
    if (localFilters.created_at_min) {
      cleanFilters.created_at_min = localFilters.created_at_min;
    }
    if (localFilters.created_at_max) {
      cleanFilters.created_at_max = localFilters.created_at_max;
    }

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

  const customerOptions = customers?.data ?? [];

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
          <DialogTitle>فیلتر درخواست مشتریان</DialogTitle>
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
              <label className="text-sm font-medium">کد درخواست</label>
              <Input
                type="number"
                value={
                  localFilters.code !== undefined ? localFilters.code : ""
                }
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    code: e.target.value ? parseInt(e.target.value, 10) : undefined,
                  })
                }
                placeholder="کد"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">مشتری</label>
              <Select
                value={localFilters.customer_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    customer_id: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مشتری" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {customerOptions.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">روش پرداخت</label>
              <Select
                value={localFilters.payment_method || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    payment_method:
                      value === "all"
                        ? undefined
                        : (value as QueryCustomerRequest["payment_method"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="روش پرداخت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="CASH">نقدی</SelectItem>
                  <SelectItem value="ONLINE">آنلاین</SelectItem>
                  <SelectItem value="WALLET">کیف پول</SelectItem>
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
                      value === "all"
                        ? undefined
                        : (value as QueryCustomerRequest["status"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت درخواست" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="PENDING">در انتظار</SelectItem>
                  <SelectItem value="CONVERTED_TO_ORDER">
                    تبدیل شده به سفارش
                  </SelectItem>
                  <SelectItem value="APPROVED">تایید شده</SelectItem>
                  <SelectItem value="REJECTED">رد شده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {renderDatePicker(
              "از تاریخ ایجاد",
              localFilters.created_at_min,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  created_at_min: date,
                })
            )}

            {renderDatePicker(
              "تا تاریخ ایجاد",
              localFilters.created_at_max,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  created_at_max: date,
                })
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              پاک کردن
            </Button>
            <Button onClick={handleApply}>اعمال فیلتر</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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



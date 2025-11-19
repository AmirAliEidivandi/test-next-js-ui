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
  GetSellersResponse,
  QueryInvoice,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

type InvoiceFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customers: GetCustomersResponse | null | undefined;
  sellers: GetSellersResponse[] | undefined;
  filters: QueryInvoice;
  onApply: (filters: QueryInvoice) => void;
  onClear: () => void;
};

const paymentStatusOptions: {
  value: NonNullable<QueryInvoice["payment_status"]>;
  label: string;
}[] = [
  { value: "PAID", label: "پرداخت شده" },
  { value: "NOT_PAID", label: "پرداخت نشده" },
  { value: "PARTIALLY_PAID", label: "پرداخت جزئی" },
];

const invoiceTypeOptions: {
  value: NonNullable<QueryInvoice["type"]>;
  label: string;
}[] = [
  { value: "PURCHASE", label: "خرید" },
  { value: "RETURN_FROM_PURCHASE", label: "مرجوعی خرید" },
  { value: "SELL", label: "فروش" },
];

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export function InvoiceFilterDialog({
  open,
  onOpenChange,
  customers,
  sellers,
  filters,
  onApply,
  onClear,
}: InvoiceFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryInvoice>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryInvoice = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.code !== undefined) cleanFilters.code = localFilters.code;
    if (localFilters.customer_id)
      cleanFilters.customer_id = localFilters.customer_id;
    if (localFilters.seller_id) cleanFilters.seller_id = localFilters.seller_id;
    if (localFilters.from) cleanFilters.from = localFilters.from;
    if (localFilters.to) cleanFilters.to = localFilters.to;
    if (localFilters.due_date_min)
      cleanFilters.due_date_min = localFilters.due_date_min;
    if (localFilters.due_date_max)
      cleanFilters.due_date_max = localFilters.due_date_max;
    if (localFilters.amount_min !== undefined)
      cleanFilters.amount_min = localFilters.amount_min;
    if (localFilters.amount_max !== undefined)
      cleanFilters.amount_max = localFilters.amount_max;
    if (localFilters.payment_status)
      cleanFilters.payment_status = localFilters.payment_status;
    if (localFilters.type) cleanFilters.type = localFilters.type;

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

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

  const customerOptions = customers?.data ?? [];
  const sellerOptions = sellers ?? [];

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
          <DialogTitle>فیلتر فاکتورها</DialogTitle>
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
              <label className="text-sm font-medium">کد فاکتور</label>
              <Input
                type="number"
                value={localFilters.code || ""}
                onChange={(event) =>
                  setLocalFilters({
                    ...localFilters,
                    code: event.target.value
                      ? parseInt(event.target.value, 10)
                      : undefined,
                  })
                }
                placeholder="کد فاکتور"
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
              <label className="text-sm font-medium">فروشنده</label>
              <Select
                value={localFilters.seller_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    seller_id: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب فروشنده" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {sellerOptions.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.profile.first_name} {seller.profile.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderDatePicker("از تاریخ صدور", localFilters.from, (date) =>
              setLocalFilters({
                ...localFilters,
                from: date,
              })
            )}

            {renderDatePicker("تا تاریخ صدور", localFilters.to, (date) =>
              setLocalFilters({
                ...localFilters,
                to: date,
              })
            )}

            {renderDatePicker(
              "از تاریخ سررسید",
              localFilters.due_date_min,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  due_date_min: date,
                })
            )}

            {renderDatePicker(
              "تا تاریخ سررسید",
              localFilters.due_date_max,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  due_date_max: date,
                })
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">حداقل مبلغ (ریال)</label>
              <Input
                type="number"
                min={0}
                value={
                  localFilters.amount_min !== undefined
                    ? localFilters.amount_min
                    : ""
                }
                onChange={(event) =>
                  setLocalFilters({
                    ...localFilters,
                    amount_min: event.target.value
                      ? parseInt(event.target.value, 10)
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
                min={0}
                value={
                  localFilters.amount_max !== undefined
                    ? localFilters.amount_max
                    : ""
                }
                onChange={(event) =>
                  setLocalFilters({
                    ...localFilters,
                    amount_max: event.target.value
                      ? parseInt(event.target.value, 10)
                      : undefined,
                  })
                }
                placeholder="حداکثر مبلغ"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">وضعیت پرداخت</label>
              <Select
                value={localFilters.payment_status || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    payment_status:
                      value === "all"
                        ? undefined
                        : (value as QueryInvoice["payment_status"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {paymentStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">نوع فاکتور</label>
              <Select
                value={localFilters.type || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    type:
                      value === "all"
                        ? undefined
                        : (value as QueryInvoice["type"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب نوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {invoiceTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={handleClear}>
              پاک کردن فیلترها
            </Button>
            <Button onClick={handleApply}>اعمال فیلتر</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

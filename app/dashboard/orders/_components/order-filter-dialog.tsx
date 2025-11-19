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
import type {
  CapillarySalesLinesResponse,
  GetCustomersResponse,
  GetSellersResponse,
  QueryOrder,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

type OrderFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesLines: CapillarySalesLinesResponse | null;
  sellers: GetSellersResponse[] | undefined;
  customers: GetCustomersResponse | null;
  filters: QueryOrder;
  onApply: (filters: QueryOrder) => void;
  onClear: () => void;
};

const stepOptions: { value: QueryOrder["step"]; label: string }[] = [
  { value: "SELLER", label: "فروشنده" },
  { value: "SALES_MANAGER", label: "مدیر فروش" },
  { value: "PROCESSING", label: "آماده‌سازی" },
  { value: "INVENTORY", label: "انبار" },
  { value: "ACCOUNTING", label: "حسابداری" },
  { value: "CARGO", label: "مرسوله" },
  { value: "PARTIALLY_DELIVERED", label: "تحویل جزئی" },
  { value: "DELIVERED", label: "تحویل شده" },
  { value: "RETURNED", label: "مرجوعی کامل" },
  { value: "PARTIALLY_RETURNED", label: "مرجوعی جزئی" },
];

const deliveryMethodOptions: {
  value: NonNullable<QueryOrder["delivery_method"]>;
  label: string;
}[] = [
  { value: "FREE_OUR_TRUCK", label: "رایگان با ماشین شرکت" },
  { value: "FREE_OTHER_SERVICES", label: "رایگان با سرویس دیگر" },
  { value: "PAID", label: "ارسال با هزینه مشتری" },
  { value: "AT_INVENTORY", label: "تحویل درب انبار" },
];

const booleanOptions = [
  { value: "all", label: "همه" },
  { value: "true", label: "بله" },
  { value: "false", label: "خیر" },
];

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export function OrderFilterDialog({
  open,
  onOpenChange,
  salesLines,
  sellers,
  customers,
  filters,
  onApply,
  onClear,
}: OrderFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryOrder>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryOrder = {
      "page-size": localFilters["page-size"] || 20,
    };
    if (localFilters.code) cleanFilters.code = localFilters.code;
    if (localFilters.hp_invoice_code)
      cleanFilters.hp_invoice_code = localFilters.hp_invoice_code;
    if (localFilters.step) cleanFilters.step = localFilters.step;
    if (localFilters.seller_id) cleanFilters.seller_id = localFilters.seller_id;
    if (localFilters.archived !== undefined)
      cleanFilters.archived = localFilters.archived;
    if (localFilters.created_date_min)
      cleanFilters.created_date_min = localFilters.created_date_min;
    if (localFilters.created_date_max)
      cleanFilters.created_date_max = localFilters.created_date_max;
    if (localFilters.capillary_sales_line_id)
      cleanFilters.capillary_sales_line_id =
        localFilters.capillary_sales_line_id;
    if (localFilters.bought !== undefined)
      cleanFilters.bought = localFilters.bought;
    if (localFilters.answered !== undefined)
      cleanFilters.answered = localFilters.answered;
    if (localFilters.new_customer !== undefined)
      cleanFilters.new_customer = localFilters.new_customer;
    if (localFilters.delivery_method)
      cleanFilters.delivery_method = localFilters.delivery_method;
    if (localFilters.customer_id) {
      cleanFilters.customer_id = localFilters.customer_id;
    }
    if (localFilters.did_we_contact !== undefined)
      cleanFilters.did_we_contact = localFilters.did_we_contact;
    if (localFilters.delivery_date_min)
      cleanFilters.delivery_date_min = localFilters.delivery_date_min;
    if (localFilters.delivery_date_max)
      cleanFilters.delivery_date_max = localFilters.delivery_date_max;
    if (localFilters.person_id) cleanFilters.person_id = localFilters.person_id;
    if (localFilters.in_person_order !== undefined)
      cleanFilters.in_person_order = localFilters.in_person_order;

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

  const renderBooleanSelect = (
    label: string,
    value: boolean | undefined,
    onChange: (val: boolean | undefined) => void,
    disabled?: boolean
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select
        value={value === undefined ? "all" : value === true ? "true" : "false"}
        onValueChange={(val) =>
          onChange(val === "all" ? undefined : val === "true")
        }
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {booleanOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

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
  const selectedCustomer = customerOptions.find(
    (customer) => customer.id === localFilters.customer_id
  );
  const representativeOptions = selectedCustomer?.people ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="ml-2 size-4" />
          فیلتر
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>فیلتر سفارشات</DialogTitle>
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
              <label className="text-sm font-medium">کد سفارش</label>
              <Input
                type="number"
                value={localFilters.code || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    code: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                placeholder="کد سفارش"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">کد حسابداری فاکتور</label>
              <Input
                type="number"
                value={localFilters.hp_invoice_code || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    hp_invoice_code: e.target.value
                      ? parseInt(e.target.value, 10)
                      : undefined,
                  })
                }
                placeholder="کد حسابداری فاکتور"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">مرحله سفارش</label>
              <Select
                value={localFilters.step || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    step:
                      value === "all"
                        ? undefined
                        : (value as QueryOrder["step"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="مرحله سفارش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {stepOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value!}>
                      {option.label}
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
                  <SelectValue placeholder="فروشنده" />
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

            {renderBooleanSelect("آرشیو شده", localFilters.archived, (val) =>
              setLocalFilters({ ...localFilters, archived: val })
            )}

            {renderDatePicker(
              "از تاریخ ایجاد",
              localFilters.created_date_min,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  created_date_min: date,
                })
            )}

            {renderDatePicker(
              "تا تاریخ ایجاد",
              localFilters.created_date_max,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  created_date_max: date,
                })
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">خط فروش</label>
              <Select
                value={localFilters.capillary_sales_line_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    capillary_sales_line_id:
                      value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="خط فروش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {salesLines?.data.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      {line.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderBooleanSelect("خرید انجام شده", localFilters.bought, (val) =>
              setLocalFilters({ ...localFilters, bought: val })
            )}

            {renderBooleanSelect(
              "جواب تماس را داد",
              localFilters.answered,
              (val) => setLocalFilters({ ...localFilters, answered: val })
            )}

            {renderBooleanSelect(
              "مشتری جدید است",
              localFilters.new_customer,
              (val) => setLocalFilters({ ...localFilters, new_customer: val })
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">روش تحویل</label>
              <Select
                value={localFilters.delivery_method || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    delivery_method:
                      value === "all"
                        ? undefined
                        : (value as NonNullable<QueryOrder["delivery_method"]>),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="روش تحویل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {deliveryMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">مشتری</label>
              <Select
                value={localFilters.customer_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    customer_id: value === "all" ? undefined : value,
                    person_id:
                      value === "all" || value !== prev.customer_id
                        ? undefined
                        : prev.person_id,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مشتری" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {customerOptions.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.title} - کد{" "}
                      {customer.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderBooleanSelect(
              "تماس از جانب ما بود",
              localFilters.did_we_contact,
              (val) => setLocalFilters({ ...localFilters, did_we_contact: val })
            )}

            {renderDatePicker(
              "از تاریخ تحویل",
              localFilters.delivery_date_min,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  delivery_date_min: date,
                })
            )}

            {renderDatePicker(
              "تا تاریخ تحویل",
              localFilters.delivery_date_max,
              (date) =>
                setLocalFilters({
                  ...localFilters,
                  delivery_date_max: date,
                })
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">نماینده مشتری</label>
              <Select
                value={localFilters.person_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    person_id: value === "all" ? undefined : value,
                  })
                }
                disabled={
                  !localFilters.customer_id ||
                  representativeOptions.length === 0
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      localFilters.customer_id
                        ? representativeOptions.length > 0
                          ? "انتخاب نماینده"
                          : "نماینده‌ای ثبت نشده"
                        : "ابتدا مشتری را انتخاب کنید"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {representativeOptions.map((rep) => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.profile
                        ? `${rep.profile.first_name} ${rep.profile.last_name}`
                        : rep.title || rep.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderBooleanSelect(
              "سفارش حضوری است",
              localFilters.in_person_order,
              (val) =>
                setLocalFilters({
                  ...localFilters,
                  in_person_order: val,
                })
            )}
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

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
  GetSellersResponse,
  QueryCustomer,
} from "@/lib/api/types";
import { cn } from "@/lib/utils";

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

type CustomerFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  salesLines: CapillarySalesLinesResponse | null;
  sellers: GetSellersResponse[];
  filters: QueryCustomer;
  onApply: (filters: QueryCustomer) => void;
  onClear: () => void;
};

export function CustomerFilterDialog({
  open,
  onOpenChange,
  salesLines,
  sellers,
  filters,
  onApply,
  onClear,
}: CustomerFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryCustomer>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryCustomer = {
      "page-size": localFilters["page-size"] || 20,
    };
    if (localFilters.title) cleanFilters.title = localFilters.title;
    if (localFilters.code) cleanFilters.code = localFilters.code;
    if (localFilters.mobile) cleanFilters.mobile = localFilters.mobile;
    if (localFilters.phone) cleanFilters.phone = localFilters.phone;
    if (localFilters.hp_code) cleanFilters.hp_code = localFilters.hp_code;
    if (localFilters.hp_title) cleanFilters.hp_title = localFilters.hp_title;
    if (localFilters.type) cleanFilters.type = localFilters.type;
    if (localFilters.category) cleanFilters.category = localFilters.category;
    if (localFilters.seller_id) cleanFilters.seller_id = localFilters.seller_id;
    if (localFilters.capillary_sales_line_id)
      cleanFilters.capillary_sales_line_id =
        localFilters.capillary_sales_line_id;
    if (localFilters.created_at_min)
      cleanFilters.created_at_min = localFilters.created_at_min;
    if (localFilters.created_at_max)
      cleanFilters.created_at_max = localFilters.created_at_max;
    if (localFilters.deleted !== undefined)
      cleanFilters.deleted = localFilters.deleted;
    if (localFilters.locked !== undefined)
      cleanFilters.locked = localFilters.locked;
    if (localFilters.is_property_owner !== undefined)
      cleanFilters.is_property_owner = localFilters.is_property_owner;
    if (localFilters.age) cleanFilters.age = localFilters.age;
    if (localFilters.min_order_count)
      cleanFilters.min_order_count = localFilters.min_order_count;
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
          <DialogTitle>فیلتر مشتریان</DialogTitle>
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

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان</label>
              <Input
                value={localFilters.title || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, title: e.target.value })
                }
                placeholder="عنوان مشتری"
              />
            </div>

            {/* Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">کد</label>
              <Input
                value={localFilters.code || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, code: e.target.value })
                }
                placeholder="کد مشتری"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium">شماره موبایل</label>
              <Input
                value={localFilters.mobile || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, mobile: e.target.value })
                }
                placeholder="شماره موبایل"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium">تلفن ثابت</label>
              <Input
                value={localFilters.phone || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, phone: e.target.value })
                }
                placeholder="تلفن ثابت"
              />
            </div>

            {/* HP Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium">کد حسابداری</label>
              <Input
                value={localFilters.hp_code || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, hp_code: e.target.value })
                }
                placeholder="کد حسابداری"
              />
            </div>

            {/* HP Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">عنوان حسابداری</label>
              <Input
                value={localFilters.hp_title || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, hp_title: e.target.value })
                }
                placeholder="عنوان حسابداری"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">نوع</label>
              <Select
                value={localFilters.type || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    type: value === "all" ? undefined : (value as any),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="نوع مشتری" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="PERSONAL">حقیقی</SelectItem>
                  <SelectItem value="CORPORATE">حقوقی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">حوزه فعالیت</label>
              <Select
                value={localFilters.category || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    category: value === "all" ? undefined : (value as any),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="حوزه فعالیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sales Line */}
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

            {/* Seller */}
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
                  {sellers.map((seller) => (
                    <SelectItem key={seller.id} value={seller.id}>
                      {seller.profile.first_name} {seller.profile.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Created At Min */}
            <div className="space-y-2">
              <label className="text-sm font-medium">از تاریخ ایجاد</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !localFilters.created_at_min && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 size-4" />
                    {localFilters.created_at_min ? (
                      format(localFilters.created_at_min, "yyyy/MM/dd", {
                        locale: faIR,
                      })
                    ) : (
                      <span>از تاریخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.created_at_min}
                    onSelect={(date) =>
                      setLocalFilters({
                        ...localFilters,
                        created_at_min: date || undefined,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Created At Max */}
            <div className="space-y-2">
              <label className="text-sm font-medium">تا تاریخ ایجاد</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !localFilters.created_at_max && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 size-4" />
                    {localFilters.created_at_max ? (
                      format(localFilters.created_at_max, "yyyy/MM/dd", {
                        locale: faIR,
                      })
                    ) : (
                      <span>تا تاریخ</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.created_at_max}
                    onSelect={(date) =>
                      setLocalFilters({
                        ...localFilters,
                        created_at_max: date || undefined,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-sm font-medium">سن</label>
              <Input
                type="number"
                value={localFilters.age || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    age: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="سن"
              />
            </div>

            {/* Min Order Count */}
            <div className="space-y-2">
              <label className="text-sm font-medium">حداقل تعداد سفارش</label>
              <Input
                type="number"
                value={localFilters.min_order_count || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    min_order_count: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="حداقل تعداد سفارش"
              />
            </div>

            {/* Deleted */}
            <div className="space-y-2">
              <label className="text-sm font-medium">حذف شده</label>
              <Select
                value={
                  localFilters.deleted === undefined
                    ? "all"
                    : localFilters.deleted
                    ? "true"
                    : "false"
                }
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    deleted: value === "all" ? undefined : value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت حذف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="false">فعال</SelectItem>
                  <SelectItem value="true">حذف شده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Locked */}
            <div className="space-y-2">
              <label className="text-sm font-medium">قفل شده</label>
              <Select
                value={
                  localFilters.locked === undefined
                    ? "all"
                    : localFilters.locked
                    ? "true"
                    : "false"
                }
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    locked: value === "all" ? undefined : value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="وضعیت قفل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="false">باز</SelectItem>
                  <SelectItem value="true">قفل شده</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Is Property Owner */}
            <div className="space-y-2">
              <label className="text-sm font-medium">صاحب ملک</label>
              <Select
                value={
                  localFilters.is_property_owner === undefined
                    ? "all"
                    : localFilters.is_property_owner
                    ? "true"
                    : "false"
                }
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    is_property_owner:
                      value === "all" ? undefined : value === "true",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="صاحب ملک" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="false">خیر</SelectItem>
                  <SelectItem value="true">بله</SelectItem>
                </SelectContent>
              </Select>
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

const categoryLabels: Record<string, string> = {
  RESTAURANT: "رستوران",
  HOTEL: "هتل",
  CHAIN_STORE: "فروشگاه زنجیره‌ای",
  GOVERNMENTAL: "ارگان‌های دولتی",
  FAST_FOOD: "فست فود",
  CHARITY: "خیریه",
  BUTCHER: "قصابی",
  WHOLESALER: "عمده فروش",
  FELLOW: "همکار",
  CATERING: "کترینگ",
  KEBAB: "کبابی-بریانی",
  DISTRIBUTOR: "پخش کننده",
  HOSPITAL: "بیمارستان",
  FACTORY: "کارخانه",
};

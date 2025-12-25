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
import { GenderEnum, type QueryProfile } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

const booleanOptions = [
  { value: "all", label: "همه" },
  { value: "true", label: "بله" },
  { value: "false", label: "خیر" },
];

const genderOptions: { value: GenderEnum | "all"; label: string }[] = [
  { value: "all", label: "همه" },
  { value: GenderEnum.MALE, label: "مرد" },
  { value: GenderEnum.FEMALE, label: "زن" },
];

type ProfileFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: QueryProfile;
  onApply: (filters: QueryProfile) => void;
  onClear: () => void;
};

export function ProfileFilterDialog({
  open,
  onOpenChange,
  filters,
  onApply,
  onClear,
}: ProfileFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryProfile>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryProfile = {
      "page-size": localFilters["page-size"] || 20,
    };
    if (localFilters.page) cleanFilters.page = localFilters.page;
    if (localFilters.enabled !== undefined)
      cleanFilters.enabled = localFilters.enabled;
    if (localFilters.mobile) cleanFilters.mobile = localFilters.mobile;
    if (localFilters.username) cleanFilters.username = localFilters.username;
    if (localFilters.first_name)
      cleanFilters.first_name = localFilters.first_name;
    if (localFilters.last_name) cleanFilters.last_name = localFilters.last_name;
    if (localFilters.gender) cleanFilters.gender = localFilters.gender;
    if (localFilters.created_at_min)
      cleanFilters.created_at_min = localFilters.created_at_min;
    if (localFilters.created_at_max)
      cleanFilters.created_at_max = localFilters.created_at_max;
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

  const renderBooleanSelect = (
    label: string,
    value: boolean | undefined,
    onChange: (val: boolean | undefined) => void
  ) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Select
        value={value === undefined ? "all" : value === true ? "true" : "false"}
        onValueChange={(val) =>
          onChange(val === "all" ? undefined : val === "true")
        }
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

  const [createdAtMin, setCreatedAtMin] = React.useState<Date | undefined>(
    localFilters.created_at_min
      ? new Date(localFilters.created_at_min)
      : undefined
  );
  const [createdAtMax, setCreatedAtMax] = React.useState<Date | undefined>(
    localFilters.created_at_max
      ? new Date(localFilters.created_at_max)
      : undefined
  );

  React.useEffect(() => {
    setCreatedAtMin(
      localFilters.created_at_min
        ? new Date(localFilters.created_at_min)
        : undefined
    );
    setCreatedAtMax(
      localFilters.created_at_max
        ? new Date(localFilters.created_at_max)
        : undefined
    );
  }, [localFilters.created_at_min, localFilters.created_at_max]);

  const handleCreatedAtMinChange = (date?: Date) => {
    setCreatedAtMin(date);
    setLocalFilters({
      ...localFilters,
      created_at_min: date,
    });
  };

  const handleCreatedAtMaxChange = (date?: Date) => {
    setCreatedAtMax(date);
    setLocalFilters({
      ...localFilters,
      created_at_max: date,
    });
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
          <DialogTitle>فیلتر پروفایل‌ها</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Page Size */}
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

            {/* Enabled */}
            {renderBooleanSelect("وضعیت فعال", localFilters.enabled, (val) =>
              setLocalFilters({ ...localFilters, enabled: val })
            )}

            {/* First Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">نام</label>
              <Input
                value={localFilters.first_name || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    first_name: e.target.value,
                  })
                }
                placeholder="نام"
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">نام خانوادگی</label>
              <Input
                value={localFilters.last_name || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    last_name: e.target.value,
                  })
                }
                placeholder="نام خانوادگی"
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-sm font-medium">نام کاربری</label>
              <Input
                value={localFilters.username || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, username: e.target.value })
                }
                placeholder="نام کاربری"
              />
            </div>

            {/* Mobile */}
            <div className="space-y-2">
              <label className="text-sm font-medium">موبایل</label>
              <Input
                value={localFilters.mobile || ""}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, mobile: e.target.value })
                }
                placeholder="موبایل"
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm font-medium">جنسیت</label>
              <Select
                value={localFilters.gender ? localFilters.gender : "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    gender: value === "all" ? undefined : (value as GenderEnum),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="جنسیت" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Created At Min */}
            {renderDatePicker(
              "از تاریخ ایجاد",
              createdAtMin,
              handleCreatedAtMinChange
            )}

            {/* Created At Max */}
            {renderDatePicker(
              "تا تاریخ ایجاد",
              createdAtMax,
              handleCreatedAtMaxChange
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
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

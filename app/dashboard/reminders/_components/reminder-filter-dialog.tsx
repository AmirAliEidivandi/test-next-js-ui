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
import type { GetEmployeesResponse, QueryReminder } from "@/lib/api/types";
import { cn } from "@/lib/utils";

type ReminderFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: GetEmployeesResponse | undefined;
  filters: QueryReminder;
  onApply: (filters: QueryReminder) => void;
  onClear: () => void;
};

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

const booleanOptions = [
  { value: "all", label: "همه" },
  { value: "true", label: "بله" },
  { value: "false", label: "خیر" },
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

export function ReminderFilterDialog({
  open,
  onOpenChange,
  employees,
  filters,
  onApply,
  onClear,
}: ReminderFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryReminder>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryReminder = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.from) {
      cleanFilters.from = localFilters.from;
    }
    if (localFilters.to) {
      cleanFilters.to = localFilters.to;
    }
    if (localFilters.employee_id) {
      cleanFilters.employee_id = localFilters.employee_id;
    }
    if (localFilters.seen !== undefined) {
      cleanFilters.seen = localFilters.seen;
    }

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

  const employeeOptions = employees ?? [];

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
          <DialogTitle>فیلتر یادآورها</DialogTitle>
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
              <label className="text-sm font-medium">کارمند</label>
              <Select
                value={localFilters.employee_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    employee_id: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کارمند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {employeeOptions.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.profile.first_name} {employee.profile.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderBooleanSelect("وضعیت دیده شده", localFilters.seen, (val) =>
              setLocalFilters({ ...localFilters, seen: val })
            )}

            {renderDatePicker("از تاریخ یادآوری", localFilters.from, (date) =>
              setLocalFilters({
                ...localFilters,
                from: date,
              })
            )}

            {renderDatePicker("تا تاریخ یادآوری", localFilters.to, (date) =>
              setLocalFilters({
                ...localFilters,
                to: date,
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

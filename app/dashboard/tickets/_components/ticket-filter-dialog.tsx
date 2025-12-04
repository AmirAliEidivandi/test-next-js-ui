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
import type { QueryTicket } from "@/lib/api/types";
import { useCustomers } from "@/lib/hooks/api/use-customers";
import { useEmployees } from "@/lib/hooks/api/use-employees";
import { cn } from "@/lib/utils";

type TicketFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: QueryTicket;
  onApply: (filters: QueryTicket) => void;
  onClear: () => void;
};

const statusOptions: Array<[string, string]> = [
  ["OPEN", "باز"],
  ["CLOSED", "بسته"],
  ["REOPENED", "باز شده"],
  ["RESOLVED", "حل شده"],
  ["WAITING_CUSTOMER", "در انتظار مشتری"],
  ["WAITING_SUPPORT", "در انتظار پشتیبان"],
];

const priorityOptions: Array<[string, string]> = [
  ["LOW", "کم"],
  ["NORMAL", "متوسط"],
  ["HIGH", "بالا"],
  ["URGENT", "فوری"],
];

const lastSenderTypeOptions: Array<[string, string]> = [
  ["CUSTOMER_PERSON", "مشتری"],
  ["EMPLOYEE", "پشتیبان"],
];

const sortByOptions: Array<[string, string]> = [
  ["last_message", "آخرین پیام"],
  ["updated_at", "آخرین به‌روزرسانی"],
];

const sortOrderOptions: Array<[string, string]> = [
  ["asc", "صعودی"],
  ["desc", "نزولی"],
];

const booleanOptions = [
  { value: "all", label: "همه" },
  { value: "true", label: "بله" },
  { value: "false", label: "خیر" },
];

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export function TicketFilterDialog({
  open,
  onOpenChange,
  filters,
  onApply,
  onClear,
}: TicketFilterDialogProps) {
  const employeesQuery = useEmployees();
  const { data: customersResp } = useCustomers({ "page-size": 200 });

  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryTicket>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryTicket = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.search) cleanFilters.search = localFilters.search;
    if (localFilters.status) cleanFilters.status = localFilters.status;
    if (localFilters.priority) cleanFilters.priority = localFilters.priority;
    if (localFilters.assigned_to_id)
      cleanFilters.assigned_to_id = localFilters.assigned_to_id;
    if (localFilters.employee_id)
      cleanFilters.employee_id = localFilters.employee_id;
    if (localFilters.customer_id)
      cleanFilters.customer_id = localFilters.customer_id;
    if (localFilters.person_id) cleanFilters.person_id = localFilters.person_id;
    if (localFilters.creator_person_id)
      cleanFilters.creator_person_id = localFilters.creator_person_id;
    if (localFilters.created_at_min)
      cleanFilters.created_at_min = localFilters.created_at_min;
    if (localFilters.created_at_max)
      cleanFilters.created_at_max = localFilters.created_at_max;
    if (localFilters.sort_by) cleanFilters.sort_by = localFilters.sort_by;
    if (localFilters.sort_order)
      cleanFilters.sort_order = localFilters.sort_order;
    if (localFilters.last_sender_type)
      cleanFilters.last_sender_type = localFilters.last_sender_type;
    if (localFilters.deleted !== undefined)
      cleanFilters.deleted = localFilters.deleted;

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

  const customerOptions = customersResp?.data ?? [];
  const selectedCustomer = customerOptions.find(
    (customer) => customer.id === localFilters.customer_id
  );
  const peopleOptions = selectedCustomer?.people ?? [];

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
          <DialogTitle>فیلتر تیکت‌ها</DialogTitle>
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
              <label className="text-sm font-medium">جستجو</label>
              <Input
                value={localFilters.search || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    search: e.target.value || undefined,
                  })
                }
                placeholder="موضوع یا متن پیام..."
              />
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
                        : (value as QueryTicket["status"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {statusOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">الویت</label>
              <Select
                value={localFilters.priority || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    priority:
                      value === "all"
                        ? undefined
                        : (value as QueryTicket["priority"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {priorityOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ارجاع شده به</label>
              <Select
                value={localFilters.assigned_to_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    assigned_to_id: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب کارمند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {employeesQuery.data?.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.profile.first_name} {e.profile.last_name}
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
                  {employeesQuery.data?.map((e: any) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.profile.first_name} {e.profile.last_name}
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
                    creator_person_id:
                      value === "all" || value !== prev.customer_id
                        ? undefined
                        : prev.creator_person_id,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب مشتری" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {customerOptions.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} - کد{" "}
                      {c.code?.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
                disabled={!localFilters.customer_id || peopleOptions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      localFilters.customer_id
                        ? peopleOptions.length > 0
                          ? "انتخاب نماینده"
                          : "نماینده‌ای ثبت نشده"
                        : "ابتدا مشتری را انتخاب کنید"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {peopleOptions.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.profile
                        ? `${p.profile.first_name} ${p.profile.last_name}`
                        : p.title || p.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ایجاد کننده</label>
              <Select
                value={localFilters.creator_person_id || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    creator_person_id: value === "all" ? undefined : value,
                  })
                }
                disabled={!localFilters.customer_id || peopleOptions.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      localFilters.customer_id
                        ? peopleOptions.length > 0
                          ? "انتخاب ایجاد کننده"
                          : "ایجاد کننده‌ای ثبت نشده"
                        : "ابتدا مشتری را انتخاب کنید"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {peopleOptions.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.profile
                        ? `${p.profile.first_name} ${p.profile.last_name}`
                        : p.title || p.id}
                    </SelectItem>
                  ))}
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

            <div className="space-y-2">
              <label className="text-sm font-medium">
                نوع آخرین ارسال کننده
              </label>
              <Select
                value={localFilters.last_sender_type || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    last_sender_type:
                      value === "all"
                        ? undefined
                        : (value as QueryTicket["last_sender_type"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {lastSenderTypeOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">مرتب‌سازی بر اساس</label>
              <Select
                value={localFilters.sort_by || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    sort_by:
                      value === "all"
                        ? undefined
                        : (value as QueryTicket["sort_by"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {sortByOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ترتیب</label>
              <Select
                value={localFilters.sort_order || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    sort_order:
                      value === "all"
                        ? undefined
                        : (value as QueryTicket["sort_order"]),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="همه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {sortOrderOptions.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {renderBooleanSelect(
              "حذف شده",
              localFilters.deleted,
              (val) => setLocalFilters({ ...localFilters, deleted: val })
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

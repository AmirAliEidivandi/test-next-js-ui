"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QueryReturnRequest } from "@/lib/api/types";
import { useCustomers } from "@/lib/hooks/api/use-customers";
import { Filter, X } from "lucide-react";
import * as React from "react";

type ReturnRequestFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: QueryReturnRequest;
  onApply: (filters: QueryReturnRequest) => void;
  onClear: () => void;
};

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export function ReturnRequestFilterDialog({
  open,
  onOpenChange,
  filters,
  onApply,
  onClear,
}: ReturnRequestFilterDialogProps) {
  const { data: customersResp } = useCustomers({ "page-size": 200 });
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryReturnRequest>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryReturnRequest = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.customer_id)
      cleanFilters.customer_id = localFilters.customer_id;

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

  const customerOptions = customersResp?.data ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Filter className="ml-2 size-4" />
          فیلتر
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>فیلتر درخواست‌های مرجوعی</DialogTitle>
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
                  {customerOptions.map((customer: any) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.title} - کد{" "}
                      {customer.code?.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 justify-end w-full">
            <Button onClick={handleApply}>اعمال فیلتر</Button>
            <Button variant="outline" onClick={handleClear}>
              <X className="ml-2 size-4" />
              پاک کردن
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


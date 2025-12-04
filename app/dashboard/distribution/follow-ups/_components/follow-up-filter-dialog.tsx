"use client";

import { Filter, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import type {
  CapillarySalesLinesResponse,
  GetEmployeesResponse,
  QueryFollowUp,
} from "@/lib/api/types";

type FollowUpFilterDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: GetEmployeesResponse | undefined;
  salesLines: CapillarySalesLinesResponse | undefined;
  filters: QueryFollowUp;
  onApply: (filters: QueryFollowUp) => void;
  onClear: () => void;
};

const pageSizeOptions = [10, 20, 30, 40, 50, 100];

export function FollowUpFilterDialog({
  open,
  onOpenChange,
  employees,
  salesLines,
  filters,
  onApply,
  onClear,
}: FollowUpFilterDialogProps) {
  const [localFilters, setLocalFilters] =
    React.useState<Partial<QueryFollowUp>>(filters);

  React.useEffect(() => {
    setLocalFilters(filters);
  }, [filters, open]);

  const handleApply = () => {
    const cleanFilters: QueryFollowUp = {
      "page-size": localFilters["page-size"] || 20,
    };

    if (localFilters.employee_id) {
      cleanFilters.employee_id = localFilters.employee_id;
    }
    if (localFilters.capillary_sales_line_id) {
      cleanFilters.capillary_sales_line_id = localFilters.capillary_sales_line_id;
    }

    onApply(cleanFilters);
  };

  const handleClear = () => {
    setLocalFilters({ "page-size": 20 });
    onClear();
  };

  const employeeOptions = employees ?? [];
  const salesLineOptions = salesLines?.data ?? [];

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
          <DialogTitle>فیلتر پیگیری‌ها</DialogTitle>
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
                  <SelectValue placeholder="انتخاب خط فروش" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  {salesLineOptions.map((line) => (
                    <SelectItem key={line.id} value={line.id}>
                      {line.title}
                    </SelectItem>
                  ))}
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


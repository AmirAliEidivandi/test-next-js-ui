"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CreateProfileDto } from "@/lib/api/types";
import { GenderEnum } from "@/lib/api/types";
import {
  useCreateProfile,
  useGroups,
} from "@/lib/hooks/api/use-profiles";

const genderOptions: { value: GenderEnum; label: string }[] = [
  { value: GenderEnum.MALE, label: "مرد" },
  { value: GenderEnum.FEMALE, label: "زن" },
];

export default function CreateEmployeePage() {
  const router = useRouter();
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups();
  const createProfile = useCreateProfile();

  const [formData, setFormData] = React.useState<CreateProfileDto>({
    first_name: "",
    last_name: "",
    email: "",
    gender: "MALE",
    mobile: "",
    groups: [],
    enabled: true,
    birth_date: undefined,
    national_code: "",
    username: "",
    capillary_sales_line_ids: [],
  });

  const [birthDate, setBirthDate] = React.useState<Date | undefined>(undefined);

  const groups = groupsData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData: CreateProfileDto = {
        ...formData,
        birth_date: birthDate
          ? format(birthDate, "yyyy-MM-dd")
          : undefined,
      };

      await createProfile.mutateAsync(submitData);
      toast.success("کارمند با موفقیت ایجاد شد");
      router.push("/dashboard/users-management/employees");
    } catch (error: any) {
      toast.error("خطا در ایجاد کارمند", {
        description: error?.message || "لطفا دوباره تلاش کنید",
      });
    }
  };

  const toggleGroup = (groupId: string) => {
    setFormData((prev) => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter((id) => id !== groupId)
        : [...prev.groups, groupId],
    }));
  };

  if (isLoadingGroups) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ایجاد کارمند</h2>
          <p className="text-sm text-muted-foreground">
            ایجاد کارمند جدید در سیستم
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/users-management/employees")}
        >
          <ArrowRight className="ml-2 size-4" />
          بازگشت
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* First Name */}
          <div className="space-y-2">
            <Label htmlFor="first_name">نام *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, first_name: e.target.value }))
              }
              placeholder="نام"
              required
            />
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label htmlFor="last_name">نام خانوادگی *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, last_name: e.target.value }))
              }
              placeholder="نام خانوادگی"
              required
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">نام کاربری</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              placeholder="نام کاربری"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">ایمیل *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="ایمیل"
              required
            />
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">موبایل *</Label>
            <Input
              id="mobile"
              value={formData.mobile}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, mobile: e.target.value }))
              }
              placeholder="موبایل"
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">جنسیت *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: GenderEnum) =>
                setFormData((prev) => ({ ...prev, gender: value }))
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

          {/* National Code */}
          <div className="space-y-2">
            <Label htmlFor="national_code">کد ملی</Label>
            <Input
              id="national_code"
              value={formData.national_code}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  national_code: e.target.value,
                }))
              }
              placeholder="کد ملی"
            />
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <Label>تاریخ تولد</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal",
                    !birthDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 size-4" />
                  {birthDate ? (
                    format(birthDate, "yyyy/MM/dd", { locale: faIR })
                  ) : (
                    <span>تاریخ تولد را انتخاب کنید</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={birthDate}
                  onSelect={setBirthDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Enabled */}
          <div className="space-y-2">
            <Label>وضعیت</Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    enabled: checked === true,
                  }))
                }
              />
              <Label htmlFor="enabled" className="cursor-pointer">
                فعال
              </Label>
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-2">
          <Label>گروه‌ها</Label>
          <div className="rounded-md border p-4">
            {groups.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <div key={group.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={formData.groups.includes(group.id)}
                      onCheckedChange={() => toggleGroup(group.id)}
                    />
                    <Label
                      htmlFor={`group-${group.id}`}
                      className="cursor-pointer"
                    >
                      {group.name}
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                گروهی یافت نشد
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/users-management/employees")}
          >
            انصراف
          </Button>
          <Button type="submit" disabled={createProfile.isPending}>
            {createProfile.isPending ? "در حال ایجاد..." : "ایجاد کارمند"}
          </Button>
        </div>
      </form>
    </div>
  );
}


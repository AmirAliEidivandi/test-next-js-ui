"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/lib/hooks/api/use-profiles";
import type { GenderEnum } from "@/lib/api/types";

const genderLabels: Record<GenderEnum, string> = {
  MALE: "مرد",
  FEMALE: "زن",
};

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const profileId = params.id as string;

  const { data: profileResponse, isLoading, error } = useProfile(profileId);

  const profile = profileResponse?.data?.[0];

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات کاربر", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  if (isLoading && !profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">کاربر یافت نشد</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/users-management/users")}
        >
          بازگشت به لیست کاربران
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            جزئیات کاربر
          </h2>
          <p className="text-sm text-muted-foreground">
            اطلاعات کامل کاربر
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/users-management/users")}
        >
          <ArrowRight className="ml-2 size-4" />
          بازگشت
        </Button>
      </div>

      {/* Profile Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات شخصی</CardTitle>
            <CardDescription>اطلاعات اصلی کاربر</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  نام
                </p>
                <p className="text-base font-semibold">{profile.first_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  نام خانوادگی
                </p>
                <p className="text-base font-semibold">{profile.last_name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  نام کاربری
                </p>
                <p className="text-base font-semibold">
                  {profile.username || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  موبایل
                </p>
                <p className="text-base font-semibold">
                  {profile.mobile || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  جنسیت
                </p>
                <p className="text-base font-semibold">
                  {profile.gender ? genderLabels[profile.gender] : "-"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  تاریخ تولد
                </p>
                <p className="text-base font-semibold">
                  {profile.birth_date
                    ? formatDate(profile.birth_date)
                    : "-"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                کد ملی
              </p>
              <p className="text-base font-semibold">
                {profile.national_code || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات شغلی</CardTitle>
            <CardDescription>اطلاعات مربوط به سمت شغلی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.person ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    شناسه شخص
                  </p>
                  <p className="text-base font-semibold">{profile.person.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    سمت شغلی
                  </p>
                  <p className="text-base font-semibold">
                    {profile.person.title || "-"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                اطلاعات شغلی موجود نیست
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اطلاعات سیستم</CardTitle>
            <CardDescription>اطلاعات مربوط به سیستم</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  وضعیت
                </p>
                <p className="text-base font-semibold">
                  {profile.enabled ? "فعال" : "غیرفعال"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  تاریخ ایجاد
                </p>
                <p className="text-base font-semibold">
                  {formatDate(profile.created_at)}
                </p>
              </div>
            </div>

            {profile.groups && profile.groups.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  گروه‌ها
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.groups.map((group) => (
                    <span
                      key={group.id}
                      className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                    >
                      {group.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


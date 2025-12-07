"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ArrowRight,
  MoreVertical,
  CreditCard,
  DollarSign,
  FileText,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallet } from "@/lib/hooks/api/use-wallets";
import {
  CustomerCategoryEnum,
  CustomerTypeEnum,
} from "@/lib/api/types";

const toPersianDigits = (value: number | string): string => {
  const str = typeof value === "number" ? value.toString() : value;
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
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

const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return "۰";
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

// Category labels
const categoryLabels: Record<CustomerCategoryEnum, string> = {
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

// Type labels
const typeLabels: Record<CustomerTypeEnum, string> = {
  PERSONAL: "حقیقی",
  CORPORATE: "حقوقی",
};

export default function WalletDetailPage() {
  const params = useParams();
  const router = useRouter();
  const walletId = params.walletId as string;

  const { data: wallet, isLoading, error } = useWallet(walletId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات کیف پول", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleRegisterPayment = () => {
    // TODO: Open register payment dialog
    // router.push(`/dashboard/wallets/${walletId}/register-payment`);
  };

  const handleSetCreditCap = () => {
    // TODO: Open set credit cap dialog
    // router.push(`/dashboard/wallets/${walletId}/set-credit-cap`);
  };

  const handleRegisterInitialDebt = () => {
    // TODO: Open register initial debt dialog
    // router.push(`/dashboard/wallets/${walletId}/register-initial-debt`);
  };

  if (isLoading && !wallet) {
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

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">کیف پول یافت نشد</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/wallets")}
        >
          بازگشت به لیست کیف پول‌ها
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
            جزئیات کیف پول
          </h2>
          <p className="text-sm text-muted-foreground">
            {wallet.customer && (
              <>
                مشتری: {wallet.customer.title} (کد:{" "}
                {toPersianDigits(wallet.customer.code)})
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRegisterPayment}>
                <span className="flex-1 text-right">ثبت پرداخت</span>
                <CreditCard className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSetCreditCap}>
                <span className="flex-1 text-right">تعیین حد اعتبار</span>
                <DollarSign className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRegisterInitialDebt}>
                <span className="flex-1 text-right">ثبت بدهی اولیه</span>
                <FileText className="size-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/wallets")}
          >
            <ArrowRight className="size-4 ml-2" />
            بازگشت به لیست
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات مشتری */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات مشتری</CardTitle>
            <CardDescription>اطلاعات مشتری مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallet.customer ? (
              <>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    نام مشتری
                  </p>
                  <p className="text-base font-medium">
                    {wallet.customer.title}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    کد مشتری
                  </p>
                  <p className="text-base">
                    {toPersianDigits(wallet.customer.code)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    نوع
                  </p>
                  <p className="text-base">
                    {typeLabels[wallet.customer.type] || wallet.customer.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    حوزه فعالیت
                  </p>
                  <p className="text-base">
                    {categoryLabels[wallet.customer.category] ||
                      wallet.customer.category}
                  </p>
                </div>
                {wallet.customer.capillary_sales_line && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      خط فروش
                    </p>
                    <p className="text-base">
                      {wallet.customer.capillary_sales_line.line_number}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">مشتری مرتبطی وجود ندارد</p>
            )}
          </CardContent>
        </Card>

        {/* موجودی و اعتبار */}
        <Card>
          <CardHeader>
            <CardTitle>موجودی و اعتبار</CardTitle>
            <CardDescription>اطلاعات موجودی و اعتبار کیف پول</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                موجودی حسابداری
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(formatPrice(wallet.balance))} ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                موجودی واقعی
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(formatPrice(wallet.actual_balance))} ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                حد اعتبار
              </p>
              <p className="text-base">
                {toPersianDigits(formatPrice(wallet.credit_cap))} ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                اعتبار واقعی
              </p>
              <p className="text-base">
                {toPersianDigits(formatPrice(wallet.actual_credit))} ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                موجودی اولیه
              </p>
              <p className="text-base">
                {wallet.initial_balance !== null
                  ? `${toPersianDigits(formatPrice(wallet.initial_balance))} ریال`
                  : "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات چک‌ها */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات چک‌ها</CardTitle>
            <CardDescription>چک‌های در انتظار</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                مجموع چک‌های در انتظار
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(formatPrice(wallet.pending_cheques_total))}{" "}
                ریال
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تعداد چک‌های در انتظار
              </p>
              <p className="text-base">
                {toPersianDigits(wallet.pending_cheques_count)} عدد
              </p>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات زمانی */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات زمانی</CardTitle>
            <CardDescription>تاریخ ایجاد و به‌روزرسانی</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">{formatDate(wallet.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                آخرین به‌روزرسانی
              </p>
              <p className="text-base">{formatDate(wallet.updated_at)}</p>
            </div>
            {wallet.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  توضیحات
                </p>
                <p className="text-base">{wallet.description}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


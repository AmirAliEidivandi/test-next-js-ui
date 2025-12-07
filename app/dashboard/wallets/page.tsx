"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CustomerCategoryEnum, CustomerTypeEnum } from "@/lib/api/types";
import { useWallets } from "@/lib/hooks/api/use-wallets";

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

export default function WalletsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    data: wallets,
    isLoading,
    error,
  } = useWallets({
    page: currentPage,
    "page-size": 20,
  });

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست کیف پول‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleViewWallet = (walletId: string) => {
    router.push(`/dashboard/wallets/${walletId}`);
  };

  const pageSize = 20;
  const totalPages = wallets ? Math.ceil(wallets.count / pageSize) : 0;

  if (isLoading && !wallets) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 9 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">لیست کیف پول‌ها</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده لیست کیف پول‌ها
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">ردیف</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">حوزه فعالیت</TableHead>
              <TableHead className="text-right">موجودی</TableHead>
              <TableHead className="text-right">حد اعتبار</TableHead>
              <TableHead className="text-right">موجودی اولیه</TableHead>
              <TableHead className="text-right">تاریخ ایجاد</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {wallets && wallets.data.length > 0 ? (
              wallets.data.map((wallet, index) => (
                <TableRow key={wallet.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits((currentPage - 1) * 20 + index + 1)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{wallet.customer.title}</div>
                      <div className="text-xs text-muted-foreground">
                        کد: {toPersianDigits(wallet.customer.code)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {typeLabels[wallet.customer.type] || wallet.customer.type}
                  </TableCell>
                  <TableCell>
                    {categoryLabels[wallet.customer.category] ||
                      wallet.customer.category}
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(formatPrice(wallet.balance))} ریال
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(formatPrice(wallet.credit_cap))} ریال
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(formatPrice(wallet.initial_balance))} ریال
                  </TableCell>
                  <TableCell>{formatDate(wallet.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewWallet(wallet.id)}
                          >
                            <Eye className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>مشاهده</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground py-8"
                >
                  کیف پولی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {wallets && totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={currentPage === page}
                        >
                          {page.toLocaleString("fa-IR")}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

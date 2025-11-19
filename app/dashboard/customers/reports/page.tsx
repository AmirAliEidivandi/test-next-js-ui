"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import { BellPlus, Edit, Eye, Trash2 } from "lucide-react";
import * as React from "react";
import { useRouter } from "next/navigation";
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
import { CustomerFilterDialog } from "../_components/customer-filter-dialog";
import { customersApi } from "@/lib/api/customers";
import { employeesApi } from "@/lib/api/employees";
import type {
  CapillarySalesLinesResponse,
  GetCustomerReportResponse,
  GetSellersResponse,
  QueryCustomer,
} from "@/lib/api/types";

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

const typeLabels: Record<string, string> = {
  PERSONAL: "حقیقی",
  CORPORATE: "حقوقی",
};

const orderStepLabels: Record<string, string> = {
  SELLER: "فروشنده",
  SALES_MANAGER: "مدیر فروش",
  PROCESSING: "آماده‌سازی",
  INVENTORY: "انبار",
  ACCOUNTING: "حسابداری",
  CARGO: "مرسوله",
  PARTIALLY_DELIVERED: "تحویل جزئی",
  DELIVERED: "تحویل شده",
  RETURNED: "مرجوعی کامل",
  PARTIALLY_RETURNED: "مرجوعی جزئی",
};

const paymentStatusLabels: Record<string, string> = {
  PAID: "پرداخت شده",
  NOT_PAID: "پرداخت نشده",
  PARTIALLY_PAID: "پرداخت جزئی",
};

const toPersianDigits = (str: string): string => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
};

export default function CustomersReportPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [report, setReport] =
    React.useState<GetCustomerReportResponse | null>(null);
  const [salesLines, setSalesLines] =
    React.useState<CapillarySalesLinesResponse | null>(null);
  const [sellers, setSellers] = React.useState<GetSellersResponse[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryCustomer>({
    "page-size": 20,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;
  const totalPages = report ? Math.ceil(report.count / pageSize) : 0;

  React.useEffect(() => {
    loadInitialData();
  }, []);

  React.useEffect(() => {
    loadReport();
  }, [currentPage, filters]);

  const loadInitialData = async () => {
    try {
      const [salesLinesData, sellersData] = await Promise.all([
        customersApi.getCapillarySalesLines(),
        employeesApi.getSellers(),
      ]);
      setSalesLines(salesLinesData);
      setSellers(sellersData);
    } catch (error) {
      toast.error("خطا در بارگذاری اطلاعات اولیه");
    }
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      const query: QueryCustomer = {
        ...filters,
        page: currentPage,
      };
      const data = await customersApi.getCustomersLastOrder(query);
      setReport(data);
    } catch (error) {
      toast.error("خطا در بارگذاری گزارش مشتریان", {
        description: "لطفا دوباره تلاش کنید",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterApply = (newFilters: QueryCustomer) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({ "page-size": 20 });
    setCurrentPage(1);
    setFilterDialogOpen(false);
  };

  const handleViewCustomer = (customerId: string) => {
    router.push(`/dashboard/customers/${customerId}`);
  };

  if (loading && !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">گزارش مشتری‌ها</h2>
          <p className="text-sm text-muted-foreground">
            بررسی وضعیت آخرین سفارش و موجودی کیف پول مشتریان
          </p>
        </div>
        <div className="flex gap-2">
          <CustomerFilterDialog
            open={filterDialogOpen}
            onOpenChange={setFilterDialogOpen}
            salesLines={salesLines}
            sellers={sellers}
            filters={filters}
            onApply={handleFilterApply}
            onClear={handleClearFilters}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد مشتری</TableHead>
              <TableHead className="text-right">کد حسابداری</TableHead>
              <TableHead className="text-right">عنوان</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">حوزه فعالیت</TableHead>
              <TableHead className="text-right">موجودی کیف پول</TableHead>
              <TableHead className="text-right">کد آخرین سفارش</TableHead>
              <TableHead className="text-right">مبلغ کل آخرین سفارش</TableHead>
              <TableHead className="text-right">مرحله سفارش</TableHead>
              <TableHead className="text-right">وضعیت پرداخت</TableHead>
              <TableHead className="text-right">تاریخ آخرین سفارش</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {report && report.data.length > 0 ? (
              report.data.map((customer) => {
                const lastOrder = customer.last_order;
                const walletBalance = customer.wallet?.balance ?? 0;
                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">
                      {customer.code.toLocaleString("fa-IR", {
                        useGrouping: false,
                      })}
                    </TableCell>
                    <TableCell>
                      {customer.hp_code
                        ? customer.hp_code.toLocaleString("fa-IR", {
                            useGrouping: false,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="font-medium">{customer.title}</TableCell>
                    <TableCell>
                      {typeLabels[customer.type] || customer.type}
                    </TableCell>
                    <TableCell>
                      {categoryLabels[customer.category] || customer.category}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {walletBalance.toLocaleString("fa-IR")} ریال
                    </TableCell>
                    <TableCell>
                      {lastOrder
                        ? lastOrder.code.toLocaleString("fa-IR", {
                            useGrouping: false,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {lastOrder
                        ? lastOrder.total_amount.toLocaleString("fa-IR")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {lastOrder
                        ? orderStepLabels[lastOrder.step] || lastOrder.step
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {lastOrder
                        ? paymentStatusLabels[lastOrder.payment_status] ||
                          lastOrder.payment_status
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {lastOrder
                        ? toPersianDigits(
                            format(
                              new Date(lastOrder.created_at),
                              "yyyy/MM/dd",
                              { locale: faIR }
                            )
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 justify-center">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewCustomer(customer.id)}
                              className="h-8 w-8"
                            >
                              <Eye className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>مشاهده</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Implement edit functionality
                              }}
                              className="h-8 w-8"
                            >
                              <Edit className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ویرایش</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Implement create reminder functionality
                              }}
                              className="h-8 w-8"
                            >
                              <BellPlus className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ایجاد یادآور</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                // TODO: Implement delete functionality
                              }}
                              className="h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>حذف مشتری</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center text-muted-foreground py-8"
                >
                  داده‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {report && totalPages > 1 && (
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


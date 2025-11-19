"use client";

import { BellPlus, Edit, Eye, Trash2 } from "lucide-react";
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
import { customersApi } from "@/lib/api/customers";
import { employeesApi } from "@/lib/api/employees";
import type {
  CapillarySalesLinesResponse,
  GetCustomersByDebtResponse,
  GetSellersResponse,
  QueryCustomer,
} from "@/lib/api/types";
import { CustomerFilterDialog } from "../_components/customer-filter-dialog";

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

export default function DebtorCustomersPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [customers, setCustomers] =
    React.useState<GetCustomersByDebtResponse | null>(null);
  const [salesLines, setSalesLines] =
    React.useState<CapillarySalesLinesResponse | null>(null);
  const [sellers, setSellers] = React.useState<GetSellersResponse[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState<QueryCustomer>({
    "page-size": 20,
  });
  const [filterDialogOpen, setFilterDialogOpen] = React.useState(false);

  const pageSize = filters["page-size"] || 20;
  const totalPages = customers ? Math.ceil(customers.count / pageSize) : 0;
  const totalDebt = customers?.metadata.total_debt || 0;

  React.useEffect(() => {
    loadInitialData();
  }, []);

  React.useEffect(() => {
    loadCustomers();
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

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const query: QueryCustomer = {
        ...filters,
        page: currentPage,
      };
      const data = await customersApi.getCustomersByDebt(query);
      setCustomers(data);
    } catch (error) {
      toast.error("خطا در بارگذاری مشتریان بدهکار", {
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

  if (loading && !customers) {
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
          <h2 className="text-2xl font-bold tracking-tight">
            لیست مشتریان بدهکار ({totalDebt.toLocaleString("fa-IR")} ریال)
          </h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده مشتریان بدهکار و میزان بدهی آن‌ها
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
              <TableHead className="text-right">کد</TableHead>
              <TableHead className="text-right">کد حسابداری</TableHead>
              <TableHead className="text-right">عنوان</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">حوزه فعالیت</TableHead>
              <TableHead className="text-right">نماینده</TableHead>
              <TableHead className="text-right">خط فروش</TableHead>
              <TableHead className="text-right">فروشنده</TableHead>
              <TableHead className="text-right">بدهی</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers && customers.data.length > 0 ? (
              customers.data.map((customer) => (
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
                  <TableCell className="font-medium">
                    {customer.title}
                  </TableCell>
                  <TableCell>
                    {typeLabels[customer.type] || customer.type}
                  </TableCell>
                  <TableCell>
                    {categoryLabels[customer.category] || customer.category}
                  </TableCell>
                  <TableCell>{customer.representative_name || "-"}</TableCell>
                  <TableCell>
                    {customer.capillary_sales_line?.title || "-"}
                  </TableCell>
                  <TableCell>
                    {customer.seller?.profile
                      ? `${customer.seller.profile.first_name} ${customer.seller.profile.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell className="font-semibold text-destructive">
                    {customer.wallet.balance.toLocaleString("fa-IR")} ریال
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
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center text-muted-foreground py-8"
                >
                  داده‌ای برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {customers && totalPages > 1 && (
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

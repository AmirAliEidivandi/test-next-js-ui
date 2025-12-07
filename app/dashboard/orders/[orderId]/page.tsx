"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ArrowRight,
  MoreVertical,
  Edit,
  FileText,
  CreditCard,
  RefreshCw,
  Package,
  Printer,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrder } from "@/lib/hooks/api/use-orders";
import {
  OrderStepEnum,
  PaymentStatusEnum,
  DeliveryMethodEnum,
  SettlementMethodEnum,
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

const formatPrice = (price: number): string => {
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

const stepLabels: Record<OrderStepEnum, string> = {
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

const paymentStatusLabels: Record<PaymentStatusEnum, string> = {
  PAID: "پرداخت شده",
  NOT_PAID: "پرداخت نشده",
  PARTIALLY_PAID: "پرداخت جزئی",
};

const deliveryMethodLabels: Record<DeliveryMethodEnum, string> = {
  FREE_OUR_TRUCK: "رایگان با ماشین شرکت",
  FREE_OTHER_SERVICES: "رایگان با سرویس خارجی",
  PAID: "ارسال با هزینه مشتری",
  AT_INVENTORY: "تحویل درب انبار",
};

const settlementMethodLabels: Record<SettlementMethodEnum, string> = {
  CASH: "نقدی",
  CHEQUE: "چک",
  CREDIT: "اعتباری",
};

const cargoTypeLabels: Record<string, string> = {
  DISPATCH: "مرسوله",
  RETURN: "مرجوعی",
};

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

const typeLabels: Record<CustomerTypeEnum, string> = {
  PERSONAL: "حقیقی",
  CORPORATE: "حقوقی",
};

// Helper functions for action availability
const canEditOrder = (step: OrderStepEnum): boolean => {
  return step === OrderStepEnum.SELLER || step === OrderStepEnum.SALES_MANAGER;
};

const canEditAccountingCode = (step: OrderStepEnum): boolean => {
  return step !== OrderStepEnum.ACCOUNTING;
};

const canRegisterCargo = (step: OrderStepEnum): boolean => {
  return step === OrderStepEnum.PROCESSING;
};

const canChangeStatus = (step: OrderStepEnum): boolean => {
  const allowedSteps = [
    OrderStepEnum.SELLER,
    OrderStepEnum.SALES_MANAGER,
    OrderStepEnum.PROCESSING,
    OrderStepEnum.INVENTORY,
    OrderStepEnum.ACCOUNTING,
    OrderStepEnum.CARGO,
    OrderStepEnum.PARTIALLY_DELIVERED,
  ];
  return allowedSteps.includes(step);
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { data: order, isLoading, error } = useOrder(orderId);

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری جزئیات سفارش", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleEdit = () => {
    // TODO: Open edit dialog
  };

  const handleEditAccountingCode = () => {
    // TODO: Open edit accounting code dialog
  };

  const handleChangePaymentStatus = () => {
    // TODO: Open change payment status dialog
  };

  const handleChangeStatus = () => {
    // TODO: Open change status dialog
  };

  const handleRegisterCargo = () => {
    // TODO: Open register cargo dialog
  };

  const handlePrintWarehouseReceipt = () => {
    // TODO: Print warehouse receipt
  };

  if (isLoading && !order) {
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

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-lg text-muted-foreground">سفارش یافت نشد</p>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/orders")}
        >
          بازگشت به لیست سفارشات
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
            جزئیات سفارش: {toPersianDigits(order.code)}
          </h2>
          <p className="text-sm text-muted-foreground">
            مشاهده اطلاعات کامل سفارش
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
              <DropdownMenuItem
                onClick={handleEdit}
                disabled={!canEditOrder(order.step)}
              >
                <span className="flex-1 text-right">ویرایش</span>
                <Edit className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleEditAccountingCode}
                disabled={!canEditAccountingCode(order.step)}
              >
                <span className="flex-1 text-right">ویرایش کد حسابداری</span>
                <FileText className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangePaymentStatus}>
                <span className="flex-1 text-right">تغییر وضعیت پرداخت</span>
                <CreditCard className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleChangeStatus}
                disabled={!canChangeStatus(order.step)}
              >
                <span className="flex-1 text-right">تغییر وضعیت</span>
                <RefreshCw className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleRegisterCargo}
                disabled={!canRegisterCargo(order.step)}
              >
                <span className="flex-1 text-right">ثبت مرسوله</span>
                <Package className="size-4 ml-2" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePrintWarehouseReceipt}>
                <span className="flex-1 text-right">پرینت حواله انبار</span>
                <Printer className="size-4 ml-2" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/orders")}
          >
            <ArrowRight className="size-4 ml-2" />
            بازگشت به لیست
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* اطلاعات اصلی */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات اصلی</CardTitle>
            <CardDescription>اطلاعات پایه سفارش</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد سفارش
              </p>
              <p className="text-base font-semibold">
                {toPersianDigits(order.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد حسابداری
              </p>
              <p className="text-base">
                {order.hp_invoice_code
                  ? toPersianDigits(order.hp_invoice_code)
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                مرحله
              </p>
              <Badge variant="default">
                {stepLabels[order.step] || order.step}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت پرداخت
              </p>
              <Badge
                variant={
                  order.payment_status === PaymentStatusEnum.PAID
                    ? "default"
                    : "secondary"
                }
              >
                {paymentStatusLabels[order.payment_status] ||
                  order.payment_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                روش تحویل
              </p>
              <p className="text-base">
                {deliveryMethodLabels[order.delivery_method] ||
                  order.delivery_method}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ تحویل
              </p>
              <p className="text-base">{formatDate(order.delivery_date)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد
              </p>
              <p className="text-base">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                تاریخ ایجاد سفارش
              </p>
              <p className="text-base">{formatDate(order.created_date)}</p>
            </div>
            {order.description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  توضیحات
                </p>
                <p className="text-base">{order.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* اطلاعات مشتری */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات مشتری</CardTitle>
            <CardDescription>اطلاعات مشتری مرتبط</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نام مشتری
              </p>
              <p className="text-base font-medium">{order.customer.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                کد مشتری
              </p>
              <p className="text-base">
                {toPersianDigits(order.customer.code)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                نوع
              </p>
              <p className="text-base">
                {typeLabels[order.customer.type] || order.customer.type}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                حوزه فعالیت
              </p>
              <p className="text-base">
                {categoryLabels[order.customer.category] ||
                  order.customer.category}
              </p>
            </div>
            {order.customer.capillary_sales_line && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  خط فروش
                </p>
                <p className="text-base">
                  {order.customer.capillary_sales_line.title}
                </p>
              </div>
            )}
            {order.representative_name && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  نماینده
                </p>
                <p className="text-base">{order.representative_name}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* اطلاعات فروشنده و ایجادکننده */}
        <Card>
          <CardHeader>
            <CardTitle>فروشنده و ایجادکننده</CardTitle>
            <CardDescription>اطلاعات فروشنده و ایجادکننده سفارش</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                فروشنده
              </p>
              <p className="text-base">
                {order.seller.profile.first_name}{" "}
                {order.seller.profile.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                ایجادکننده سفارش
              </p>
              <p className="text-base">
                {order.order_creator.profile.first_name}{" "}
                {order.order_creator.profile.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت خرید
              </p>
              <Badge variant={order.bought ? "default" : "secondary"}>
                {order.bought ? "خریداری شده" : "خریداری نشده"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت آنلاین
              </p>
              <Badge variant={order.is_online ? "default" : "secondary"}>
                {order.is_online ? "آنلاین" : "آفلاین"}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                وضعیت تحویل
              </p>
              <Badge variant={order.fulfilled ? "default" : "secondary"}>
                {order.fulfilled ? "تحویل شده" : "تحویل نشده"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* تسویه‌حساب‌ها */}
        {order.settlements && order.settlements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>تسویه‌حساب‌ها</CardTitle>
              <CardDescription>
                {toPersianDigits(order.settlements.length)} تسویه‌حساب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.settlements.map((settlement, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {settlementMethodLabels[settlement.method] ||
                          settlement.method}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(settlement.date)}
                      </p>
                    </div>
                    {settlement.description && (
                      <p className="text-xs text-muted-foreground">
                        {settlement.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* سبد سفارش */}
      {order.ordered_basket && order.ordered_basket.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>سبد سفارش</CardTitle>
            <CardDescription>
              {toPersianDigits(order.ordered_basket.length)} محصول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ردیف</TableHead>
                    <TableHead className="text-right">عنوان محصول</TableHead>
                    <TableHead className="text-right">کد محصول</TableHead>
                    <TableHead className="text-right">وزن</TableHead>
                    <TableHead className="text-right">وزن لغو شده</TableHead>
                    <TableHead className="text-right">وزن موجودی</TableHead>
                    <TableHead className="text-right">وزن تحویل شده</TableHead>
                    <TableHead className="text-right">قیمت</TableHead>
                    <TableHead className="text-center">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.ordered_basket.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {toPersianDigits(index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product_title}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.product_code)}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.cancelled_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.inventory_net_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.fulfilled_weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.price))} ریال
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={item.fulfilled ? "default" : "secondary"}
                        >
                          {item.fulfilled ? "تحویل شده" : "تحویل نشده"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* سبد ناموفق */}
      {order.failed_basket && order.failed_basket.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>سبد ناموفق</CardTitle>
            <CardDescription>
              {toPersianDigits(order.failed_basket.length)} محصول
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">ردیف</TableHead>
                    <TableHead className="text-right">عنوان محصول</TableHead>
                    <TableHead className="text-right">کد محصول</TableHead>
                    <TableHead className="text-right">وزن</TableHead>
                    <TableHead className="text-right">قیمت</TableHead>
                    <TableHead className="text-right">دلیل</TableHead>
                    <TableHead className="text-center">قفل شده</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.failed_basket.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {toPersianDigits(index + 1)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.product_title}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.product_code)}
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(item.weight)} کیلوگرم
                      </TableCell>
                      <TableCell>
                        {toPersianDigits(formatPrice(item.price))} ریال
                      </TableCell>
                      <TableCell>{item.reason}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={item.locked ? "default" : "secondary"}>
                          {item.locked ? "قفل شده" : "قفل نشده"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* مرسوله‌ها */}
      {order.cargos && order.cargos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>مرسوله‌ها</CardTitle>
            <CardDescription>
              {toPersianDigits(order.cargos.length)} مرسوله
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.cargos.map((cargo) => (
                <div key={cargo.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        کد مرسوله: {toPersianDigits(cargo.code)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {cargo.description || "-"}
                      </p>
                    </div>
                    <Badge variant={cargo.deleted ? "destructive" : "default"}>
                      {cargo.deleted ? "حذف شده" : "فعال"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">نوع</p>
                      <p>{cargoTypeLabels[cargo.type] || cargo.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">تاریخ</p>
                      <p>{formatDate(cargo.date)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">روش تحویل</p>
                      <p>
                        {deliveryMethodLabels[cargo.delivery_method] ||
                          cargo.delivery_method}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">پلاک ماشین</p>
                      <p>{cargo.truck_license_plate || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">راننده</p>
                      <p>
                        {cargo.truck_driver
                          ? `${cargo.truck_driver.first_name} ${cargo.truck_driver.last_name}`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">کارمند</p>
                      <p>
                        {cargo.employee.profile.first_name}{" "}
                        {cargo.employee.profile.last_name}
                      </p>
                    </div>
                  </div>
                  {cargo.products && cargo.products.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">محصولات:</p>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-right">عنوان</TableHead>
                              <TableHead className="text-right">کد</TableHead>
                              <TableHead className="text-right">وزن خالص</TableHead>
                              <TableHead className="text-right">وزن ناخالص</TableHead>
                              <TableHead className="text-right">وزن جعبه</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {cargo.products.map((product, idx) => (
                              <TableRow key={idx}>
                                <TableCell>{product.product_title}</TableCell>
                                <TableCell>
                                  {toPersianDigits(product.product_code)}
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(product.net_weight)} کیلوگرم
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(product.gross_weight)} کیلوگرم
                                </TableCell>
                                <TableCell>
                                  {toPersianDigits(product.box_weight)} کیلوگرم
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


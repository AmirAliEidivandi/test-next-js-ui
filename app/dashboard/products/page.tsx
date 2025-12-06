"use client";

import { Edit, Eye } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useProducts } from "@/lib/hooks/api/use-products";
import { useWarehouses } from "@/lib/hooks/api/use-warehouses";
import { ProductDetailDialog } from "./_components/product-detail-dialog";
import { ProductEditDialog } from "./_components/product-edit-dialog";

const toPersianDigits = (value: number | string): string => {
  const str = typeof value === "number" ? value.toString() : value;
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

const formatPrice = (price: number): string => {
  return price.toLocaleString("fa-IR", { useGrouping: true });
};

export default function ProductsPage() {
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses();
  const warehouseId =
    warehouses && warehouses.length > 0 ? warehouses[0].id : undefined;
  const {
    data: products,
    isLoading: isLoadingProducts,
    error,
  } = useProducts(warehouseId);
  const [viewingProductId, setViewingProductId] = React.useState<string | null>(
    null
  );
  const [editingProductId, setEditingProductId] = React.useState<string | null>(
    null
  );

  const isLoading = isLoadingWarehouses || isLoadingProducts;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست محصولات", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleViewProduct = (productId: string) => {
    setViewingProductId(productId);
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
  };

  if (isLoading && !products) {
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
                {Array.from({ length: 11 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 11 }).map((_, j) => (
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
          <h2 className="text-2xl font-bold tracking-tight">لیست محصولات</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده لیست محصولات
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد</TableHead>
              <TableHead className="text-right">کد حسابداری</TableHead>
              <TableHead className="text-right">عنوان حسابداری</TableHead>
              <TableHead className="text-right">عنوان</TableHead>
              <TableHead className="text-right">قیمت خرده</TableHead>
              <TableHead className="text-right">قیمت عمده</TableHead>
              <TableHead className="text-right">قیمت آنلاین</TableHead>
              <TableHead className="text-right">وزن خالص</TableHead>
              <TableHead className="text-center">وضعیت</TableHead>
              <TableHead className="text-center">ویژه</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits(product.code)}
                  </TableCell>
                  <TableCell>
                    {product.hp_code ? toPersianDigits(product.hp_code) : "-"}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {product.hp_title || "-"}
                  </TableCell>
                  <TableCell className="font-medium max-w-[220px] truncate">
                    {product.title}
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(formatPrice(product.retail_price))} ریال
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(formatPrice(product.wholesale_price))} ریال
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(formatPrice(product.online_price))} ریال
                  </TableCell>
                  <TableCell>
                    {toPersianDigits(product.net_weight)} کیلوگرم
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={product.is_online ? "default" : "secondary"}
                      className={
                        product.is_online
                          ? "bg-green-500 hover:bg-green-600"
                          : ""
                      }
                    >
                      {product.is_online ? "آنلاین" : "آفلاین"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.is_special ? "default" : "outline"}>
                      {product.is_special ? "بله" : "خیر"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewProduct(product.id)}
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
                            className="h-8 w-8"
                            onClick={() => handleEditProduct(product.id)}
                          >
                            <Edit className="size-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ویرایش</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground py-8"
                >
                  محصولی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <ProductDetailDialog
        productId={viewingProductId}
        open={!!viewingProductId}
        onOpenChange={(open) => !open && setViewingProductId(null)}
      />
      <ProductEditDialog
        productId={editingProductId}
        open={!!editingProductId}
        onOpenChange={(open) => !open && setEditingProductId(null)}
      />
    </div>
  );
}

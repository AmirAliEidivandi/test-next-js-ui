"use client";

import { format } from "date-fns-jalali";
import { faIR } from "date-fns-jalali/locale/fa-IR";
import {
  ChevronRight,
  Edit,
  Eye,
  Folder,
  FolderOpen,
  Package,
  Snowflake,
  Thermometer,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetCategoriesResponse } from "@/lib/api/types";
import { useCategories } from "@/lib/hooks/api/use-categories";
import { useWarehouses } from "@/lib/hooks/api/use-warehouses";
import { cn } from "@/lib/utils";
import { CategoryDetailDialog } from "./_components/category-detail-dialog";
import { CategoryEditDialog } from "./_components/category-edit-dialog";

const toPersianDigits = (value: string) =>
  value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);

const formatDate = (date?: Date | string) => {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return toPersianDigits(
    format(d, "yyyy/MM/dd", {
      locale: faIR,
    })
  );
};

const temperatureLabels: Record<string, string> = {
  COLD: "سرد",
  HOT: "گرم",
};

const temperatureIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  COLD: Snowflake,
  HOT: Thermometer,
};

type CategoryItemProps = {
  category: GetCategoriesResponse[0];
  level?: number;
  onEdit?: (category: GetCategoriesResponse[0]) => void;
  onView?: (category: GetCategoriesResponse[0]) => void;
};

function CategoryItem({
  category,
  level = 0,
  onEdit,
  onView,
}: CategoryItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const TemperatureIcon =
    temperatureIcons[category.temperature_type] || Thermometer;

  return (
    <div className="group">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/50",
            level > 0 && "border-r-2 border-r-primary/30 bg-muted/30"
          )}
          style={{ marginRight: `${level * 2}rem` }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 hover:bg-primary/10"
              >
                <ChevronRight
                  className={cn(
                    "size-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-90 text-primary"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
          ) : (
            <div className="h-9 w-9 shrink-0 flex items-center justify-center">
              <div className="size-1 rounded-full bg-muted-foreground/30" />
            </div>
          )}

          {/* Folder Icon */}
          <div className="shrink-0">
            {hasChildren ? (
              isOpen ? (
                <FolderOpen className="size-6 text-primary" />
              ) : (
                <Folder className="size-6 text-muted-foreground" />
              )
            ) : (
              <Package className="size-6 text-muted-foreground" />
            )}
          </div>

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h3 className="font-semibold text-base text-foreground">
                {category.title}
              </h3>
              <Badge variant="outline" className="text-xs font-medium">
                کد:{" "}
                {category.code.toLocaleString("fa-IR", { useGrouping: false })}
              </Badge>
              {category.priority > 0 && (
                <Badge variant="secondary" className="text-xs">
                  اولویت: {category.priority}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                <TemperatureIcon className="size-3.5" />
                <span className="font-medium">
                  {temperatureLabels[category.temperature_type]}
                </span>
              </div>
              {category._count.products > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                  <Package className="size-3.5" />
                  <span>
                    {category._count.products.toLocaleString("fa-IR", {
                      useGrouping: false,
                    })}{" "}
                    محصول
                  </span>
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDate(category.created_at)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 hover:bg-primary/10 hover:text-primary"
              onClick={() => onView?.(category)}
            >
              <Eye className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 hover:bg-primary/10 hover:text-primary"
              onClick={() => onEdit?.(category)}
            >
              <Edit className="size-4" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && (
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
            <div className="mt-2 space-y-2 pr-2">
              {category.children.map((child) => (
                <CategoryItem
                  key={child.id}
                  category={child}
                  level={level + 1}
                  onEdit={onEdit}
                  onView={onView}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

export default function CategoriesPage() {
  const { data: warehouses, isLoading: isLoadingWarehouses } = useWarehouses();
  const warehouseId =
    warehouses && warehouses.length > 0 ? warehouses[0].id : undefined;
  const {
    data: categories,
    isLoading: isLoadingCategories,
    error,
  } = useCategories(warehouseId);
  const [viewingCategoryId, setViewingCategoryId] = React.useState<
    string | null
  >(null);
  const [editingCategoryId, setEditingCategoryId] = React.useState<
    string | null
  >(null);

  const isLoading = isLoadingWarehouses || isLoadingCategories;

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری دسته‌بندی‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleView = (category: GetCategoriesResponse[0]) => {
    setViewingCategoryId(category.id);
  };

  const handleEdit = (category: GetCategoriesResponse[0]) => {
    setEditingCategoryId(category.id);
  };

  if (isLoading && !categories) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">دسته‌بندی‌ها</h2>
          <p className="text-sm text-muted-foreground">
            مدیریت و مشاهده دسته‌بندی‌ها
          </p>
        </div>
      </div>

      {/* Categories Tree */}
      {categories && categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Folder className="size-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-sm text-muted-foreground">
            دسته‌بندی‌ای برای نمایش وجود ندارد
          </p>
        </div>
      )}

      {/* Dialogs */}
      <CategoryDetailDialog
        categoryId={viewingCategoryId}
        open={!!viewingCategoryId}
        onOpenChange={(open) => !open && setViewingCategoryId(null)}
      />
      <CategoryEditDialog
        categoryId={editingCategoryId}
        categories={categories}
        open={!!editingCategoryId}
        onOpenChange={(open) => !open && setEditingCategoryId(null)}
      />
    </div>
  );
}

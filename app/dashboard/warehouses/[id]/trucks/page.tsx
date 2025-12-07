"use client";

import { Eye, ArrowRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

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
import { useTrucks } from "@/lib/hooks/api/use-trucks";
import { useWarehouse } from "@/lib/hooks/api/use-warehouses";
import { TruckTypeEnum } from "@/lib/api/types";
import { TruckDetailDialog } from "./_components/truck-detail-dialog";

const toPersianDigits = (value: number | string): string => {
  const str = typeof value === "number" ? value.toString() : value;
  return str.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(digit, 10)]);
};

const truckTypeLabels: Record<TruckTypeEnum, string> = {
  NISSAN: "نیسان",
  TRUCK: "کامیون",
  CAMIONET: "کامیونت",
};

export default function TrucksPage() {
  const params = useParams();
  const router = useRouter();
  const warehouseId = params.id as string;

  const { data: warehouse } = useWarehouse(warehouseId);
  const { data: trucks, isLoading, error } = useTrucks(warehouseId);
  const [viewingTruckId, setViewingTruckId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    if (error) {
      toast.error("خطا در بارگذاری لیست ماشین‌ها", {
        description: "لطفا دوباره تلاش کنید",
      });
    }
  }, [error]);

  const handleViewTruck = (truckId: string) => {
    setViewingTruckId(truckId);
  };

  if (isLoading && !trucks) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
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
          <h2 className="text-2xl font-bold tracking-tight">لیست ماشین‌ها</h2>
          <p className="text-sm text-muted-foreground">
            {warehouse?.name && `انبار: ${warehouse.name}`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/warehouses/${warehouseId}`)}
        >
          <ArrowRight className="size-4 ml-2" />
          بازگشت
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">کد</TableHead>
              <TableHead className="text-right">نوع</TableHead>
              <TableHead className="text-right">پلاک</TableHead>
              <TableHead className="text-right">راننده</TableHead>
              <TableHead className="text-center">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trucks && trucks.data.length > 0 ? (
              trucks.data.map((truck) => (
                <TableRow key={truck.id}>
                  <TableCell className="font-medium">
                    {toPersianDigits(truck.code)}
                  </TableCell>
                  <TableCell>
                    {truckTypeLabels[truck.type] || truck.type}
                  </TableCell>
                  <TableCell>{truck.license_plate}</TableCell>
                  <TableCell>
                    {truck.driver
                      ? `${truck.driver.first_name} ${truck.driver.last_name}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleViewTruck(truck.id)}
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
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  ماشینی برای نمایش وجود ندارد
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <TruckDetailDialog
        truckId={viewingTruckId}
        open={!!viewingTruckId}
        onOpenChange={(open) => !open && setViewingTruckId(null)}
      />
    </div>
  );
}


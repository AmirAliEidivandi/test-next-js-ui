import { CardSkeleton } from "@/components/ui/card-skeleton";
import { ChartSkeleton } from "@/components/ui/chart-skeleton";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Welcome Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filters Skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Chart and Table Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartSkeleton />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <TableSkeleton rows={5} columns={4} />
          </div>
        </div>
      </div>

      {/* Products Sales Table */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <TableSkeleton rows={6} columns={5} />
      </div>
    </div>
  );
}


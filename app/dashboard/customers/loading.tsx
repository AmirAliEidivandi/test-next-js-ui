import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomersLoading() {
  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      <TableSkeleton rows={10} columns={8} />

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-center gap-2">
        <Skeleton className="h-10 w-10" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10" />
        ))}
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  );
}


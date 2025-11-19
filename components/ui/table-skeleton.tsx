import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="rounded-md border">
      <div className="border-b">
        <div className="flex gap-4 p-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                className="h-4 flex-1"
                style={{
                  animationDelay: `${(rowIndex * columns + colIndex) * 50}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


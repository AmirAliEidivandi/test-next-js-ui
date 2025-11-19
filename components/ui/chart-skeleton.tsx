import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ChartSkeleton() {
  // Generate consistent heights for bars
  const barHeights = [65, 45, 80, 55, 70, 40, 90, 50];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-6 w-40" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Chart bars skeleton */}
          <div className="flex items-end justify-between gap-2 h-[250px]">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <Skeleton
                  className="w-full rounded-t"
                  style={{
                    height: `${barHeights[i]}%`,
                    animationDelay: `${i * 80}ms`,
                  }}
                />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


import { Card, CardContent, CardHeader } from "./card"
import { Skeleton } from "./skeleton"

export function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {/* Main chart area */}
          <Skeleton className="h-64 w-full" />
          
          {/* Legend or additional info area */}
          <div className="flex gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

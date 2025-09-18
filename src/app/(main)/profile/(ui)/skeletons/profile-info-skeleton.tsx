import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileInfoSkeleton() {
  return (
    <Card className="bg-secondary text-muted mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-primary text-xl font-semibold">
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="bg-border/70 h-24 w-24 rounded-full" />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="bg-border/70 h-4 w-16" />
            <Skeleton className="bg-border/70 h-4 w-40" />
          </div>

          <div className="space-y-2">
            <Skeleton className="bg-border/70 h-4 w-16" />
            <Skeleton className="bg-border/70 h-4 w-48" />
          </div>
        </div>

        <Skeleton className="bg-border/70 h-10 w-full" />
      </CardContent>
    </Card>
  );
}

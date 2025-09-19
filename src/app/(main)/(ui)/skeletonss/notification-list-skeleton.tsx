import { Skeleton } from "@/components/ui/skeleton";

export const NotificationListSkeleton = () => {
  return (
    <div className="bg-border cursor-pointer rounded-md p-2">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="bg-secondary/70 h-4 w-[200px]" />
          <Skeleton className="bg-secondary/70 h-3 w-[100px]" />
        </div>

        <div className="bg-border rounded-md p-1">
          <Skeleton className="bg-secondary/70 h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

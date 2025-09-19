import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MessageBoxSkeletonProps } from "../../(lib)/chat-types";

const MessageBoxSkeleton = ({
  className,
  position = "left",
}: MessageBoxSkeletonProps) => {
  return (
    <div
      className={cn(
        "flex gap-1 sm:gap-2",
        position === "left" ? "justify-start" : "justify-end",
        className,
      )}
    >
      <div className={cn("group relative max-w-[85%] sm:max-w-[75%]")}>
        <div
          className={cn(
            "bg-secondary text-muted w-full p-2 sm:p-3",
            position === "left"
              ? "rounded-r-lg rounded-bl-lg"
              : "rounded-l-lg rounded-br-lg",
          )}
        >
          <Skeleton className="bg-border/80 h-4 w-[200px] animate-pulse" />
          <Skeleton className="bg-border/80 mt-2 h-3 w-[100px] animate-pulse" />
          <div className="mt-1 flex justify-end sm:mt-2">
            <Skeleton className="bg-border/80 h-2 w-[60px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxSkeleton;

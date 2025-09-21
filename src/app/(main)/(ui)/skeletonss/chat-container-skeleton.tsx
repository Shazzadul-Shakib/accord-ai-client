"use client";

import { ArrowLeft, WandSparkles, Wifi } from "lucide-react";
import MessageBoxSkeleton from "./message-box-skeleton";

const ChatContainerSkeleton = () => {
  return (
    <div className="bg-background flex h-full w-full flex-col lg:flex-1">
      {/* Chat Header Skeleton */}
      <div className="border-border bg-secondary border-b p-4.5 sm:p-0 sm:py-3">
        <div className="mx-auto flex w-[92%] max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-border flex items-center rounded-md px-4 py-1.5 lg:hidden">
              <ArrowLeft className="h-4 w-4" />
            </div>
            <div className="bg-border/70 h-6 w-32 animate-pulse rounded-md"></div>
            <Wifi className="h-4 w-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-primary/50 flex cursor-not-allowed items-center rounded-md px-2 py-1.5 opacity-50 sm:px-3">
              <WandSparkles className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages Area Skeleton */}
      <div className="flex flex-1 flex-col overflow-y-auto p-2 sm:p-4">
        <div className="mx-auto w-[92%] max-w-6xl space-y-6 sm:space-y-4">
          <MessageBoxSkeleton className="mr-auto" position="left" />
          <MessageBoxSkeleton className="ml-auto" position="right" />
          <MessageBoxSkeleton className="mr-auto" position="left" />
          <MessageBoxSkeleton className="ml-auto" position="right" />
        </div>
      </div>

      {/* Message Input Skeleton */}
      <div className="border-border bg-secondary border-t p-2 sm:p-4">
        <div className="mx-auto flex max-w-6xl items-end gap-2 sm:gap-3">
          <div className="bg-border flex-1 rounded-lg px-3 py-2 opacity-50 sm:px-4">
            <div className="bg-muted h-5 w-32 animate-pulse rounded"></div>
          </div>
          <div className="bg-primary/50 flex h-[36px] items-center gap-1 rounded-lg px-4 opacity-50 sm:h-[40px] sm:gap-2 sm:px-7">
            <div className="h-4 w-4 sm:h-5 sm:w-5"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainerSkeleton;

import { MessageSquareDot, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <div className="bg-secondary border-border w-full border-b-0 border-l-0 lg:w-[450px] lg:border-r">
      {/* Header */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquareDot />
            <span className="text-2xl font-bold">ACCORD-AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="bg-border/70 h-8 w-8 rounded-full" />
            <Skeleton className="bg-border/70 h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>

      {/* Search field */}
      <div className="mt-2 px-4 py-2">
        <div className="relative">
          <Search className="text-muted absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Skeleton className="bg-border/70 h-10 w-full rounded-md" />
        </div>
      </div>

      {/* Chat List Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-primary mt-2 px-4 py-2 text-xl font-semibold">
          Conversations
        </h1>
        <Skeleton className="bg-border/70 mr-4 h-8 w-8 rounded-md" />
      </div>

      {/* Chat List Items */}
      <div className="h-[calc(100vh-175px)] overflow-y-auto px-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="mb-2 flex items-center gap-3 p-3">
            <Skeleton className="bg-border/70 h-10 w-10 rounded-full" />
            <div className="flex-1">
              <Skeleton className="bg-border/70 mb-2 h-4 w-3/4" />
              <Skeleton className="bg-border/70 h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

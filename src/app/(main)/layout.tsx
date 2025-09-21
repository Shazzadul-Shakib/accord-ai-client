import { Suspense } from "react";
import ChatSidebar from "./(ui)/sidebar";
import SidebarSkeleton from "./(ui)/skeletonss/sidebar-skeleton";

interface LayoutProps {
  children: React.ReactNode;
}

// Demo chat data

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-[100dvh]">
      {/* Chat List Sidebar - Server Component */}
      <Suspense fallback={<SidebarSkeleton />}>
        <ChatSidebar />
      </Suspense>
      {/* Main Chat Area */}
      <div className="bg-background flex-1">{children}</div>
    </div>
  );
}

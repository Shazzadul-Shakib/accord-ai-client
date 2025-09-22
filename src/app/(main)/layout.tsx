"use client";
import { Suspense } from "react";
import ChatSidebar from "./(ui)/sidebar";
import SidebarSkeleton from "./(ui)/skeletonss/sidebar-skeleton";
import { useAuth } from "@/providers/auth-providers";
import { LoaderIcon } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <LoaderIcon />
      </div>
    );
  }

  return (
    isAuthenticated && (
      <div className="flex h-[100dvh]">
        {/* Chat List Sidebar - Server Component */}
        <Suspense fallback={<SidebarSkeleton />}>
          <ChatSidebar />
        </Suspense>
        {/* Main Chat Area */}
        <div className="bg-background flex-1">{children}</div>
      </div>
    )
  );
}

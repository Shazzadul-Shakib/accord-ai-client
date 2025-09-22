"use client";
import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatSidebar from "./(ui)/sidebar";
import SidebarSkeleton from "./(ui)/skeletonss/sidebar-skeleton";
import { useAuth } from "@/providers/auth-providers";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return <SidebarSkeleton />;
  }

  // Show loading while redirecting unauthenticated users
  if (!isAuthenticated) {
    return <SidebarSkeleton />;
  }

  // Only render main content if authenticated
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

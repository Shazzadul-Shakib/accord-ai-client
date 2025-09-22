"use client";

import { useAuth } from "@/providers/auth-providers";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Handle redirect for authenticated users
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <LoaderIcon />
      </div>
    );
  }

  // Show loading while redirecting authenticated users
  if (isAuthenticated) {
    return (
      <div className="flex h-[100dvh] items-center justify-center">
        <LoaderIcon />
      </div>
    );
  }

  // Only show children (login form) for unauthenticated users
  return <>{children}</>;
}

"use client";

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

  return !isAuthenticated && <>{children}</>;
}

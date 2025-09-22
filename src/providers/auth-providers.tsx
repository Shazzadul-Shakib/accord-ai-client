"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import * as jose from "jose";
import { accessSecret } from "@/lib/config";
import { useLogout } from "@/app/(main)/(lib)/profile/useLogout";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define route configurations
const PUBLIC_ROUTES = ["/login", "/register"];
const PROTECTED_ROUTES = ["/", "/profile"];
const DEFAULT_REDIRECT_AFTER_LOGIN = "/";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useLogout();
  const isAuthenticated = !!user;

  // Check if route requires authentication
  const isProtectedRoute = (path: string) => {
    // If path starts with any protected route
    return (
      PROTECTED_ROUTES.some((route) => path.startsWith(route)) ||
      // Or if it's not in public routes and not root
      (!PUBLIC_ROUTES.includes(path) && path !== "/")
    );
  };

  // Verify JWT token
  const verifyToken = async (token: string): Promise<User | null> => {
    try {
      const secret = new TextEncoder().encode(accessSecret || "");
      const { payload } = await jose.jwtVerify(token, secret);

      return {
        id: (payload.sub as string) || (payload.userId as string),
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as string,
      };
    } catch (error) {
      console.error("Token verification failed:", error);
      return null;
    }
  };

  // Check authentication status
  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUser(null);
        return false;
      }

      const userData = await verifyToken(accessToken);

      if (userData) {
        setUser(userData);
        return true;
      } else {
        // Token invalid, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return false;
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Handle route protection
  useEffect(() => {
    if (isLoading) return;

    const currentPath = pathname;
    const needsAuth = isProtectedRoute(currentPath);
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    if (needsAuth && !isAuthenticated) {
      // Redirect to login with callback URL
      const callbackUrl = encodeURIComponent(currentPath);
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    } else if (isPublicRoute && isAuthenticated) {
      // Get callback URL from search params or use default
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl =
        urlParams.get("callbackUrl") || DEFAULT_REDIRECT_AFTER_LOGIN;
      router.replace(decodeURIComponent(callbackUrl));
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Listen for storage changes (logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && e.newValue === null) {
        // Token was removed in another tab
        logout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

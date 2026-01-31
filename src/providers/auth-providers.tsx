"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/tanstack/api-services/authApi";

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
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define route configurations
const PUBLIC_ROUTES = ["/login", "/register"];
const DEFAULT_REDIRECT_AFTER_LOGIN = "/";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = !!user;

  console.log("AuthProvider state:", { user, isAuthenticated, pathname });

  // Simplified route checking
  const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.includes(path);
  };

  // Check authentication status by calling backend
  const checkAuth = async (): Promise<boolean> => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setUser(null);
        return false;
      }

      // Use authApi to leverage token refresh and consistent error handling
      const result = await authApi.loggedUser();
      const userData = result.data;

      setUser({
        id: userData._id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      });
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      // Token invalid, clear storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.replace("/login");
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
    const isPublic = isPublicRoute(currentPath);

    console.log("Route protection check:", {
      currentPath,
      isPublic,
      isAuthenticated,
      isLoading,
    });

    if (!isAuthenticated && !isPublic) {
      // User not authenticated and trying to access protected route
      const callbackUrl = encodeURIComponent(currentPath);
      console.log("Redirecting to login with callback:", callbackUrl);
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    } else if (isAuthenticated && isPublic) {
      // User is authenticated but on public route (login/register)
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl =
        urlParams.get("callbackUrl") || DEFAULT_REDIRECT_AFTER_LOGIN;
      const decodedUrl = decodeURIComponent(callbackUrl);

      console.log("Redirecting authenticated user to:", decodedUrl);
      router.replace(decodedUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Listen for storage changes (logout in other tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "accessToken" && e.newValue === null) {
        setUser(null);
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
        logout,
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

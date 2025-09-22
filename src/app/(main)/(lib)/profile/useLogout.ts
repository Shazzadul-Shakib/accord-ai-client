import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";
import { useState } from "react";

export const useLogout = () => {
  const router = useRouter();
  const { disconnectSocket } = useSocket(); // Access socket context
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      disconnectSocket();
      toast.success("Logout Successful");
      // Navigate to login page after successful logout
      router.replace("/login");
    } catch {
      toast.error("Logout unsuccessful");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
};

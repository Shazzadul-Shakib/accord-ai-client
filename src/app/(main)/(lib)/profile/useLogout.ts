import { toast } from "sonner";
import { useSocket } from "@/providers/socket-provider";
import { useState } from "react";
import { useAuth } from "@/providers/auth-providers";

export const useLogout = () => {
  const { logout: authLogout } = useAuth(); // Get logout from AuthContext
  const { disconnectSocket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);

    try {
      // Disconnect socket first
      disconnectSocket();

      // Use AuthContext logout (this clears tokens AND updates state)
      authLogout();

      // Show success message
      toast.success("Logout Successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout unsuccessful");

      // Still try to logout even if something fails
      authLogout();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    logout,
    isLoading,
  };
};

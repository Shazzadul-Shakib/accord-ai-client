import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/tanstack/api-services/authApi";
import { toast } from "sonner";
import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";
import { useRouter } from "next/navigation";
import { useSocket } from "@/providers/socket-provider";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocket(); // Access socket context

  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: authApi.logoutUser,
    onSuccess: (data) => {
      disconnectSocket(); // Disconnect socket before clearing token
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Clear token
      toast.success(data.message || "Logout Successful");
      queryClient.removeQueries({ queryKey: ["user"] });
      router.replace("/login");
    },
    onError: (error: TErrorResponse) => {
      disconnectSocket(); // Ensure socket is disconnected on error
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      toast.error(error.data.message || "Logout unsuccessful");
      console.log(error);
      router.replace("/login");
    },
  });

  return {
    logout,
    isLoading,
  };
};

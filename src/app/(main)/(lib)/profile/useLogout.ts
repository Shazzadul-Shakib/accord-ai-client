import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/tanstack/api-services/authApi";
import { toast } from "sonner";
import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();

  // logout user mutation
  const { mutate: logout, isPending: isLoading } = useMutation({
    mutationFn: authApi.logoutUser,
    onSuccess: (data) => {
      toast.success(data.message || "Logout Successful");
      router.replace("/login");
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message || "Logout unsuccessfull");
      console.log(error)
    },
  });

  return {
    logout,
    isLoading,
  };
};

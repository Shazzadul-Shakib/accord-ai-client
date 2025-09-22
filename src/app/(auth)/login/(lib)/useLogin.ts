import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TErrorResponse, TLoginFormValues } from "./loginSchema";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/tanstack/api-services/authApi";
import { toast } from "sonner";
import { useAuth } from "@/providers/auth-providers";

export const useLogin = () => {
  const { checkAuth } = useAuth();

  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: authApi.loginUser,
    onSuccess: async (data) => {
      // 1. Store the tokens
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // 2. Update auth context
      await checkAuth();

      // 3. Show success message
      toast.success(data.message || "Login Successful");

      // 4. Let AuthProvider handle the redirect automatically
      // Don't manually redirect here
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message || "Login unsuccessful");
    },
  });

  const handleAddDemoCredentials = () => {
    form.setValue("email", "astro@gmail.com");
    form.setValue("password", "123456");
  };

  const onLogin = form.handleSubmit((formData) => {
    login(formData);
  });

  return { form, handleAddDemoCredentials, onLogin, isLoading };
};

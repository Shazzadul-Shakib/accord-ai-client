import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TErrorResponse, TLoginFormValues } from "./loginSchema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/tanstack/api-services/authApi";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending: isLoading } = useMutation({
    mutationFn: authApi.loginUser,
    onSuccess: (data) => {
      toast.success(data.message || "Login Successful");
      router.replace("/");
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message || "Login unsuccessfull");
    },
  });

  const handleAddDemoCredentials = () => {
    form.setValue("email", "astro@gmail.com");
    form.setValue("password", "123456");
  };

  const onLogin = form.handleSubmit((formData) => {
    console.log(formData)
    login(formData);
  });

  return { form, handleAddDemoCredentials, onLogin, isLoading };
};

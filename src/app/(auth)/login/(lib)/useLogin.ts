import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TLoginFormValues } from "./loginSchema";
import { useMutation } from "@tanstack/react-query";
import { authQuery } from "@/tanstack/queryFunctions/authQuery";
import { useRouter } from "next/navigation";

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
    mutationFn: authQuery.loginUser,
    onSuccess: (data) => {
      console.log("Login successful:", data);
      // Handle success (e.g., redirect, show success message)
      router.replace("/");
    },
  });

  const handleAddDemoCredentials = () => {
    form.setValue("email", "demo@gmail.com");
    form.setValue("password", "123456");
  };

  const onLogin = form.handleSubmit((formData) => {
    const res = login(formData);
    console.log(res);
  });

  return { form, handleAddDemoCredentials, onLogin, isLoading };
};

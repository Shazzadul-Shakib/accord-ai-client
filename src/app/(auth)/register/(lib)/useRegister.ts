import { useForm } from "react-hook-form";
import { registerSchema, TRegisterFormValues } from "./register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/tanstack/api-services/authApi";
import { toast } from "sonner";
import { TErrorResponse } from "../../login/(lib)/loginSchema";

export const useRegister = () => {
  const router = useRouter();
  const form = useForm<TRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: register, isPending: isLoading } = useMutation({
    mutationFn: authApi.registerUser,
    onSuccess: (data) => {
      toast.success(data.message || "Registration Successful");
      router.replace("/login");
    },
    onError: (error: TErrorResponse) => {
      toast.error(error.data.message || "Registration unsuccessfull");
    },
  });

  const onRegister = form.handleSubmit((formData) => {
    register(formData);
  });

  return { form, onRegister, isLoading };
};

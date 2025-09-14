import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, TLoginFormValues } from "./loginSchema";

export const useLogin = () => {
  const form = useForm<TLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleAddDemoCredentials = () => {
    form.setValue("email", "demo@gmail.com");
    form.setValue("password", "123456");
  };

  const onLogin = form.handleSubmit(async (formData) => {
    const { email, password } = formData;
    console.log(email, password);
  });

  return { form, handleAddDemoCredentials, onLogin };
};

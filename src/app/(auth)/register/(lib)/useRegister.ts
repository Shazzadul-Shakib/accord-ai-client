import { useForm } from "react-hook-form";
import { registerSchema, TRegisterFormValues } from "./register-schema";
import { zodResolver } from "@hookform/resolvers/zod";
export const useRegister = () => {
  const form = useForm<TRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onRegister = form.handleSubmit(async (formData) => {
    const { name, email, password } = formData;
    console.log(name, email, password);
  });

  return { form, onRegister };
};

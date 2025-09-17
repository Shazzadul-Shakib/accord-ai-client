import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TUpdateProfileRequest, updateProfileSchema } from "./updateProfileSchema";

export const useUpdateProfile = () => {
  const form = useForm<TUpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const onUpdate = form.handleSubmit(async (formData) => {
    const { name, image } = formData;
    console.log(name, image);
  });

  return { form, onUpdate };
};


import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUpdateProfileRequest,
  updateProfileSchema,
} from "./updateProfileSchema";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/tanstack/api-services/authApi";
import { useForm } from "react-hook-form";

export const useProfile = () => {
  const form = useForm<TUpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  // get logged user query
  const {
    isPending: isLoggedUserLoading,
    data: loggedUser,
    isError: IsLoggedUserError,
    error: loggedUserError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: authApi.loggedUser,
  });

  const onUpdate = form.handleSubmit(async (formData) => {
    const { name, image } = formData;
    console.log(name, image);
  });

  return {
    form,
    onUpdate,
    isLoggedUserLoading,
    loggedUser,
    IsLoggedUserError,
    loggedUserError,
  };
};

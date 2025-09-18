import { zodResolver } from "@hookform/resolvers/zod";
import {
  TUpdateProfileRequest,
  updateProfileSchema,
} from "./updateProfileSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/tanstack/api-services/authApi";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import useGetImageUrl from "@/hooks/useGetImageUrl";
import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";
import { toast } from "sonner";

export const useProfile = (options?: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

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

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { getImageUrl } = useGetImageUrl();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const form = useForm<TUpdateProfileRequest>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: loggedUser?.data?.name || "",
      image: null,
    },
  });

  // ✅ Populate imagePreview with existing profile image from server
  useEffect(() => {
    if (loggedUser?.data?.image) {
      setImagePreview(loggedUser.data.image);
    }
  }, [loggedUser]);

  const { mutate: updateUser, isPending: isUpdating } = useMutation({
    mutationFn: authApi.updateUser,
    onSuccess: (data) => {
      toast.success(data.message || "Profile updated successfully");

      // ✅ refresh logged user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // ✅ close dialog if provided
      if (options?.onSuccess) {
        options.onSuccess();
      }
    },
    onError: (error: TErrorResponse) => {
      console.log(error);
      toast.error(error?.data?.message || "Profile update failed");
    },
  });

  const onUpdate = form.handleSubmit(async (formData) => {
    const { name, image } = formData;

    let imageUrl: string | null = null;

    if (image instanceof File) {
      imageUrl = await getImageUrl(image);
    } else if (loggedUser?.data?.image) {
      imageUrl = loggedUser.data.image;
    }

    const updatedData = { name, image: imageUrl };
    updateUser(updatedData);
  });

  return {
    form,
    onUpdate,
    isLoggedUserLoading,
    loggedUser,
    IsLoggedUserError,
    loggedUserError,
    handleImageChange,
    imagePreview,
    isUpdating,
  };
};

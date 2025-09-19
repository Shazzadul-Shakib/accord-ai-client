import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TAddTopicRequest, topicRequestSchema } from "./topicRequestSchema";
import { useMutation } from "@tanstack/react-query";
import { chatApi } from "@/tanstack/api-services/chatApi";
import { toast } from "sonner";
import { TErrorResponse } from "@/app/(auth)/login/(lib)/loginSchema";

export const useAddTopicRequest = (options?: { onSuccess?: () => void }) => {
  const form = useForm<TAddTopicRequest>({
    resolver: zodResolver(topicRequestSchema),
    defaultValues: {
      topic: "",
      members: [],
    },
  });

  const { mutate: addTopicRequest, isPending: isAddTopicRequestLoading } =
    useMutation({
      mutationFn: chatApi.addTopicRequest,
      onSuccess: (data) => {
        toast.success(data.message || "Topic Request Creation Successful");
        console.log(data);
        options?.onSuccess?.();
      },
      onError: (error: TErrorResponse) => {
        toast.error(
          error.data.message || "Topic Request Creation unsuccessfull",
        );
      },
    });

  const onRequest = form.handleSubmit((formData) => {
    addTopicRequest(formData);
  });

  return { form, onRequest, addTopicRequest, isAddTopicRequestLoading };
};

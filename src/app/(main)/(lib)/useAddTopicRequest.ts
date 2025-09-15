import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TAddTopicRequest, topicRequestSchema } from "./topicRequestSchema";

export const useAddTopicRequest = () => {
  const form = useForm<TAddTopicRequest>({
    resolver: zodResolver(topicRequestSchema),
    defaultValues: {
      topic: "",
      members: [],
    },
  });

  const onRequest = form.handleSubmit(async (formData) => {
    const { topic, members } = formData;
    console.log(topic, members);
  });

  return { form, onRequest };
};

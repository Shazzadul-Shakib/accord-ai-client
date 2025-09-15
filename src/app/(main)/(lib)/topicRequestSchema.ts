import z from "zod";

export const topicRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  members: z.array(z.string().min(24, "Invalid member ID")).min(1, "At least one member is required")
});

export type TAddTopicRequest = z.infer<typeof topicRequestSchema>;

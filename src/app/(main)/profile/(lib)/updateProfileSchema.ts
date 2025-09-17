import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.url("Invalid image URL").optional(),
});

export type TUpdateProfileRequest = z.infer<typeof updateProfileSchema>;

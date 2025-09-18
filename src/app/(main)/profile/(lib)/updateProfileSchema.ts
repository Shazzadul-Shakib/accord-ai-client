import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  image: z.union([
    z.instanceof(File).optional(),
    z.url().optional(),
    z.null(),
  ]),
});

export type TUpdateProfileRequest = z.infer<typeof updateProfileSchema>;

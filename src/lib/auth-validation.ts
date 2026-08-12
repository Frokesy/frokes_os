import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address.").transform(value => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(128),
});

export const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(2, "Tell us what to call you.").max(60),
});

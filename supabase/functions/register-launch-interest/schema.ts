import { z } from "npm:zod@3.23.8";

export const registrationSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().trim().max(255).email().transform((value) => value.toLowerCase()),
  consent: z.literal(true),
}).strict();
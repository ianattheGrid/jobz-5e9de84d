import * as z from "zod";

export const recommendationFormSchema = z.object({
  candidate_email: z.string().email("Invalid email address"),
  candidate_phone: z.string().optional(),
  job_id: z.number().optional(),
  notes: z.string().optional(),
});
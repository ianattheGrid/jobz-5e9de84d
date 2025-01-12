import * as z from "zod";

export const jobSearchSchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  hasCommission: z.boolean().default(false),
});

export type JobSearchSchema = z.infer<typeof jobSearchSchema>;
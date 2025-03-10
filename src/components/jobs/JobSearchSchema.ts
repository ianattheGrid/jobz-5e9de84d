
import * as z from "zod";

export const jobSearchSchema = z.object({
  workArea: z.string().optional(),
  specialization: z.string().optional(),
  title: z.string().optional(),
  otherWorkArea: z.string().optional(),
  location: z.array(z.string()).default([]),
  hasCommission: z.boolean().default(false),
});

export type JobSearchSchema = z.infer<typeof jobSearchSchema>;

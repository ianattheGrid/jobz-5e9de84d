import * as z from "zod";

export const jobSearchSchema = z.object({
  workArea: z.string().optional(),
  salary: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  includeCommission: z.boolean().default(false),
});

export type JobSearchValues = z.infer<typeof jobSearchSchema>;
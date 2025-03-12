
import * as z from "zod";

export const jobSearchSchema = z.object({
  workArea: z.string().optional(),
  specialization: z.string().optional(),
  title: z.string().optional(),
  otherWorkArea: z.string().optional(),
  location: z.array(z.string()).default([]),
  hasCommission: z.boolean().default(false),
  min_salary: z.number().optional(),
  max_salary: z.number().optional(),
  description: z.string().optional(),
  workLocation: z.enum(["office", "hybrid", "remote"]).optional(),
  holidayEntitlement: z.string().optional(),
  companyBenefits: z.string().optional(),
});

export type JobSearchSchema = z.infer<typeof jobSearchSchema>;

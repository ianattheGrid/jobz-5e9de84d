import * as z from "zod";

export const searchFormSchema = z.object({
  workArea: z.string({
    required_error: "Please select the area of work.",
  }),
  otherWorkArea: z.string().optional(),
  itSpecialization: z.string().optional(),
  title: z.string().optional(),
  location: z.array(z.string()).min(1, {
    message: "Please select at least one location",
  }),
  salary: z.string().min(1, {
    message: "Salary range is required",
  }),
  qualification: z.string().optional(),
  required_skills: z.array(z.string()).optional(),
  requiresSecurityClearance: z.boolean().optional(),
  securityClearanceLevel: z.string().optional(),
  signupPeriod: z.string().optional(),
  workEligibility: z.string().optional(),
  includeCommissionCandidates: z.boolean().default(false),
});
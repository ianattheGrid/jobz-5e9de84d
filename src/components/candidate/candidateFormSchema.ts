import * as z from "zod";

export const WorkType = z.enum(["remote", "hybrid", "office"]);
export type WorkType = z.infer<typeof WorkType>;

export const candidateFormSchema = z.object({
  workArea: z.string({
    required_error: "Please select your area of work.",
  }),
  otherWorkArea: z.string().optional(),
  itSpecialization: z.string().optional(),
  title: z.string().optional(),
  desired_job_title: z.string().optional(),
  desired_years_experience: z.string().optional(),
  wantsCareerChange: z.string().optional(),
  location: z.array(z.string()).min(1, {
    message: "Please select at least one location",
  }),
  salary: z.string().min(1, {
    message: "Please specify your salary expectations",
  }),
  availability: z.string().min(1, {
    message: "Please specify your availability",
  }),
  required_skills: z.array(z.string()).optional(),
  security_clearance: z.string().optional(),
  work_eligibility: z.string().optional(),
  years_experience: z.string().min(1, "Years of experience is required"),
  commission_percentage: z.number().min(0).max(100).optional(),
  open_to_commission: z.boolean().default(false),
  additional_skills: z.string().optional(),
  preferred_work_type: WorkType.default("office"),
});

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;
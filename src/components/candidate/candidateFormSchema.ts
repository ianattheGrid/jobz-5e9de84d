import * as z from "zod";

export const candidateFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  workArea: z.string({
    required_error: "Please select your area of work.",
  }),
  otherWorkArea: z.string().optional(),
  itSpecialization: z.string().optional(),
  title: z.string().optional(),
  desired_job_title: z.string().optional(),
  desired_years_experience: z.string().optional(),
  wantsCareerChange: z.string().optional(),
  min_salary: z.number({
    required_error: "Please specify your minimum salary expectation",
  }),
  max_salary: z.number({
    required_error: "Please specify your maximum salary expectation",
  }),
  availability: z.string().min(1, {
    message: "Please specify your availability",
  }),
  required_skills: z.array(z.string()).optional(),
  security_clearance: z.string().optional(),
  work_eligibility: z.string().optional(),
  years_experience: z.string().min(1, "Years of experience is required"),
  commission_percentage: z.number().min(2.5).max(14).nullable(),
  open_to_commission: z.boolean().default(false),
  additional_skills: z.string().optional(),
  preferred_work_type: z.string({
    required_error: "Please select your preferred work type",
  }),
  view_scheme: z.boolean().optional(),
}).refine((data) => data.max_salary >= data.min_salary, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["max_salary"],
});

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;
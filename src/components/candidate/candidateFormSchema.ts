
import * as z from "zod";

export const candidateFormSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  home_postcode: z.string().min(1, "Please select your home postcode"),
  location: z.array(z.string()).min(1, "Please select at least one work location"),
  workArea: z.string({
    required_error: "Please select your area of work.",
  }),
  job_title: z.union([z.string(), z.array(z.string())]).optional(),
  itSpecialization: z.string().optional(),
  otherWorkArea: z.string().optional(),
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
  work_preferences: z.string().min(1, {
    message: "Please specify your work preferences",
  }),
  required_skills: z.array(z.string()).optional(),
  security_clearance: z.string().optional(),
  security_clearance_level: z.string().optional(),
  work_eligibility: z.string().optional(),
  years_experience: z.coerce.number().min(0, "Years of experience is required"),
  years_in_current_title: z.number().min(0, "Please specify your years of experience in current role"),
  titleExperience: z.record(z.string(), z.number()).optional(),
  commission_percentage: z.number().min(2.5).max(14).nullable(),
  open_to_commission: z.boolean().default(false),
  additional_skills: z.string().optional(),
  view_scheme: z.boolean().optional(),
  current_employer: z.string().optional(),
  job_seeking_reasons: z.array(z.string()).default([]),
  other_job_seeking_reason: z.string().optional(),
  linkedin_url: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal('')),
  hasQualification: z.boolean().default(false),
  qualificationDetails: z.string().optional(),
  qualifications: z.string().optional(),
}).refine((data) => data.max_salary >= data.min_salary, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["max_salary"],
});

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;

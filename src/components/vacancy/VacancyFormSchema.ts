import { z } from "zod";

export const vacancyFormSchema = z.object({
  workArea: z.string({
    required_error: "Please select the area of work for this vacancy.",
  }),
  itSpecialization: z.string().optional(),
  specialization: z.string().optional(),
  title: z.string().optional(),
  otherWorkArea: z.string().optional(),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string()
    .min(10, {
      message: "Job description must be at least 10 characters.",
    })
    .max(2000, {
      message: "Job description cannot exceed 2000 characters.",
    }),
  salary: z.string().min(1, {
    message: "Salary is required",
  }),
  actualSalary: z.string().min(1, {
    message: "Salary for bonus purposes is required",
  }),
  workLocation: z.enum(["office", "hybrid", "remote"]).default("office"),
  officePercentage: z.number().min(0).max(100).optional(),
  type: z.literal("Full-time"),
  holidayEntitlement: z.string().min(1, {
    message: "Holiday entitlement is required",
  }),
  companyBenefits: z.string().min(1, {
    message: "Company benefits are required",
  }),
  otherBenefits: z.string().optional(),
  applicationMethod: z.enum(["platform", "email", "custom"]).default("platform"),
  applicationEmail: z.string().email().optional().or(z.literal("")),
  applicationInstructions: z.string().optional().or(z.literal("")),
  offerCandidateCommission: z.boolean().default(false),
  offerReferralCommission: z.boolean().default(false),
  candidateCommission: z.string().optional(),
  referralCommission: z.string().optional(),
  matchThreshold: z.number()
    .min(0, "Match threshold must be at least 0%")
    .max(100, "Match threshold cannot exceed 100%")
    .default(60),
  titleEssential: z.boolean().default(false),
  yearsExperienceEssential: z.boolean().default(false),
  minYearsExperience: z.number().min(0).default(0),
  salaryEssential: z.boolean().default(false),
  skillsEssential: z.boolean().default(false),
  qualificationEssential: z.boolean().default(false),
  citizenshipEssential: z.boolean().default(false),
  requiredCitizenship: z.string().default("UK citizens only"),
  min_years_in_title: z.number().min(0).default(0),
});

export type VacancyFormValues = z.infer<typeof vacancyFormSchema>;

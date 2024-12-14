import * as z from "zod";

export const searchFormSchema = z.object({
  workArea: z.string({
    required_error: "Please select the area of work.",
  }),
  otherWorkArea: z.string().optional(),
  itSpecialization: z.string().optional(),
  title: z.string().optional(),
  location: z.string(),
  salary: z.string().min(1, {
    message: "Salary range is required",
  }),
});
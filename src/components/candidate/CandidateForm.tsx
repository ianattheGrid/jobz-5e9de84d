import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import SalaryRangeField from "@/components/SalaryRangeField";
import ITSkillsField from "@/components/job-details/ITSkillsField";
import SecurityClearanceFields from "@/components/job-details/SecurityClearanceFields";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";

const candidateFormSchema = z.object({
  workArea: z.string({
    required_error: "Please select your area of work.",
  }),
  otherWorkArea: z.string().optional(),
  itSpecialization: z.string().optional(),
  title: z.string().optional(),
  location: z.array(z.string()).min(1, {
    message: "Please select at least one location",
  }),
  salary: z.string().min(1, {
    message: "Please specify your salary expectations",
  }),
  required_skills: z.array(z.string()).optional(),
  security_clearance: z.string().optional(),
  work_eligibility: z.string().optional(),
  commission_percentage: z.number().optional(),
});

type CandidateFormValues = z.infer<typeof candidateFormSchema>;

export function CandidateForm() {
  const { toast } = useToast();

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      location: [],
      required_skills: [],
      security_clearance: undefined,
      work_eligibility: undefined,
    },
  });

  const onSubmit = async (values: CandidateFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be signed in to create a profile.",
        });
        return;
      }

      const [minSalary, maxSalary] = values.salary.split("-").map(s => parseInt(s.trim()));

      const { error } = await supabase.from('candidate_profiles').upsert({
        id: session.user.id,
        job_title: values.title || values.workArea,
        location: values.location[0], // Using first selected location
        min_salary: minSalary,
        max_salary: maxSalary,
        required_skills: values.required_skills,
        security_clearance: values.security_clearance,
        work_eligibility: values.work_eligibility,
        commission_percentage: values.commission_percentage,
        years_experience: 0, // This should be added to the form later
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <WorkAreaField control={form.control} />
        <LocationField control={form.control} />
        <SalaryRangeField control={form.control} />
        <ITSkillsField control={form.control} />
        <SecurityClearanceFields control={form.control} />
        <WorkEligibilityField control={form.control} />
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900 text-white">
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
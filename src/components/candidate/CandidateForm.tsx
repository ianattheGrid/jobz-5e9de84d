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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

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
  years_experience: z.string().min(1, "Years of experience is required"),
  commission_percentage: z.number().min(0).max(100).optional(),
  open_to_commission: z.boolean().default(false),
  additional_skills: z.string().optional(),
  preferred_work_type: z.enum(["remote", "hybrid", "office"]).optional(),
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
      open_to_commission: false,
      preferred_work_type: "office",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        form.reset({
          workArea: profile.job_title,
          location: [profile.location],
          salary: `${profile.min_salary}-${profile.max_salary}`,
          required_skills: profile.required_skills || [],
          security_clearance: profile.security_clearance,
          work_eligibility: profile.work_eligibility,
          years_experience: profile.years_experience.toString(),
          commission_percentage: profile.commission_percentage,
          open_to_commission: profile.commission_percentage !== null,
          preferred_work_type: profile.preferred_work_type || "office",
        });
      }
    };

    loadProfile();
  }, [form]);

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

      const [minSalary, maxSalary] = values.salary.split("-").map(s => 
        parseInt(s.replace(/[^0-9]/g, ''))
      );

      const { error } = await supabase.from('candidate_profiles').upsert({
        id: session.user.id,
        job_title: values.title || values.workArea,
        location: values.location[0],
        min_salary: minSalary,
        max_salary: maxSalary,
        required_skills: values.required_skills,
        security_clearance: values.security_clearance,
        work_eligibility: values.work_eligibility,
        years_experience: parseInt(values.years_experience),
        commission_percentage: values.open_to_commission ? values.commission_percentage : null,
        preferred_work_type: values.preferred_work_type,
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
        
        <FormField
          control={form.control}
          name="years_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input type="number" min="0" max="50" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferred_work_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Work Type</FormLabel>
              <FormControl>
                <select
                  className="w-full p-2 border rounded"
                  {...field}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="office">Office-based</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ITSkillsField control={form.control} />
        
        <FormField
          control={form.control}
          name="additional_skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Skills or Certifications</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g., AWS Certified, Scrum Master, etc." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SecurityClearanceFields control={form.control} />
        <WorkEligibilityField control={form.control} />

        <FormField
          control={form.control}
          name="open_to_commission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Open to Commission-Based Roles</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {form.watch("open_to_commission") && (
          <FormField
            control={form.control}
            name="commission_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Commission Percentage</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900 text-white">
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
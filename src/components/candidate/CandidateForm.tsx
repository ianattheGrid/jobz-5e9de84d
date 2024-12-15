import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import WorkAreaField from "@/components/WorkAreaField";
import LocationField from "@/components/LocationField";
import SalaryRangeField from "@/components/SalaryRangeField";
import SecurityClearanceFields from "@/components/job-details/SecurityClearanceFields";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import { useEffect } from "react";
import { candidateFormSchema, type CandidateFormValues, type WorkType } from "./candidateFormSchema";
import WorkPreferences from "./sections/WorkPreferences";
import CommissionPreferences from "./sections/CommissionPreferences";
import SkillsSection from "./sections/SkillsSection";

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
          preferred_work_type: (profile.preferred_work_type as WorkType) || "office",
          additional_skills: profile.additional_skills || "",
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
        additional_skills: values.additional_skills,
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
        
        <WorkPreferences control={form.control} />
        <SkillsSection control={form.control} />
        
        <SecurityClearanceFields control={form.control} />
        <WorkEligibilityField control={form.control} />

        <CommissionPreferences control={form.control} />
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-red-800 hover:bg-red-900 text-white">
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
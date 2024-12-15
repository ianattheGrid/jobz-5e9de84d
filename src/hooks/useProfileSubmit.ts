import { type ToastProps } from "@/components/ui/toast";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { supabase } from "@/integrations/supabase/client";

export const useProfileSubmit = (toast: (props: ToastProps) => void) => {
  const onSubmit = async (values: CandidateFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [minSalary, maxSalary] = values.salary.split('-').map(Number);

      const { error } = await supabase
        .from('candidate_profiles')
        .upsert({
          id: session.user.id,
          job_title: values.workArea,
          location: Array.isArray(values.location) ? values.location[0] : values.location,
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
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return { onSubmit };
};
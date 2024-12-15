import { toast } from "@/components/ui/use-toast";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { supabase } from "@/integrations/supabase/client";

type ToastFunction = typeof toast;

export const useProfileSubmit = (toast: ToastFunction) => {
  const onSubmit = async (values: CandidateFormValues) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update your profile"
        });
        return;
      }

      const [minSalary, maxSalary] = values.salary.split('-').map(Number);

      const { error } = await supabase
        .from('candidate_profiles')
        .upsert({
          id: session.user.id,
          job_title: values.workArea,
          years_experience: parseInt(values.years_experience),
          location: values.location[0],
          min_salary: minSalary,
          max_salary: maxSalary,
          required_skills: values.required_skills,
          security_clearance: values.security_clearance,
          work_eligibility: values.work_eligibility,
          commission_percentage: values.commission_percentage,
          preferred_work_type: values.preferred_work_type,
          additional_skills: values.additional_skills,
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to update profile. Please try again."
        });
        return;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred"
      });
    }
  };

  return { onSubmit };
};
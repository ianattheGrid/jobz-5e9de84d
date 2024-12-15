import { supabase } from '@/integrations/supabase/client';
import { UseToastReturn } from '@/components/ui/use-toast';
import { CandidateFormValues } from '@/components/candidate/candidateFormSchema';

export const useProfileSubmit = (toast: UseToastReturn['toast']) => {
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

  return { onSubmit };
};
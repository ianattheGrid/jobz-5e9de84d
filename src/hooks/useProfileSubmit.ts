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

      console.log("Submitting profile data:", values);

      const { error } = await supabase
        .from('candidate_profiles')
        .upsert({
          id: session.user.id,
          full_name: values.full_name,
          email: values.email,
          phone_number: values.phone_number,
          address: values.address,
          job_title: values.workArea,
          years_experience: values.years_experience ? parseInt(values.years_experience) : 0,
          location: values.location,
          min_salary: values.min_salary,
          max_salary: values.max_salary,
          required_skills: values.required_skills,
          security_clearance: values.security_clearance,
          work_eligibility: values.work_eligibility,
          commission_percentage: values.open_to_commission ? values.commission_percentage : null,
          additional_skills: values.additional_skills,
          availability: values.availability,
          work_preferences: values.work_preferences,
          current_employer: values.current_employer,
          travel_radius: values.travel_radius,
          linkedin_url: values.linkedin_url,
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update profile. Please try again."
        });
        return;
      }

      console.log('Profile updated successfully');
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating your profile"
      });
    }
  };

  return { onSubmit };
};
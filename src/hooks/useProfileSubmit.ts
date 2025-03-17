
import { toast } from "@/components/ui/use-toast";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type ToastFunction = typeof toast;

export const useProfileSubmit = (toast: ToastFunction) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: CandidateFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting values:", values);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update your profile"
        });
        setIsSubmitting(false);
        return false;
      }

      // Ensure all values are properly handled before sending to the server
      const profileData = {
        id: session.user.id,
        full_name: typeof values.full_name === 'string' ? values.full_name : '',
        email: typeof values.email === 'string' ? values.email : '',
        phone_number: typeof values.phone_number === 'string' ? values.phone_number : '',
        address: typeof values.address === 'string' ? values.address : '',
        home_postcode: typeof values.home_postcode === 'string' ? values.home_postcode : '',
        location: Array.isArray(values.location) ? values.location : [],
        job_title: typeof values.workArea === 'string' ? values.workArea : '',
        years_experience: values.years_experience ? parseInt(String(values.years_experience)) : 0,
        min_salary: typeof values.min_salary === 'number' ? values.min_salary : 0,
        max_salary: typeof values.max_salary === 'number' ? values.max_salary : 0,
        required_skills: Array.isArray(values.required_skills) ? values.required_skills : [],
        required_qualifications: values.qualifications
          ? String(values.qualifications).split(',').map(q => q.trim()).filter(Boolean)
          : [],
        security_clearance: values.security_clearance === 'yes' ? values.security_clearance_level : null,
        work_eligibility: typeof values.work_eligibility === 'string' ? values.work_eligibility : '',
        commission_percentage: values.open_to_commission ? values.commission_percentage : null,
        additional_skills: typeof values.additional_skills === 'string' ? values.additional_skills : '',
        availability: typeof values.availability === 'string' ? values.availability : '',
        work_preferences: typeof values.work_preferences === 'string' ? values.work_preferences : '',
        current_employer: typeof values.current_employer === 'string' ? values.current_employer : '',
        linkedin_url: typeof values.linkedin_url === 'string' ? values.linkedin_url : '',
        years_in_current_title: typeof values.years_in_current_title === 'number' 
          ? values.years_in_current_title 
          : 0,
      };
      
      console.log("Final profile data to save:", profileData);

      const { error } = await supabase
        .from('candidate_profiles')
        .upsert(profileData, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update profile. Please try again."
        });
        setIsSubmitting(false);
        return false;
      }

      console.log('Profile updated successfully with name:', profileData.full_name);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      setIsSubmitting(false);
      return true;
      
    } catch (error: any) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while updating your profile"
      });
      setIsSubmitting(false);
      return false;
    }
  };

  return { onSubmit, isSubmitting };
};

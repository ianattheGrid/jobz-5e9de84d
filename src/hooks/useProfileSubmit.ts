
import { toast } from "@/components/ui/use-toast";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type ToastFunction = typeof toast;

export const useProfileSubmit = (toast: ToastFunction) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: CandidateFormValues) => {
    setIsSubmitting(true);
    
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

      console.log("Submitting profile data:", values);

      // Parse qualifications from comma-separated string to array
      const qualifications = values.qualifications
        ? values.qualifications.split(',').map(q => q.trim()).filter(Boolean)
        : [];

      // Validate required fields before submission
      if (!values.full_name || values.full_name.trim() === '') {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Full name is required"
        });
        setIsSubmitting(false);
        return false;
      }

      // Ensure numeric fields are properly converted
      const yearsExperience = values.years_experience ? parseInt(values.years_experience) : 0;
      const yearsInCurrentTitle = typeof values.years_in_current_title === 'number' 
        ? values.years_in_current_title 
        : 0;

      const { error } = await supabase
        .from('candidate_profiles')
        .upsert({
          id: session.user.id,
          full_name: values.full_name,
          email: values.email,
          phone_number: values.phone_number,
          address: values.address,
          home_postcode: values.home_postcode,
          location: values.location,
          job_title: values.workArea,
          years_experience: yearsExperience,
          min_salary: values.min_salary,
          max_salary: values.max_salary,
          required_skills: values.required_skills || [],
          required_qualifications: qualifications,
          security_clearance: values.security_clearance === 'yes' ? values.security_clearance_level : null,
          work_eligibility: values.work_eligibility,
          commission_percentage: values.open_to_commission ? values.commission_percentage : null,
          additional_skills: values.additional_skills,
          availability: values.availability,
          work_preferences: values.work_preferences,
          current_employer: values.current_employer,
          linkedin_url: values.linkedin_url,
          years_in_current_title: yearsInCurrentTitle,
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
        setIsSubmitting(false);
        return false;
      }

      console.log('Profile updated successfully');
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

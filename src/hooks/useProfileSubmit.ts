
import { toast } from "@/components/ui/use-toast";
import { CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

type ToastFunction = typeof toast;

export const useProfileSubmit = (toast: ToastFunction) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: CandidateFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting form values:", values);
    
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

      // Debug actual values being received
      console.log("Full name:", values.full_name, "Type:", typeof values.full_name);
      console.log("Email:", values.email, "Type:", typeof values.email);
      console.log("Phone:", values.phone_number, "Type:", typeof values.phone_number);

      // Process all values to ensure proper types before submission
      const profileData = {
        id: session.user.id,
        full_name: values.full_name ? String(values.full_name) : '',
        email: values.email ? String(values.email) : '',
        phone_number: values.phone_number ? String(values.phone_number) : '',
        address: values.address ? String(values.address) : '',
        home_postcode: values.home_postcode ? String(values.home_postcode) : '',
        location: Array.isArray(values.location) ? values.location : [],
        job_title: values.workArea ? String(values.workArea) : '',
        years_experience: values.years_experience ? Number(values.years_experience) : 0,
        min_salary: typeof values.min_salary === 'number' ? values.min_salary : 0,
        max_salary: typeof values.max_salary === 'number' ? values.max_salary : 0,
        required_skills: Array.isArray(values.required_skills) ? values.required_skills : [],
        required_qualifications: values.qualifications
          ? String(values.qualifications).split(',').map(q => q.trim()).filter(Boolean)
          : [],
        security_clearance: values.security_clearance === 'yes' ? values.security_clearance_level : null,
        work_eligibility: values.work_eligibility ? String(values.work_eligibility) : '',
        commission_percentage: values.open_to_commission ? values.commission_percentage : null,
        additional_skills: values.additional_skills ? String(values.additional_skills) : '',
        availability: values.availability ? String(values.availability) : '',
        work_preferences: values.work_preferences ? String(values.work_preferences) : '',
        current_employer: values.current_employer ? String(values.current_employer) : '',
        linkedin_url: values.linkedin_url ? String(values.linkedin_url) : '',
        years_in_current_title: typeof values.years_in_current_title === 'number' 
          ? values.years_in_current_title 
          : 0,
      };
      
      console.log("Final profile data to save:", profileData);

      // Perform the database update
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

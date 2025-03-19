
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

      // Ensure all string values are properly handled
      const cleanStringValue = (value: any): string => {
        return value !== null && value !== undefined ? String(value) : '';
      };

      // Prepare profile data with correct types
      const profileData = {
        id: session.user.id,
        full_name: cleanStringValue(values.full_name),
        email: cleanStringValue(values.email),
        phone_number: cleanStringValue(values.phone_number),
        address: cleanStringValue(values.address),
        home_postcode: cleanStringValue(values.home_postcode),
        location: Array.isArray(values.location) ? values.location : [],
        job_title: values.job_title || cleanStringValue(values.workArea),
        years_experience: values.years_experience ? Number(values.years_experience) : 0,
        min_salary: typeof values.min_salary === 'number' ? values.min_salary : 0,
        max_salary: typeof values.max_salary === 'number' ? values.max_salary : 0,
        required_skills: Array.isArray(values.required_skills) ? values.required_skills : [],
        required_qualifications: values.qualifications
          ? String(values.qualifications).split(',').map(q => q.trim()).filter(Boolean)
          : [],
        security_clearance: values.security_clearance === 'yes' ? values.security_clearance_level : null,
        work_eligibility: cleanStringValue(values.work_eligibility),
        commission_percentage: values.open_to_commission ? values.commission_percentage : null,
        additional_skills: cleanStringValue(values.additional_skills),
        availability: cleanStringValue(values.availability),
        work_preferences: cleanStringValue(values.work_preferences),
        current_employer: cleanStringValue(values.current_employer),
        linkedin_url: cleanStringValue(values.linkedin_url),
        years_in_current_title: values.years_in_current_title !== undefined ? Number(values.years_in_current_title) : 0,
        workArea: cleanStringValue(values.workArea),
        itSpecialization: cleanStringValue(values.itSpecialization)
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

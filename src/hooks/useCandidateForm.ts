
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { candidateFormSchema, type CandidateFormValues } from "@/components/candidate/candidateFormSchema";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type CandidateProfile = Database['public']['Tables']['candidate_profiles']['Row'];

export const useCandidateForm = () => {
  const { toast } = useToast();
  const [formUpdated, setFormUpdated] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Define complete default values for all form fields
  const defaultFormValues: CandidateFormValues = {
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    home_postcode: "",
    location: [],
    workArea: "",
    min_salary: 0,
    max_salary: 0,
    required_skills: [],
    security_clearance: undefined,
    work_eligibility: "UK citizens only",
    years_experience: "",
    commission_percentage: null,
    open_to_commission: false,
    additional_skills: "",
    availability: "Immediate",
    work_preferences: "",
    current_employer: "",
    job_seeking_reasons: [],
    other_job_seeking_reason: "",
    linkedin_url: "",
    years_in_current_title: 0,
  };

  // Initialize form with default values
  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    mode: "onChange",
    defaultValues: defaultFormValues
  });

  const { onSubmit, isSubmitting } = useProfileSubmit(toast);

  const handleSubmit = async (values: CandidateFormValues) => {
    console.log("Form submitted with values:", values);
    
    const success = await onSubmit(values);
    
    if (success) {
      setFormUpdated(false);
      toast({
        title: "Success",
        description: "Your profile has been updated successfully"
      });
    }
  };

  // Track form changes
  useEffect(() => {
    if (!profileLoaded) return;
    
    const subscription = form.watch(() => {
      setFormUpdated(true);
    });
    return () => subscription.unsubscribe();
  }, [form, profileLoaded]);

  // LoadProfile callback
  const loadProfileData = (profile: CandidateProfile | null) => {
    if (!profile) {
      console.log("No profile data received, using defaults");
      setProfileLoaded(true);
      return;
    }
    
    try {
      console.log("Loading profile data:", profile);
      
      // Prepare form data with nullish coalescing to ensure proper value types
      const formData: CandidateFormValues = {
        full_name: profile.full_name ?? "",
        email: profile.email ?? "",
        phone_number: profile.phone_number ?? "",
        address: profile.address ?? "",
        home_postcode: profile.home_postcode ?? "",
        location: Array.isArray(profile.location) ? profile.location : [],
        workArea: profile.job_title ?? "",
        min_salary: typeof profile.min_salary === 'number' ? profile.min_salary : 0,
        max_salary: typeof profile.max_salary === 'number' ? profile.max_salary : 0,
        required_skills: Array.isArray(profile.required_skills) ? profile.required_skills : [],
        qualifications: Array.isArray(profile.required_qualifications) ? profile.required_qualifications.join(', ') : "",
        security_clearance: profile.security_clearance ? "yes" : "no",
        work_eligibility: profile.work_eligibility ?? "UK citizens only",
        years_experience: profile.years_experience?.toString() ?? "",
        commission_percentage: profile.commission_percentage ?? null,
        open_to_commission: profile.commission_percentage !== null,
        additional_skills: profile.additional_skills ?? "",
        availability: profile.availability ?? "Immediate",
        work_preferences: profile.work_preferences ?? "",
        current_employer: profile.current_employer ?? "",
        job_seeking_reasons: [],
        other_job_seeking_reason: "",
        linkedin_url: profile.linkedin_url ?? "",
        years_in_current_title: typeof profile.years_in_current_title === 'number' ? profile.years_in_current_title : 0,
      };

      console.log("Setting form data:", formData);
      
      // Set all form values individually to ensure proper updates
      setProfileLoaded(true);
      form.reset(formData);
      setFormUpdated(false);
    } catch (error) {
      console.error("Error setting form data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load your profile data. Please refresh the page."
      });
      setProfileLoaded(true);
    }
  };

  // Use the profile data hook
  useProfileData(loadProfileData);

  return {
    form,
    handleSubmit,
    isSubmitting
  };
};

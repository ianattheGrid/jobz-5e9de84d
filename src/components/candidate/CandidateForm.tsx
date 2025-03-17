import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import AvailabilityField from "@/components/AvailabilityField";
import WorkPreferencesField from "@/components/WorkPreferencesField";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import { candidateFormSchema, type CandidateFormValues } from "./candidateFormSchema";
import CommissionPreferences from "./sections/CommissionPreferences";
import SkillsSection from "./sections/SkillsSection";
import ContactInformation from "./sections/ContactInformation";
import JobSeekingMotivation from "./sections/JobSeekingMotivation";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type CandidateProfile = Database['public']['Tables']['candidate_profiles']['Row'];

export function CandidateForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    mode: "onChange",
    defaultValues: {
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
    }
  });

  const { onSubmit } = useProfileSubmit(toast);

  const handleSubmit = async (values: CandidateFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  useProfileData((profile: CandidateProfile | null) => {
    if (!profile) return;
    
    const formData: CandidateFormValues = {
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone_number: profile.phone_number || "",
      address: profile.address || "",
      home_postcode: profile.home_postcode || "",
      location: profile.location || [],
      workArea: profile.job_title || "",
      min_salary: profile.min_salary || 0,
      max_salary: profile.max_salary || 0,
      required_skills: profile.required_skills || [],
      qualifications: profile.required_qualifications?.join(', ') || "",
      security_clearance: profile.security_clearance ? "yes" : "no",
      security_clearance_level: profile.security_clearance || undefined,
      work_eligibility: profile.work_eligibility || "UK citizens only",
      years_experience: profile.years_experience?.toString() || "",
      commission_percentage: profile.commission_percentage || null,
      open_to_commission: profile.commission_percentage !== null,
      additional_skills: profile.additional_skills || "",
      availability: profile.availability || "Immediate",
      work_preferences: profile.work_preferences || "",
      current_employer: profile.current_employer || "",
      job_seeking_reasons: [],
      other_job_seeking_reason: "",
      linkedin_url: profile.linkedin_url || "",
      years_in_current_title: profile.years_in_current_title || undefined,
    };

    console.log("Setting form data from profile:", formData);
    
    form.reset(formData);
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full max-w-2xl">
        <div className="space-y-8">
          <div className="text-left">
            <ContactInformation control={form.control} />
          </div>
          <div className="text-left">
            <WorkAreaField control={form.control} />
          </div>
          <div className="text-left">
            <SalaryRangeField control={form.control} />
          </div>
          <div className="text-left">
            <AvailabilityField control={form.control} />
          </div>
          <div className="text-left">
            <WorkPreferencesField control={form.control} />
          </div>
          <div className="text-left">
            <JobSeekingMotivation control={form.control} />
          </div>
          <div className="text-left">
            <SkillsSection control={form.control} />
          </div>
          <div className="text-left">
            <WorkEligibilityField control={form.control} />
          </div>
          <div className="text-left">
            <CommissionPreferences control={form.control} />
          </div>
        </div>
        
        <div className="flex justify-start">
          <Button 
            type="submit" 
            style={{ backgroundColor: "#FF69B4", color: "white" }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : "Update Profile"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

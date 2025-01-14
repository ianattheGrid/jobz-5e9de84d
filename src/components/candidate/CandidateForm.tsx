import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import AvailabilityField from "@/components/AvailabilityField";
import WorkPreferencesField from "@/components/WorkPreferencesField";
import SecurityClearanceFields from "@/components/job-details/SecurityClearanceFields";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import { candidateFormSchema, type CandidateFormValues } from "./candidateFormSchema";
import CommissionPreferences from "./sections/CommissionPreferences";
import SkillsSection from "./sections/SkillsSection";
import ContactInformation from "./sections/ContactInformation";
import JobSeekingMotivation from "./sections/JobSeekingMotivation";
import { useProfileData } from "@/hooks/useProfileData";
import { useProfileSubmit } from "@/hooks/useProfileSubmit";

export function CandidateForm() {
  const { toast } = useToast();

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateFormSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      location: "Bristol",
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
      travel_radius: 10,
      job_seeking_reasons: [],
      other_job_seeking_reason: "",
      title: "",
      desired_job_title: "",
      desired_years_experience: "",
      wantsCareerChange: "",
      otherWorkArea: "",
      itSpecialization: "",
      view_scheme: false
    }
  });

  useProfileData((data) => {
    if (!data) return;
    console.log("Setting form data:", data);
    
    form.reset({
      full_name: data.full_name || "",
      email: data.email || "",
      phone_number: data.phone_number || "",
      address: data.address || "",
      location: data.location || "Bristol",
      workArea: data.workArea || "",
      min_salary: data.min_salary || 0,
      max_salary: data.max_salary || 0,
      required_skills: data.required_skills || [],
      security_clearance: data.security_clearance,
      work_eligibility: data.work_eligibility || "UK citizens only",
      years_experience: data.years_experience?.toString() || "",
      commission_percentage: data.commission_percentage,
      open_to_commission: data.commission_percentage !== null,
      additional_skills: data.additional_skills || "",
      availability: data.availability || "Immediate",
      work_preferences: data.work_preferences || "",
      current_employer: data.current_employer || "",
      travel_radius: data.travel_radius || 10,
      job_seeking_reasons: [],
      other_job_seeking_reason: "",
      title: "",
      desired_job_title: data.desired_job_title || "",
      desired_years_experience: "",
      wantsCareerChange: "",
      otherWorkArea: "",
      itSpecialization: "",
      view_scheme: false
    });
  });
  
  const { onSubmit } = useProfileSubmit(toast);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl">
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
            <SecurityClearanceFields control={form.control} />
          </div>
          <div className="text-left">
            <WorkEligibilityField control={form.control} />
          </div>
          <div className="text-left">
            <CommissionPreferences control={form.control} />
          </div>
        </div>
        
        <div className="flex justify-start">
          <Button type="submit" className="bg-primary hover:bg-primary-dark text-white">
            Update Profile
          </Button>
        </div>
      </form>
    </Form>
  );
}
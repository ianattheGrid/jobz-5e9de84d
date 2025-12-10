import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle } from "@/components/ui/glow-card";
import { Loader2, Save, Sparkles } from "lucide-react";
import WorkAreaField from "@/components/WorkAreaField";
import SalaryRangeField from "@/components/SalaryRangeField";
import AvailabilityField from "@/components/AvailabilityField";
import WorkPreferencesField from "@/components/WorkPreferencesField";
import WorkEligibilityField from "@/components/job-details/WorkEligibilityField";
import JobSeekingMotivation from "@/components/candidate/sections/JobSeekingMotivation";
import ExperienceLevelField from "@/components/ExperienceLevelField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const workPreferencesSchema = z.object({
  experience_level: z.string().optional(),
  workArea: z.string().min(1, "Please select your area of work"),
  job_title: z.union([z.string(), z.array(z.string())]).optional(),
  itSpecialization: z.string().optional(),
  min_salary: z.number().min(0, "Minimum salary is required"),
  max_salary: z.number().min(0, "Maximum salary is required"),
  availability: z.string().min(1, "Please specify your availability"),
  work_preferences: z.string().min(1, "Please specify your work preferences"),
  work_eligibility: z.string().optional(),
  location: z.array(z.string()).optional(),
  job_seeking_reasons: z.array(z.string()).optional(),
  other_job_seeking_reason: z.string().optional(),
  open_to_apprenticeships: z.boolean().optional(),
}).refine((data) => data.max_salary >= data.min_salary, {
  message: "Maximum salary must be greater than or equal to minimum salary",
  path: ["max_salary"],
});

type WorkPreferencesFormValues = z.infer<typeof workPreferencesSchema>;

interface WorkPreferencesSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function WorkPreferencesSection({ userId, profileData, onSave }: WorkPreferencesSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parse job_title from profile
  let jobTitles: string[] = [];
  if (profileData?.job_title) {
    if (typeof profileData.job_title === 'string') {
      try {
        const parsed = JSON.parse(profileData.job_title);
        jobTitles = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        jobTitles = [profileData.job_title];
      }
    } else if (Array.isArray(profileData.job_title)) {
      jobTitles = profileData.job_title;
    }
  }

  const form = useForm<WorkPreferencesFormValues>({
    resolver: zodResolver(workPreferencesSchema),
    defaultValues: {
      experience_level: (profileData as any)?.experience_level || "",
      workArea: profileData?.workArea || "",
      job_title: jobTitles,
      itSpecialization: profileData?.itSpecialization || "",
      min_salary: profileData?.min_salary || 0,
      max_salary: profileData?.max_salary || 0,
      availability: profileData?.availability || "Immediate",
      work_preferences: profileData?.work_preferences || "",
      work_eligibility: profileData?.work_eligibility || "UK citizens only",
      location: profileData?.location || [],
      job_seeking_reasons: [],
      other_job_seeking_reason: "",
      open_to_apprenticeships: (profileData as any)?.open_to_apprenticeships || false,
    },
  });

  // Watch experience level for conditional rendering
  const experienceLevel = useWatch({
    control: form.control,
    name: "experience_level",
  });

  const handleSubmit = async (values: WorkPreferencesFormValues) => {
    setIsSubmitting(true);
    try {
      // Process job_title
      let jobTitleValue = values.job_title;
      if (!Array.isArray(jobTitleValue) && jobTitleValue) {
        jobTitleValue = [jobTitleValue];
      }

      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          experience_level: values.experience_level || null,
          workArea: values.workArea,
          job_title: JSON.stringify(jobTitleValue || []),
          itSpecialization: values.itSpecialization || null,
          min_salary: values.min_salary,
          max_salary: values.max_salary,
          availability: values.availability,
          work_preferences: values.work_preferences,
          work_eligibility: values.work_eligibility || null,
          location: values.location || [],
          open_to_apprenticeships: values.open_to_apprenticeships || false,
        } as any)
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "Work preferences saved" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlowCard>
      <GlowCardHeader>
        <GlowCardTitle>Work Preferences</GlowCardTitle>
      </GlowCardHeader>
      <GlowCardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <ExperienceLevelField control={form.control} />
            
            {experienceLevel === "entry" && (
              <Alert className="border-primary/30 bg-primary/5">
                <Sparkles className="h-4 w-4 text-primary" />
                <AlertTitle className="text-primary">First job? You're in the right place!</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Don't worry about years of experience - we help match you based on your potential, 
                  personality, and eagerness to learn. Make sure to complete the <strong>"Proof of Potential"</strong> section 
                  to showcase your school achievements, volunteer work, hobbies, and interests!
                </AlertDescription>
              </Alert>
            )}

            <WorkAreaField control={form.control} />
            <SalaryRangeField control={form.control} />
            <AvailabilityField control={form.control} />
            <WorkPreferencesField control={form.control} />
            <WorkEligibilityField control={form.control} />
            <JobSeekingMotivation control={form.control} />

            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Work Preferences
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </GlowCardContent>
    </GlowCard>
  );
}

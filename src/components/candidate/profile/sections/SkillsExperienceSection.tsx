import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CandidateProfile } from "@/integrations/supabase/types/profiles";
import { GlowCard, GlowCardContent, GlowCardHeader, GlowCardTitle, GlowCardDescription } from "@/components/ui/glow-card";
import { Loader2, Save, FolderOpen, Info } from "lucide-react";
import SkillsSection from "@/components/candidate/sections/SkillsSection";
import SkillsExperienceSectionFields from "@/components/candidate/sections/SkillsExperienceSection";
import IndustryProfileSection from "@/components/candidate/sections/IndustryProfileSection";
import EducationSection from "@/components/candidate/sections/EducationSection";
import { PortfolioSection } from "@/components/candidate/portfolio/PortfolioSection";

const skillsExperienceSchema = z.object({
  required_skills: z.array(z.string()).optional(),
  years_experience: z.coerce.number().min(0, "Years of experience is required"),
  years_in_current_title: z.number().min(0).optional(),
  additional_skills: z.string().optional(),
  security_clearance: z.string().optional(),
  security_clearance_level: z.string().optional(),
  qualifications: z.string().optional(),
  hasQualification: z.boolean().optional(),
  qualificationDetails: z.string().optional(),
  skills_experience: z.record(z.string(), z.number()).optional(),
  industry_sector: z.string().optional(),
  company_address: z.string().optional(),
  notice_period: z.string().optional(),
  contract_type_preference: z.string().optional(),
  education_details: z.array(z.object({
    institution: z.string(),
    qualification: z.string(),
    grade: z.string().optional(),
    year: z.number().optional(),
  })).optional(),
  workArea: z.string().optional(),
  job_title: z.union([z.string(), z.array(z.string())]).optional(),
});

type SkillsExperienceFormValues = z.infer<typeof skillsExperienceSchema>;

interface SkillsExperienceSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function SkillsExperienceSection({ userId, profileData, onSave }: SkillsExperienceSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileAny = profileData as any;

  const form = useForm<SkillsExperienceFormValues>({
    resolver: zodResolver(skillsExperienceSchema),
    defaultValues: {
      required_skills: profileData?.required_skills || [],
      years_experience: profileData?.years_experience || 0,
      years_in_current_title: profileData?.years_in_current_title || 0,
      additional_skills: profileData?.additional_skills || "",
      security_clearance: profileData?.security_clearance ? "yes" : "no",
      qualifications: profileData?.required_qualifications?.join(', ') || "",
      skills_experience: (profileAny?.skills_experience as Record<string, number>) || {},
      industry_sector: profileAny?.industry_sector || "",
      company_address: profileAny?.company_address || "",
      notice_period: profileAny?.notice_period || "Immediate",
      contract_type_preference: profileAny?.contract_type_preference || "permanent",
      education_details: (profileAny?.education_details as any[]) || [],
      workArea: profileData?.workArea || "",
    },
  });

  const handleSubmit = async (values: SkillsExperienceFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          required_skills: values.required_skills || [],
          years_experience: values.years_experience,
          years_in_current_title: values.years_in_current_title || 0,
          additional_skills: values.additional_skills || null,
          security_clearance: values.security_clearance === 'yes' ? values.security_clearance_level : null,
          required_qualifications: values.qualifications
            ? values.qualifications.split(',').map(q => q.trim()).filter(Boolean)
            : [],
          skills_experience: values.skills_experience || {},
          industry_sector: values.industry_sector || null,
          company_address: values.company_address || null,
          notice_period: values.notice_period || null,
          contract_type_preference: values.contract_type_preference || null,
          education_details: values.education_details || [],
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "Skills & experience saved" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlowCard>
        <GlowCardHeader>
          <GlowCardTitle>Skills & Experience</GlowCardTitle>
        </GlowCardHeader>
        <GlowCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <SkillsSection control={form.control} />
              <SkillsExperienceSectionFields control={form.control} />
              <IndustryProfileSection control={form.control} />
              <EducationSection control={form.control} />

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
                      Save Skills & Experience
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </GlowCardContent>
      </GlowCard>

      {/* Portfolio Section */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
            <div>
              <GlowCardTitle className="text-lg">Portfolio</GlowCardTitle>
              <GlowCardDescription>
                Showcase your work samples, projects, and documents
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <PortfolioSection userId={userId} />
          <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-muted/50 border border-border">
            <Info className="h-4 w-4 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground">
              Portfolio items save automatically when you upload or delete them.
            </p>
          </div>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}

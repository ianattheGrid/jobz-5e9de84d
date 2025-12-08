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
import { Loader2, Save, Settings, Eye, Shield, MessageSquare, Percent } from "lucide-react";
import { SectionVisibilityToggles } from "@/components/candidate/SectionVisibilityToggles";
import { VerificationSection } from "@/components/candidate/VerificationSection";
import ContactPreferencesSection from "@/components/candidate/sections/ContactPreferencesSection";
import CommissionPreferences from "@/components/candidate/sections/CommissionPreferences";

const settingsSchema = z.object({
  contact_phone_ok: z.boolean().default(true),
  contact_email_ok: z.boolean().default(true),
  contact_linkedin_ok: z.boolean().default(false),
  commission_percentage: z.number().min(2.5).max(14).nullable(),
  open_to_commission: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function SettingsSection({ userId, profileData, onSave }: SettingsSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileAny = profileData as any;
  
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      contact_phone_ok: profileAny?.contact_phone_ok ?? true,
      contact_email_ok: profileAny?.contact_email_ok ?? true,
      contact_linkedin_ok: profileAny?.contact_linkedin_ok ?? false,
      commission_percentage: profileData?.commission_percentage ?? null,
      open_to_commission: profileData?.commission_percentage !== null,
    },
  });

  const handleSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          contact_phone_ok: values.contact_phone_ok,
          contact_email_ok: values.contact_email_ok,
          contact_linkedin_ok: values.contact_linkedin_ok,
          commission_percentage: values.open_to_commission ? values.commission_percentage : null,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "Settings saved" });
      onSave();
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <GlowCardTitle>Profile Settings</GlowCardTitle>
              <GlowCardDescription>
                Control your visibility, verification status, and communication preferences.
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Section Visibility */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-muted-foreground" />
            <GlowCardTitle className="text-lg">Section Visibility</GlowCardTitle>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <SectionVisibilityToggles
            userId={userId}
            initial={(profileData as any)?.visible_sections || null}
            onChange={onSave}
          />
        </GlowCardContent>
      </GlowCard>

      {/* Verification */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <GlowCardTitle className="text-lg">Verification</GlowCardTitle>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <VerificationSection />
        </GlowCardContent>
      </GlowCard>

      {/* Contact & Commission Preferences */}
      <GlowCard>
        <GlowCardHeader>
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <GlowCardTitle className="text-lg">Contact & Commission Preferences</GlowCardTitle>
          </div>
        </GlowCardHeader>
        <GlowCardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <ContactPreferencesSection control={form.control} />
              <div className="border-t pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Percent className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium">Commission Settings</h4>
                </div>
                <CommissionPreferences control={form.control} />
              </div>

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
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </GlowCardContent>
      </GlowCard>
    </div>
  );
}

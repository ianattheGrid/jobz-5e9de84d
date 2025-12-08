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
import { Loader2, Save, Percent } from "lucide-react";
import CommissionPreferences from "@/components/candidate/sections/CommissionPreferences";

const bonusSchema = z.object({
  commission_percentage: z.number().min(2.5).max(14).nullable(),
  open_to_commission: z.boolean().default(false),
  view_scheme: z.boolean().default(false),
});

type BonusFormValues = z.infer<typeof bonusSchema>;

interface BonusSchemeSectionProps {
  userId: string;
  profileData: CandidateProfile | null;
  onSave: () => void;
}

export function BonusSchemeSection({ userId, profileData, onSave }: BonusSchemeSectionProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BonusFormValues>({
    resolver: zodResolver(bonusSchema),
    defaultValues: {
      commission_percentage: profileData?.commission_percentage ?? null,
      open_to_commission: profileData?.commission_percentage !== null,
      view_scheme: false,
    },
  });

  const handleSubmit = async (values: BonusFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          commission_percentage: values.open_to_commission ? values.commission_percentage : null,
        })
        .eq('id', userId);

      if (error) throw error;

      toast({ title: "Success", description: "Bonus preferences saved" });
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
            <Percent className="h-6 w-6 text-primary" />
            <div>
              <GlowCardTitle>Bonus Scheme</GlowCardTitle>
              <GlowCardDescription>
                Participate in our "You're Hired" bonus scheme and earn a percentage of the placement fee 
                when you're hired through the platform.
              </GlowCardDescription>
            </div>
          </div>
        </GlowCardHeader>
      </GlowCard>

      {/* Main Content */}
      <GlowCard>
        <GlowCardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <CommissionPreferences control={form.control} />

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
                      Save Bonus Preferences
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

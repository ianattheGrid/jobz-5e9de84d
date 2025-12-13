import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, RefreshCw, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { PivotProfile } from "@/integrations/supabase/types/profiles";
import { PivotStoryBlock } from "./PivotStoryBlock";
import { TransferableStrengthsBlock } from "./TransferableStrengthsBlock";
import { ProactiveStepsBlock } from "./ProactiveStepsBlock";
import { PivotJourneyBlock } from "./PivotJourneyBlock";
import { NewRolePreferencesBlock } from "./NewRolePreferencesBlock";
import { PivotWorkPreferencesBlock } from "./PivotWorkPreferencesBlock";
import { PivotRecommendationsBlock } from "./PivotRecommendationsBlock";

const DEFAULT_PIVOT_DATA: PivotProfile = {
  pivot_type: null,
  target_sectors: [],
  target_role_types: [],
  pivot_motivation: null,
  top_transferable_skills: [],
  transferable_skills_examples: [],
  pivot_preparation_activities: [],
  pivot_preparation_details: null,
  professional_journey: [],
  new_role_more_of_tags: [],
  new_role_less_of_tags: [],
  new_role_note: null,
  preferred_work_environment_tags: [],
  work_structure_tags: [],
  recommendations: [],
};

interface PivotSectionProps {
  userId: string;
  initialData?: PivotProfile | null;
}

export function PivotSection({ userId, initialData }: PivotSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<PivotProfile>(() => ({
    ...DEFAULT_PIVOT_DATA,
    ...(initialData || {}),
  }));
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setData({ ...DEFAULT_PIVOT_DATA, ...initialData });
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await (supabase
        .from('candidate_profiles') as any)
        .update({ pivot_profile: data as any })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your Pivot profile has been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error saving",
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasAnyData = 
    data.pivot_type ||
    (data.target_sectors?.length ?? 0) > 0 ||
    (data.top_transferable_skills?.length ?? 0) > 0 ||
    (data.pivot_preparation_activities?.length ?? 0) > 0 ||
    (data.professional_journey?.length ?? 0) > 0;

  return (
    <Card className="bg-gradient-to-br from-orange-500/5 to-background border border-orange-500/20 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-orange-500/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <RefreshCw className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  The Pivot
                </h3>
                <p className="text-sm text-muted-foreground">
                  For career changers bringing experience to new directions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasAnyData && (
                <span className="text-xs bg-orange-500/10 text-orange-600 px-2 py-1 rounded-full">
                  In progress
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-6 px-6">
            <div className="bg-orange-500/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground">
                <strong>Making a career change?</strong> Show employers your transferable skills, 
                explain your new direction, and demonstrate your commitment to the pivot.
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1: My Pivot Story */}
              <div className="pb-6 border-b border-border">
                <PivotStoryBlock
                  pivotType={data.pivot_type || null}
                  targetSectors={data.target_sectors || []}
                  targetRoleTypes={data.target_role_types || []}
                  pivotMotivation={data.pivot_motivation || null}
                  onPivotTypeChange={(v) => setData({ ...data, pivot_type: v })}
                  onTargetSectorsChange={(v) => setData({ ...data, target_sectors: v })}
                  onTargetRoleTypesChange={(v) => setData({ ...data, target_role_types: v })}
                  onPivotMotivationChange={(v) => setData({ ...data, pivot_motivation: v })}
                />
              </div>

              {/* Section 2: Transferable Strengths */}
              <div className="pb-6 border-b border-border">
                <TransferableStrengthsBlock
                  selectedSkills={data.top_transferable_skills || []}
                  examples={data.transferable_skills_examples || []}
                  onSkillsChange={(v) => setData({ ...data, top_transferable_skills: v })}
                  onExamplesChange={(v) => setData({ ...data, transferable_skills_examples: v })}
                />
              </div>

              {/* Section 3: Proactive Steps */}
              <div className="pb-6 border-b border-border">
                <ProactiveStepsBlock
                  activities={data.pivot_preparation_activities || []}
                  details={data.pivot_preparation_details || null}
                  onActivitiesChange={(v) => setData({ ...data, pivot_preparation_activities: v })}
                  onDetailsChange={(v) => setData({ ...data, pivot_preparation_details: v })}
                />
              </div>

              {/* Section 4: Professional Journey */}
              <div className="pb-6 border-b border-border">
                <PivotJourneyBlock
                  entries={data.professional_journey || []}
                  onChange={(entries) => setData({ ...data, professional_journey: entries })}
                />
              </div>

              {/* Section 5: What I'm Looking For */}
              <div className="pb-6 border-b border-border">
                <NewRolePreferencesBlock
                  moreOfTags={data.new_role_more_of_tags || []}
                  lessOfTags={data.new_role_less_of_tags || []}
                  note={data.new_role_note || null}
                  onMoreOfTagsChange={(v) => setData({ ...data, new_role_more_of_tags: v })}
                  onLessOfTagsChange={(v) => setData({ ...data, new_role_less_of_tags: v })}
                  onNoteChange={(v) => setData({ ...data, new_role_note: v })}
                />
              </div>

              {/* Section 6: Work Preferences */}
              <div className="pb-6 border-b border-border">
                <PivotWorkPreferencesBlock
                  environmentTags={data.preferred_work_environment_tags || []}
                  structureTags={data.work_structure_tags || []}
                  onEnvironmentTagsChange={(v) => setData({ ...data, preferred_work_environment_tags: v })}
                  onStructureTagsChange={(v) => setData({ ...data, work_structure_tags: v })}
                />
              </div>

              {/* Section 7: Recommendations */}
              <div>
                <PivotRecommendationsBlock
                  recommendations={data.recommendations || []}
                  onChange={(recs) => setData({ ...data, recommendations: recs })}
                />
              </div>
            </div>

            {/* Save button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Pivot Profile'
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

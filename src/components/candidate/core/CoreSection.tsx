import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Zap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { CoreProfile } from "@/integrations/supabase/types/profiles";
import { SnapshotBlock } from "./SnapshotBlock";
import { CoreExperienceBlock } from "./CoreExperienceBlock";
import { WorkFocusBlock } from "./WorkFocusBlock";
import { ProudMomentsBlock } from "./ProudMomentsBlock";
import { LeadershipContributionBlock } from "./LeadershipContributionBlock";
import { WhatIWantNextBlock } from "./WhatIWantNextBlock";
import { WorkPreferencesBlock } from "./WorkPreferencesBlock";
import { OutsideWorkBlock } from "./OutsideWorkBlock";
import { CoreRecommendationsBlock } from "./CoreRecommendationsBlock";

const DEFAULT_CORE_DATA: CoreProfile = {
  current_role_title: null,
  current_sector: null,
  years_experience_range: null,
  core_strength_tags: [],
  experience_entries: [],
  core_work_focus_tags: [],
  one_thing_i_do_really_well: null,
  proud_moments: [],
  leadership_contribution_tags: [],
  leadership_note: null,
  next_role_direction_tags: [],
  next_role_more_of_tags: [],
  next_role_less_of_tags: [],
  next_role_note: null,
  preferred_work_environment_tags: [],
  work_structure_tags: [],
  outside_work_summary: null,
  volunteering_or_side_projects: [],
  recommendations: [],
};

interface CoreSectionProps {
  userId: string;
  initialData?: CoreProfile | null;
}

export function CoreSection({ userId, initialData }: CoreSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<CoreProfile>(() => ({
    ...DEFAULT_CORE_DATA,
    ...(initialData || {}),
  }));
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setData({ ...DEFAULT_CORE_DATA, ...initialData });
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({ core_profile: data as any })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your Core profile has been updated.",
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
    data.current_role_title ||
    (data.core_strength_tags?.length ?? 0) > 0 ||
    (data.experience_entries?.length ?? 0) > 0 ||
    (data.core_work_focus_tags?.length ?? 0) > 0 ||
    (data.proud_moments?.length ?? 0) > 0 ||
    (data.leadership_contribution_tags?.length ?? 0) > 0 ||
    (data.next_role_direction_tags?.length ?? 0) > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-background border border-primary/20 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  The Core
                </h3>
                <p className="text-sm text-muted-foreground">
                  For established professionals with 5-15+ years experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasAnyData && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
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
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground">
                <strong>Mid-career and established?</strong> Show employers your impact, 
                leadership style, and what kind of role you want next.
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1: Snapshot */}
              <div className="pb-6 border-b border-border">
                <SnapshotBlock
                  currentRoleTitle={data.current_role_title || null}
                  currentSector={data.current_sector || null}
                  yearsExperienceRange={data.years_experience_range || null}
                  coreStrengthTags={data.core_strength_tags || []}
                  onRoleTitleChange={(v) => setData({ ...data, current_role_title: v })}
                  onSectorChange={(v) => setData({ ...data, current_sector: v })}
                  onYearsExperienceChange={(v) => setData({ ...data, years_experience_range: v })}
                  onStrengthTagsChange={(v) => setData({ ...data, core_strength_tags: v })}
                />
              </div>

              {/* Section 2: Experience */}
              <div className="pb-6 border-b border-border">
                <CoreExperienceBlock
                  entries={data.experience_entries || []}
                  onChange={(entries) => setData({ ...data, experience_entries: entries })}
                />
              </div>

              {/* Section 3: Work I'm Best At */}
              <div className="pb-6 border-b border-border">
                <WorkFocusBlock
                  selectedTags={data.core_work_focus_tags || []}
                  oneThingWell={data.one_thing_i_do_really_well || null}
                  onTagsChange={(v) => setData({ ...data, core_work_focus_tags: v })}
                  onOneThingWellChange={(v) => setData({ ...data, one_thing_i_do_really_well: v })}
                />
              </div>

              {/* Section 4: Things I'm Proud Of */}
              <div className="pb-6 border-b border-border">
                <ProudMomentsBlock
                  moments={data.proud_moments || []}
                  onChange={(v) => setData({ ...data, proud_moments: v })}
                />
              </div>

              {/* Section 5: How I Lead & Contribute */}
              <div className="pb-6 border-b border-border">
                <LeadershipContributionBlock
                  selectedTags={data.leadership_contribution_tags || []}
                  note={data.leadership_note || null}
                  onTagsChange={(v) => setData({ ...data, leadership_contribution_tags: v })}
                  onNoteChange={(v) => setData({ ...data, leadership_note: v })}
                />
              </div>

              {/* Section 6: What I Want Next */}
              <div className="pb-6 border-b border-border">
                <WhatIWantNextBlock
                  directionTags={data.next_role_direction_tags || []}
                  moreOfTags={data.next_role_more_of_tags || []}
                  lessOfTags={data.next_role_less_of_tags || []}
                  note={data.next_role_note || null}
                  onDirectionTagsChange={(v) => setData({ ...data, next_role_direction_tags: v })}
                  onMoreOfTagsChange={(v) => setData({ ...data, next_role_more_of_tags: v })}
                  onLessOfTagsChange={(v) => setData({ ...data, next_role_less_of_tags: v })}
                  onNoteChange={(v) => setData({ ...data, next_role_note: v })}
                />
              </div>

              {/* Section 7: Work Preferences */}
              <div className="pb-6 border-b border-border">
                <WorkPreferencesBlock
                  environmentTags={data.preferred_work_environment_tags || []}
                  structureTags={data.work_structure_tags || []}
                  onEnvironmentTagsChange={(v) => setData({ ...data, preferred_work_environment_tags: v })}
                  onStructureTagsChange={(v) => setData({ ...data, work_structure_tags: v })}
                />
              </div>

              {/* Section 8: Outside Work */}
              <div className="pb-6 border-b border-border">
                <OutsideWorkBlock
                  summary={data.outside_work_summary || null}
                  projects={data.volunteering_or_side_projects || []}
                  onSummaryChange={(v) => setData({ ...data, outside_work_summary: v })}
                  onProjectsChange={(v) => setData({ ...data, volunteering_or_side_projects: v })}
                />
              </div>

              {/* Section 9: Recommendations */}
              <div>
                <CoreRecommendationsBlock
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
                  'Save Core Profile'
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Award, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { EncoreProfile } from "@/integrations/supabase/types/profiles";
import { NextChapterBlock } from "./NextChapterBlock";
import { EncoreSectorsBlock } from "./EncoreSectorsBlock";
import { CareerNutshellBlock } from "./CareerNutshellBlock";
import { EncoreValueBlock } from "./EncoreValueBlock";
import { RolesResponsibilityBlock } from "./RolesResponsibilityBlock";
import { WorkPatternPaceBlock } from "./WorkPatternPaceBlock";
import { EncoreProudMomentsBlock } from "./EncoreProudMomentsBlock";
import { EncoreExperienceBlock } from "./EncoreExperienceBlock";
import { MentoringBlock } from "./MentoringBlock";
import { LifeBalanceBlock } from "./LifeBalanceBlock";

const DEFAULT_ENCORE_DATA: EncoreProfile = {
  encore_modes: [],
  encore_summary: null,
  sectors_experience: [],
  sectors_interested_next: [],
  sector_shift_note: null,
  primary_career_areas: [],
  years_experience_overall: null,
  career_headline: null,
  encore_value_tags: [],
  encore_value_other: null,
  encore_value_note: null,
  encore_role_types: [],
  encore_responsibility_level: null,
  work_hours_preferences: [],
  pace_preferences: [],
  encore_proud_moments: [],
  experience_entries: [],
  open_to_mentoring: false,
  mentoring_topics: [],
  life_balance_notes: null,
};

interface EncoreSectionProps {
  userId: string;
  initialData?: EncoreProfile | null;
}

export function EncoreSection({ userId, initialData }: EncoreSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<EncoreProfile>(() => ({
    ...DEFAULT_ENCORE_DATA,
    ...(initialData || {}),
  }));
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setData({ ...DEFAULT_ENCORE_DATA, ...initialData });
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await (supabase
        .from('candidate_profiles') as any)
        .update({ encore_profile: data as any })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your Encore profile has been updated.",
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
    (data.encore_modes?.length ?? 0) > 0 ||
    (data.sectors_experience?.length ?? 0) > 0 ||
    (data.encore_value_tags?.length ?? 0) > 0 ||
    (data.encore_proud_moments?.length ?? 0) > 0 ||
    data.career_headline;

  return (
    <Card className="bg-gradient-to-br from-amber-500/5 to-background border border-amber-500/20 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-amber-500/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Award className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  The Encore
                </h3>
                <p className="text-sm text-muted-foreground">
                  For experienced professionals defining their next chapter
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasAnyData && (
                <span className="text-xs bg-amber-500/10 text-amber-600 px-2 py-1 rounded-full">
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
            <div className="bg-amber-500/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-foreground">
                <strong>You're in control of what work looks like now.</strong> Whether you want 
                another full-time chapter, part-time flexibility, or something completely different – 
                tell us what matters to you.
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1: My Next Chapter at Work */}
              <div className="pb-6 border-b border-border">
                <NextChapterBlock
                  encoreModes={data.encore_modes || []}
                  encoreSummary={data.encore_summary || null}
                  onModesChange={(v) => setData({ ...data, encore_modes: v })}
                  onSummaryChange={(v) => setData({ ...data, encore_summary: v })}
                />
              </div>

              {/* Section 2: Sectors Experience & Open To */}
              <div className="pb-6 border-b border-border">
                <EncoreSectorsBlock
                  sectorsExperience={data.sectors_experience || []}
                  sectorsInterestedNext={data.sectors_interested_next || []}
                  sectorShiftNote={data.sector_shift_note || null}
                  onSectorsExperienceChange={(v) => setData({ ...data, sectors_experience: v })}
                  onSectorsInterestedNextChange={(v) => setData({ ...data, sectors_interested_next: v })}
                  onSectorShiftNoteChange={(v) => setData({ ...data, sector_shift_note: v })}
                />
              </div>

              {/* Section 3: Career in a Nutshell */}
              <div className="pb-6 border-b border-border">
                <CareerNutshellBlock
                  primaryCareerAreas={data.primary_career_areas || []}
                  yearsExperience={data.years_experience_overall || null}
                  careerHeadline={data.career_headline || null}
                  onCareerAreasChange={(v) => setData({ ...data, primary_career_areas: v })}
                  onYearsExperienceChange={(v) => setData({ ...data, years_experience_overall: v })}
                  onCareerHeadlineChange={(v) => setData({ ...data, career_headline: v })}
                />
              </div>

              {/* Section 4: How I Can Add Value Now */}
              <div className="pb-6 border-b border-border">
                <EncoreValueBlock
                  valueTags={data.encore_value_tags || []}
                  valueOther={data.encore_value_other || null}
                  valueNote={data.encore_value_note || null}
                  onValueTagsChange={(v) => setData({ ...data, encore_value_tags: v })}
                  onValueOtherChange={(v) => setData({ ...data, encore_value_other: v })}
                  onValueNoteChange={(v) => setData({ ...data, encore_value_note: v })}
                />
              </div>

              {/* Section 5: Roles & Responsibility Levels */}
              <div className="pb-6 border-b border-border">
                <RolesResponsibilityBlock
                  roleTypes={data.encore_role_types || []}
                  responsibilityLevel={data.encore_responsibility_level || null}
                  onRoleTypesChange={(v) => setData({ ...data, encore_role_types: v })}
                  onResponsibilityLevelChange={(v) => setData({ ...data, encore_responsibility_level: v })}
                />
              </div>

              {/* Section 6: Work Pattern & Pace */}
              <div className="pb-6 border-b border-border">
                <WorkPatternPaceBlock
                  workHoursPreferences={data.work_hours_preferences || []}
                  pacePreferences={data.pace_preferences || []}
                  onWorkHoursChange={(v) => setData({ ...data, work_hours_preferences: v })}
                  onPaceChange={(v) => setData({ ...data, pace_preferences: v })}
                />
              </div>

              {/* Section 7: Moments I'm Proud Of */}
              <div className="pb-6 border-b border-border">
                <EncoreProudMomentsBlock
                  proudMoments={data.encore_proud_moments || []}
                  onChange={(v) => setData({ ...data, encore_proud_moments: v })}
                />
              </div>

              {/* Section 8: Experience Summary (Optional) */}
              <div className="pb-6 border-b border-border">
                <EncoreExperienceBlock
                  entries={data.experience_entries || []}
                  onChange={(entries) => setData({ ...data, experience_entries: entries })}
                />
              </div>

              {/* Section 9: Mentoring & Knowledge-Sharing (Optional) */}
              <div className="pb-6 border-b border-border">
                <MentoringBlock
                  openToMentoring={data.open_to_mentoring || false}
                  mentoringTopics={data.mentoring_topics || []}
                  onOpenToMentoringChange={(v) => setData({ ...data, open_to_mentoring: v })}
                  onMentoringTopicsChange={(v) => setData({ ...data, mentoring_topics: v })}
                />
              </div>

              {/* Section 10: Life Balance & Practical Notes (Optional) */}
              <div>
                <LifeBalanceBlock
                  notes={data.life_balance_notes || null}
                  onChange={(v) => setData({ ...data, life_balance_notes: v })}
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
                  'Save Encore Profile'
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

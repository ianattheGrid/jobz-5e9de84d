import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, TrendingUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { AscentProfile } from "@/integrations/supabase/types/profiles";
import { DirectionSectorsBlock } from "./DirectionSectorsBlock";
import { WorkExperienceBlock } from "./WorkExperienceBlock";
import { SkillsBlock } from "./SkillsBlock";
import { WorkStyleGrowthBlock } from "./WorkStyleGrowthBlock";
import { MoreOfLessOfBlock } from "./MoreOfLessOfBlock";
import { AboutMeShortBlock } from "./AboutMeShortBlock";
import { NextStepUpBlock } from "./NextStepUpBlock";
import { ReferencesBlock } from "../shared/ReferencesBlock";

const DEFAULT_ASCENT_DATA: AscentProfile = {
  current_sector_experience: [],
  sectors_interested_next: [],
  direction_note: null,
  work_experience_entries: [],
  work_skills: [],
  tools_or_systems: null,
  work_style_growth_tags: [],
  work_style_growth_other: null,
  next_role_more_of_tags: [],
  next_role_more_of_other: null,
  next_role_less_of_tags: [],
  next_role_less_of_other: null,
  about_me_short: null,
  outside_work_proud_of: null,
  hobby_entries: [],
  next_step_type_tags: [],
  next_step_other: null,
  next_step_note: null,
  references: [],
};

interface AscentSectionProps {
  userId: string;
  initialData?: AscentProfile | null;
}

export function AscentSection({ userId, initialData }: AscentSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<AscentProfile>(() => ({
    ...DEFAULT_ASCENT_DATA,
    ...(initialData || {}),
  }));
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setData({ ...DEFAULT_ASCENT_DATA, ...initialData });
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({ ascent_profile: data as any })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your Ascent profile has been updated.",
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
    (data.current_sector_experience?.length ?? 0) > 0 ||
    (data.work_experience_entries?.length ?? 0) > 0 ||
    (data.work_skills?.length ?? 0) > 0 ||
    (data.work_style_growth_tags?.length ?? 0) > 0 ||
    (data.next_role_more_of_tags?.length ?? 0) > 0 ||
    data.about_me_short ||
    (data.references?.length ?? 0) > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-background border border-primary/20 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  The Ascent
                </h3>
                <p className="text-sm text-muted-foreground">
                  For professionals with 1-5 years experience
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
                <strong>Building your career?</strong> Show employers what you've done, 
                how you've grown, and where you want to go next.
              </p>
            </div>

            <div className="space-y-8">
              {/* Section 1: Direction & Sectors */}
              <div className="pb-6 border-b border-border">
                <DirectionSectorsBlock
                  currentSectors={data.current_sector_experience || []}
                  interestedSectors={data.sectors_interested_next || []}
                  directionNote={data.direction_note || null}
                  onCurrentSectorsChange={(v) => setData({ ...data, current_sector_experience: v })}
                  onInterestedSectorsChange={(v) => setData({ ...data, sectors_interested_next: v })}
                  onDirectionNoteChange={(v) => setData({ ...data, direction_note: v })}
                />
              </div>

              {/* Section 2: Work Experience */}
              <div className="pb-6 border-b border-border">
                <WorkExperienceBlock
                  entries={data.work_experience_entries || []}
                  onChange={(entries) => setData({ ...data, work_experience_entries: entries })}
                />
              </div>

              {/* Section 3: Skills */}
              <div className="pb-6 border-b border-border">
                <SkillsBlock
                  selectedSkills={data.work_skills || []}
                  toolsOrSystems={data.tools_or_systems || null}
                  onSkillsChange={(v) => setData({ ...data, work_skills: v })}
                  onToolsChange={(v) => setData({ ...data, tools_or_systems: v })}
                />
              </div>

              {/* Section 4: Work Style Growth */}
              <div className="pb-6 border-b border-border">
                <WorkStyleGrowthBlock
                  selectedTags={data.work_style_growth_tags || []}
                  otherText={data.work_style_growth_other || null}
                  onTagsChange={(v) => setData({ ...data, work_style_growth_tags: v })}
                  onOtherChange={(v) => setData({ ...data, work_style_growth_other: v })}
                />
              </div>

              {/* Section 5: More Of / Less Of */}
              <div className="pb-6 border-b border-border">
                <MoreOfLessOfBlock
                  moreOfTags={data.next_role_more_of_tags || []}
                  moreOfOther={data.next_role_more_of_other || null}
                  lessOfTags={data.next_role_less_of_tags || []}
                  lessOfOther={data.next_role_less_of_other || null}
                  onMoreOfTagsChange={(v) => setData({ ...data, next_role_more_of_tags: v })}
                  onMoreOfOtherChange={(v) => setData({ ...data, next_role_more_of_other: v })}
                  onLessOfTagsChange={(v) => setData({ ...data, next_role_less_of_tags: v })}
                  onLessOfOtherChange={(v) => setData({ ...data, next_role_less_of_other: v })}
                />
              </div>

              {/* Section 6: About Me */}
              <div className="pb-6 border-b border-border">
                <AboutMeShortBlock
                  aboutMe={data.about_me_short || null}
                  outsideWorkProudOf={data.outside_work_proud_of || null}
                  hobbyEntries={data.hobby_entries || []}
                  onAboutMeChange={(v) => setData({ ...data, about_me_short: v })}
                  onOutsideWorkChange={(v) => setData({ ...data, outside_work_proud_of: v })}
                  onHobbyEntriesChange={(v) => setData({ ...data, hobby_entries: v })}
                />
              </div>

              {/* Section 7: Next Step Up */}
              <div className="pb-6 border-b border-border">
                <NextStepUpBlock
                  selectedTags={data.next_step_type_tags || []}
                  otherText={data.next_step_other || null}
                  noteText={data.next_step_note || null}
                  onTagsChange={(v) => setData({ ...data, next_step_type_tags: v })}
                  onOtherChange={(v) => setData({ ...data, next_step_other: v })}
                  onNoteChange={(v) => setData({ ...data, next_step_note: v })}
                />
              </div>

              {/* Section 8: References */}
              <div>
                <ReferencesBlock
                  references={data.references || []}
                  onChange={(refs) => setData({ ...data, references: refs })}
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
                  'Save Ascent Profile'
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

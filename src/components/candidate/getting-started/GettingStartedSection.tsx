import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Rocket, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { GettingStartedData, DEFAULT_GETTING_STARTED_DATA } from "./types";
import { EssentialsBlock } from "./EssentialsBlock";
import { WorkStyleBlock } from "./WorkStyleBlock";
import { ExperienceContextBlock } from "./ExperienceContextBlock";
import { ReliabilityBlock } from "./ReliabilityBlock";
import { NextChapterBlock } from "./NextChapterBlock";
import { HobbiesBlock } from "./HobbiesBlock";
import { ShowAndTellBlock } from "./ShowAndTellBlock";
import { ReferencesBlock } from "../shared/ReferencesBlock";

interface GettingStartedSectionProps {
  userId: string;
  initialData?: GettingStartedData | null;
}

export function GettingStartedSection({ userId, initialData }: GettingStartedSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<GettingStartedData>(() => ({
    ...DEFAULT_GETTING_STARTED_DATA,
    ...(initialData || {}),
  }));
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setData({ ...DEFAULT_GETTING_STARTED_DATA, ...initialData });
    }
  }, [initialData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({ proof_of_potential: data as any })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Your Getting Started profile has been updated.",
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
    data.first_job_salary_min ||
    data.first_job_salary_max ||
    data.first_job_availability ||
    (data.looking_for_work_reasons?.length ?? 0) > 0 ||
    (data.work_style_tags?.length ?? 0) > 0 ||
    (data.experience_context_tags?.length ?? 0) > 0 ||
    (data.reliability_tags?.length ?? 0) > 0 ||
    (data.next_chapter_sectors?.length ?? 0) > 0 ||
    (data.hobby_entries?.length ?? 0) > 0 ||
    (data.show_and_tell_items?.length ?? 0) > 0;

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-background border border-primary/20 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Getting Started
                </h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for first-time job seekers
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
                <strong>Looking for your first job?</strong> This section is designed just for you! 
                Tell us what you're looking for, and show employers what makes you great – 
                no experience required.
              </p>
            </div>

            <div className="space-y-8">
              {/* Essentials Block */}
              <div className="pb-6 border-b border-border">
                <EssentialsBlock
                  salaryMin={data.first_job_salary_min || null}
                  salaryMax={data.first_job_salary_max || null}
                  availability={data.first_job_availability || null}
                  workType={data.first_job_work_type || null}
                  reasons={data.looking_for_work_reasons || []}
                  onSalaryMinChange={(v) => setData({ ...data, first_job_salary_min: v })}
                  onSalaryMaxChange={(v) => setData({ ...data, first_job_salary_max: v })}
                  onAvailabilityChange={(v) => setData({ ...data, first_job_availability: v })}
                  onWorkTypeChange={(v) => setData({ ...data, first_job_work_type: v })}
                  onReasonsChange={(r) => setData({ ...data, looking_for_work_reasons: r })}
                />
              </div>

              {/* Block 1: Work Style */}
              <div className="pb-6 border-b border-border">
                <WorkStyleBlock
                  selected={data.work_style_tags || []}
                  onChange={(tags) => setData({ ...data, work_style_tags: tags })}
                />
              </div>

              {/* Block 2: Experience Context */}
              <div className="pb-6 border-b border-border">
                <ExperienceContextBlock
                  selectedTags={data.experience_context_tags || []}
                  otherText={data.experience_context_other || null}
                  proudOf={data.experience_proud_of || null}
                  onTagsChange={(tags) => setData({ ...data, experience_context_tags: tags })}
                  onOtherChange={(text) => setData({ ...data, experience_context_other: text })}
                  onProudOfChange={(text) => setData({ ...data, experience_proud_of: text })}
                />
              </div>

              {/* Block 3: Reliability */}
              <div className="pb-6 border-b border-border">
                <ReliabilityBlock
                  selectedTags={data.reliability_tags || []}
                  preferredTime={data.preferred_time_of_day || 'flexible'}
                  weekendOk={data.weekend_ok || false}
                  onTagsChange={(tags) => setData({ ...data, reliability_tags: tags })}
                  onTimeChange={(time) => setData({ ...data, preferred_time_of_day: time })}
                  onWeekendChange={(ok) => setData({ ...data, weekend_ok: ok })}
                />
              </div>

              {/* Block 4: Next Chapter */}
              <div className="pb-6 border-b border-border">
                <NextChapterBlock
                  selectedSectors={data.next_chapter_sectors || []}
                  otherSector={data.next_chapter_sectors_other || null}
                  freeText={data.next_chapter_text || null}
                  onSectorsChange={(sectors) => setData({ ...data, next_chapter_sectors: sectors })}
                  onOtherChange={(text) => setData({ ...data, next_chapter_sectors_other: text })}
                  onFreeTextChange={(text) => setData({ ...data, next_chapter_text: text })}
                />
              </div>

              {/* Block 5: Hobbies */}
              <div className="pb-6 border-b border-border">
                <HobbiesBlock
                  hobbyEntries={data.hobby_entries || []}
                  otherText={data.hobby_other || null}
                  workNote={data.hobby_to_work_note || null}
                  onEntriesChange={(entries) => setData({ ...data, hobby_entries: entries })}
                  onOtherChange={(text) => setData({ ...data, hobby_other: text })}
                  onWorkNoteChange={(text) => setData({ ...data, hobby_to_work_note: text })}
                />
              </div>

              {/* Block 6: Show & Tell */}
              <div className="pb-6 border-b border-border">
                <ShowAndTellBlock
                  items={data.show_and_tell_items || []}
                  onChange={(items) => setData({ ...data, show_and_tell_items: items })}
                />
              </div>

              {/* Block 7: References */}
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
                  'Save Getting Started'
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

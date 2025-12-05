import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ProofOfPotential, DEFAULT_PROOF_OF_POTENTIAL } from "./types";
import { WorkStyleBlock } from "./WorkStyleBlock";
import { ExperienceContextBlock } from "./ExperienceContextBlock";
import { ReliabilityBlock } from "./ReliabilityBlock";
import { NextChapterBlock } from "./NextChapterBlock";
import { HobbiesBlock } from "./HobbiesBlock";
import { ShowAndTellBlock } from "./ShowAndTellBlock";

interface ProofOfPotentialSectionProps {
  userId: string;
  initialData?: ProofOfPotential | null;
}

export function ProofOfPotentialSection({ userId, initialData }: ProofOfPotentialSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState<ProofOfPotential>(() => ({
    ...DEFAULT_PROOF_OF_POTENTIAL,
    ...(initialData || {}),
  }));
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setData({ ...DEFAULT_PROOF_OF_POTENTIAL, ...initialData });
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
        description: "Your Proof of Potential has been updated.",
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
    (data.work_style_tags?.length ?? 0) > 0 ||
    (data.experience_context_tags?.length ?? 0) > 0 ||
    (data.reliability_tags?.length ?? 0) > 0 ||
    (data.next_chapter_sectors?.length ?? 0) > 0 ||
    (data.hobby_tags?.length ?? 0) > 0 ||
    (data.show_and_tell_items?.length ?? 0) > 0;

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 shadow-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-pink-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Proof of Potential
                </h3>
                <p className="text-sm text-gray-600">
                  For 18–25 year olds with limited work experience
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {hasAnyData && (
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">
                  In progress
                </span>
              )}
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-400" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-6 px-6">
            <div className="bg-pink-100/50 rounded-lg p-4 mb-6">
              <p className="text-sm text-pink-800">
                <strong>Don't have much work experience yet?</strong> This section helps employers see what you're really like and what you're interested in. It's quick – mostly tick boxes.
              </p>
            </div>

            <div className="space-y-8">
              {/* Block 1: Work Style */}
              <div className="pb-6 border-b border-pink-100">
                <WorkStyleBlock
                  selected={data.work_style_tags || []}
                  onChange={(tags) => setData({ ...data, work_style_tags: tags })}
                />
              </div>

              {/* Block 2: Experience Context */}
              <div className="pb-6 border-b border-pink-100">
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
              <div className="pb-6 border-b border-pink-100">
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
              <div className="pb-6 border-b border-pink-100">
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
              <div className="pb-6 border-b border-pink-100">
                <HobbiesBlock
                  selectedTags={data.hobby_tags || []}
                  otherText={data.hobby_other || null}
                  workNote={data.hobby_to_work_note || null}
                  onTagsChange={(tags) => setData({ ...data, hobby_tags: tags })}
                  onOtherChange={(text) => setData({ ...data, hobby_other: text })}
                  onWorkNoteChange={(text) => setData({ ...data, hobby_to_work_note: text })}
                />
              </div>

              {/* Block 6: Show & Tell */}
              <div>
                <ShowAndTellBlock
                  items={data.show_and_tell_items || []}
                  onChange={(items) => setData({ ...data, show_and_tell_items: items })}
                />
              </div>
            </div>

            {/* Save button */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-pink-600 hover:bg-pink-700 text-white px-8"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Proof of Potential'
                )}
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

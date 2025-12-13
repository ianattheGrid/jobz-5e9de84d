import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, X } from "lucide-react";
import { ENCORE_CHAR_LIMITS, MAX_PROUD_MOMENTS, MIN_PROUD_MOMENTS } from "./constants";

interface EncoreProudMomentsBlockProps {
  proudMoments: string[];
  onChange: (moments: string[]) => void;
}

export function EncoreProudMomentsBlock({
  proudMoments,
  onChange,
}: EncoreProudMomentsBlockProps) {
  const updateMoment = (index: number, value: string) => {
    const updated = [...proudMoments];
    updated[index] = value;
    onChange(updated);
  };

  const addMoment = () => {
    if (proudMoments.length < MAX_PROUD_MOMENTS) {
      onChange([...proudMoments, '']);
    }
  };

  const removeMoment = (index: number) => {
    onChange(proudMoments.filter((_, i) => i !== index));
  };

  // Ensure we have at least 2 slots
  const displayMoments = proudMoments.length >= MIN_PROUD_MOMENTS 
    ? proudMoments 
    : [...proudMoments, ...Array(MIN_PROUD_MOMENTS - proudMoments.length).fill('')];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">A Few Moments I'm Proud Of</h4>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            Pick {MIN_PROUD_MOMENTS}–{MAX_PROUD_MOMENTS} moments from your career that you're proud of – big or small
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Focus on what changed for the better.
          </p>
        </div>

        <div className="space-y-4">
          {displayMoments.map((moment, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Moment {index + 1}
                </Label>
                {index >= MIN_PROUD_MOMENTS && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMoment(index)}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                value={moment}
                onChange={(e) => updateMoment(index, e.target.value)}
                maxLength={ENCORE_CHAR_LIMITS.proud_moment}
                placeholder="Describe a moment you're proud of..."
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground text-right">
                {moment.length}/{ENCORE_CHAR_LIMITS.proud_moment}
              </p>
            </div>
          ))}
        </div>

        {displayMoments.length < MAX_PROUD_MOMENTS && (
          <Button
            type="button"
            variant="outline"
            onClick={addMoment}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Moment
          </Button>
        )}
      </div>
    </div>
  );
}

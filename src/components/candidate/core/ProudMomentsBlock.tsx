import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { CORE_CHAR_LIMITS, MAX_PROUD_MOMENTS, MIN_PROUD_MOMENTS } from "./constants";

interface ProudMomentsBlockProps {
  moments: string[];
  onChange: (moments: string[]) => void;
}

export function ProudMomentsBlock({ moments, onChange }: ProudMomentsBlockProps) {
  // Ensure we always have at least MIN_PROUD_MOMENTS empty slots
  const displayMoments = moments.length < MIN_PROUD_MOMENTS 
    ? [...moments, ...Array(MIN_PROUD_MOMENTS - moments.length).fill('')]
    : moments;

  const updateMoment = (index: number, value: string) => {
    const updated = [...displayMoments];
    updated[index] = value.slice(0, CORE_CHAR_LIMITS.proud_moment);
    onChange(updated);
  };

  const addMoment = () => {
    if (displayMoments.length < MAX_PROUD_MOMENTS) {
      onChange([...displayMoments, '']);
    }
  };

  const removeMoment = (index: number) => {
    if (displayMoments.length > MIN_PROUD_MOMENTS) {
      onChange(displayMoments.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🏆</span> A Few Things I'm Proud Of
        </h4>
        <p className="text-sm text-muted-foreground">
          Pick {MIN_PROUD_MOMENTS}–{MAX_PROUD_MOMENTS} moments you're proud of (big or small). 
          Focus on what changed, not just what you were asked to do.
        </p>
      </div>

      <div className="space-y-3">
        {displayMoments.map((moment, index) => (
          <div key={index} className="relative">
            <div className="flex gap-2">
              <div className="flex-1">
                <Textarea
                  placeholder={
                    index === 0 
                      ? "e.g., Cut average delivery delays from 5 days to 2 by reorganising our supplier schedule."
                      : index === 1
                      ? "e.g., Brought back a key client who had left by rebuilding the relationship over 6 months."
                      : "e.g., Promoted twice in four years after consistently hitting and exceeding targets."
                  }
                  value={moment}
                  onChange={(e) => updateMoment(index, e.target.value)}
                  maxLength={CORE_CHAR_LIMITS.proud_moment}
                  className="resize-none"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {moment.length}/{CORE_CHAR_LIMITS.proud_moment}
                </p>
              </div>
              {displayMoments.length > MIN_PROUD_MOMENTS && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeMoment(index)}
                  className="text-destructive hover:text-destructive shrink-0 mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayMoments.length < MAX_PROUD_MOMENTS && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addMoment}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add another moment
        </Button>
      )}
    </div>
  );
}

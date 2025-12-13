import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { ENCORE_MODE_OPTIONS, ENCORE_CHAR_LIMITS } from "./constants";

interface NextChapterBlockProps {
  encoreModes: string[];
  encoreSummary: string | null;
  onModesChange: (modes: string[]) => void;
  onSummaryChange: (summary: string | null) => void;
}

export function NextChapterBlock({
  encoreModes,
  encoreSummary,
  onModesChange,
  onSummaryChange,
}: NextChapterBlockProps) {
  const toggleMode = (key: string) => {
    if (encoreModes.includes(key)) {
      onModesChange(encoreModes.filter(m => m !== key));
    } else {
      onModesChange([...encoreModes, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">My Next Chapter at Work</h4>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            How would you like work to look in this next chapter?
          </Label>
          <p className="text-sm text-muted-foreground mb-3">
            You can pick more than one option.
          </p>
          <div className="space-y-3">
            {ENCORE_MODE_OPTIONS.map((option) => (
              <label
                key={option.key}
                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={encoreModes.includes(option.key)}
                  onCheckedChange={() => toggleMode(option.key)}
                  className="mt-0.5"
                />
                <span className="text-sm text-foreground">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="encore-summary" className="text-base font-medium">
            In 2–3 sentences, describe what you'd like this next chapter of work to be like
          </Label>
          <p className="text-sm text-muted-foreground">
            e.g. "I'm ready for another full-time leadership role" or "I'd like 3 days a week in a steadier, simpler role close to home."
          </p>
          <Textarea
            id="encore-summary"
            value={encoreSummary || ''}
            onChange={(e) => onSummaryChange(e.target.value || null)}
            maxLength={ENCORE_CHAR_LIMITS.encore_summary}
            placeholder="What does your ideal next chapter look like?"
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {(encoreSummary?.length || 0)}/{ENCORE_CHAR_LIMITS.encore_summary}
          </p>
        </div>
      </div>
    </div>
  );
}

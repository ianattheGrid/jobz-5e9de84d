import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Gem } from "lucide-react";
import { ENCORE_VALUE_OPTIONS, ENCORE_CHAR_LIMITS, MAX_ENCORE_VALUE_TAGS, MIN_ENCORE_VALUE_TAGS } from "./constants";
import { cn } from "@/lib/utils";

interface EncoreValueBlockProps {
  valueTags: string[];
  valueOther: string | null;
  valueNote: string | null;
  onValueTagsChange: (tags: string[]) => void;
  onValueOtherChange: (other: string | null) => void;
  onValueNoteChange: (note: string | null) => void;
}

export function EncoreValueBlock({
  valueTags,
  valueOther,
  valueNote,
  onValueTagsChange,
  onValueOtherChange,
  onValueNoteChange,
}: EncoreValueBlockProps) {
  const toggleTag = (key: string) => {
    if (valueTags.includes(key)) {
      onValueTagsChange(valueTags.filter(t => t !== key));
    } else if (valueTags.length < MAX_ENCORE_VALUE_TAGS) {
      onValueTagsChange([...valueTags, key]);
    }
  };

  const showOtherInput = valueTags.includes('other');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Gem className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">How I Can Add Value in This Next Chapter</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Pick the ways you're most able and happy to contribute now
          </Label>
          <p className="text-sm text-muted-foreground">
            Select {MIN_ENCORE_VALUE_TAGS}–{MAX_ENCORE_VALUE_TAGS} options. ({valueTags.length} selected)
          </p>
          <div className="space-y-2">
            {ENCORE_VALUE_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  valueTags.includes(option.key)
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50",
                  valueTags.length >= MAX_ENCORE_VALUE_TAGS && !valueTags.includes(option.key)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                )}
              >
                <Checkbox
                  checked={valueTags.includes(option.key)}
                  onCheckedChange={() => toggleTag(option.key)}
                  disabled={valueTags.length >= MAX_ENCORE_VALUE_TAGS && !valueTags.includes(option.key)}
                  className="mt-0.5"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {showOtherInput && (
          <div className="space-y-2">
            <Label htmlFor="value-other" className="text-base font-medium">
              Please specify other ways you can add value
            </Label>
            <Input
              id="value-other"
              value={valueOther || ''}
              onChange={(e) => onValueOtherChange(e.target.value || null)}
              maxLength={ENCORE_CHAR_LIMITS.encore_value_other}
              placeholder="Other ways you can contribute..."
            />
            <p className="text-xs text-muted-foreground text-right">
              {(valueOther?.length || 0)}/{ENCORE_CHAR_LIMITS.encore_value_other}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="value-note" className="text-base font-medium">
            Anything else you'd like employers to know about how you can add value? (optional)
          </Label>
          <Textarea
            id="value-note"
            value={valueNote || ''}
            onChange={(e) => onValueNoteChange(e.target.value || null)}
            maxLength={ENCORE_CHAR_LIMITS.encore_value_note}
            placeholder="Any additional notes..."
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {(valueNote?.length || 0)}/{ENCORE_CHAR_LIMITS.encore_value_note}
          </p>
        </div>
      </div>
    </div>
  );
}

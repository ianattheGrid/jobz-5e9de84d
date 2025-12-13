import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LEADERSHIP_CONTRIBUTION_OPTIONS, CORE_CHAR_LIMITS } from "./constants";

interface LeadershipContributionBlockProps {
  selectedTags: string[];
  note: string | null;
  onTagsChange: (value: string[]) => void;
  onNoteChange: (value: string | null) => void;
}

export function LeadershipContributionBlock({
  selectedTags,
  note,
  onTagsChange,
  onNoteChange,
}: LeadershipContributionBlockProps) {
  const toggleTag = (key: string) => {
    if (selectedTags.includes(key)) {
      onTagsChange(selectedTags.filter(t => t !== key));
    } else {
      onTagsChange([...selectedTags, key]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">👥</span> How I Lead & Contribute
        </h4>
        <p className="text-sm text-muted-foreground">
          How do you usually contribute – as a manager, project lead, specialist, or something else?
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {LEADERSHIP_CONTRIBUTION_OPTIONS.map((opt) => {
          const isSelected = selectedTags.includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => toggleTag(opt.key)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-medium transition-all border text-left",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground">
          Anything else about how you lead or contribute that employers should know? (optional)
        </label>
        <Textarea
          placeholder="e.g., I prefer leading by example rather than formal authority..."
          value={note || ''}
          onChange={(e) => onNoteChange(e.target.value.slice(0, CORE_CHAR_LIMITS.leadership_note) || null)}
          maxLength={CORE_CHAR_LIMITS.leadership_note}
          className="mt-1 resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {(note || '').length}/{CORE_CHAR_LIMITS.leadership_note}
        </p>
      </div>
    </div>
  );
}

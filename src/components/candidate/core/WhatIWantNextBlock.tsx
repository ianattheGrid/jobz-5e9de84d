import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  NEXT_ROLE_DIRECTION_OPTIONS, 
  CORE_MORE_OF_OPTIONS, 
  CORE_LESS_OF_OPTIONS,
  CORE_CHAR_LIMITS,
} from "./constants";

interface WhatIWantNextBlockProps {
  directionTags: string[];
  moreOfTags: string[];
  lessOfTags: string[];
  note: string | null;
  onDirectionTagsChange: (value: string[]) => void;
  onMoreOfTagsChange: (value: string[]) => void;
  onLessOfTagsChange: (value: string[]) => void;
  onNoteChange: (value: string | null) => void;
}

export function WhatIWantNextBlock({
  directionTags,
  moreOfTags,
  lessOfTags,
  note,
  onDirectionTagsChange,
  onMoreOfTagsChange,
  onLessOfTagsChange,
  onNoteChange,
}: WhatIWantNextBlockProps) {
  const toggleDirection = (key: string) => {
    if (directionTags.includes(key)) {
      onDirectionTagsChange(directionTags.filter(t => t !== key));
    } else {
      onDirectionTagsChange([...directionTags, key]);
    }
  };

  const toggleMoreOf = (key: string) => {
    if (moreOfTags.includes(key)) {
      onMoreOfTagsChange(moreOfTags.filter(t => t !== key));
    } else {
      onMoreOfTagsChange([...moreOfTags, key]);
    }
  };

  const toggleLessOf = (key: string) => {
    if (lessOfTags.includes(key)) {
      onLessOfTagsChange(lessOfTags.filter(t => t !== key));
    } else {
      onLessOfTagsChange([...lessOfTags, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🎯</span> What I Want Next
        </h4>
        <p className="text-sm text-muted-foreground">
          What kind of next step are you looking for?
        </p>
      </div>

      {/* Direction */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Direction (pick all that apply)</p>
        <div className="flex flex-wrap gap-2">
          {NEXT_ROLE_DIRECTION_OPTIONS.map((opt) => {
            const isSelected = directionTags.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleDirection(opt.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
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
      </div>

      {/* More Of */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">In your next role, you'd like more of…</p>
        <div className="flex flex-wrap gap-2">
          {CORE_MORE_OF_OPTIONS.map((opt) => {
            const isSelected = moreOfTags.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleMoreOf(opt.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  isSelected
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-background text-foreground border-border hover:border-green-500/50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Less Of */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">And you'd prefer less of…</p>
        <div className="flex flex-wrap gap-2">
          {CORE_LESS_OF_OPTIONS.map((opt) => {
            const isSelected = lessOfTags.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleLessOf(opt.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  isSelected
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-background text-foreground border-border hover:border-orange-500/50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="text-sm font-medium text-muted-foreground">
          In 1–2 sentences, what would a great next role look like for you? (optional)
        </label>
        <Textarea
          placeholder="e.g., A role where I can lead a team and drive operational improvements, ideally in a growing company where I can make a real impact."
          value={note || ''}
          onChange={(e) => onNoteChange(e.target.value.slice(0, CORE_CHAR_LIMITS.next_role_note) || null)}
          maxLength={CORE_CHAR_LIMITS.next_role_note}
          className="mt-1 resize-none"
          rows={3}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {(note || '').length}/{CORE_CHAR_LIMITS.next_role_note}
        </p>
      </div>
    </div>
  );
}

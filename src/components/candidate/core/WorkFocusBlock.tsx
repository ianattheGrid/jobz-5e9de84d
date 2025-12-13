import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  CORE_WORK_FOCUS_OPTIONS, 
  CORE_CHAR_LIMITS,
  MAX_CORE_WORK_FOCUS,
  MIN_CORE_WORK_FOCUS,
} from "./constants";

interface WorkFocusBlockProps {
  selectedTags: string[];
  oneThingWell: string | null;
  onTagsChange: (value: string[]) => void;
  onOneThingWellChange: (value: string | null) => void;
}

export function WorkFocusBlock({
  selectedTags,
  oneThingWell,
  onTagsChange,
  onOneThingWellChange,
}: WorkFocusBlockProps) {
  const toggleTag = (key: string) => {
    if (selectedTags.includes(key)) {
      onTagsChange(selectedTags.filter(t => t !== key));
    } else if (selectedTags.length < MAX_CORE_WORK_FOCUS) {
      onTagsChange([...selectedTags, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🛠️</span> The Work I'm Best At
        </h4>
        <p className="text-sm text-muted-foreground">
          Which types of work are you best at? Pick {MIN_CORE_WORK_FOCUS}–{MAX_CORE_WORK_FOCUS} that really fit you.
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(CORE_WORK_FOCUS_OPTIONS).map(([groupKey, group]) => (
          <div key={groupKey}>
            <p className="text-sm font-medium text-foreground mb-2">{group.label}</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((opt) => {
                const isSelected = selectedTags.includes(opt.key);
                const isDisabled = !isSelected && selectedTags.length >= MAX_CORE_WORK_FOCUS;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => toggleTag(opt.key)}
                    disabled={isDisabled}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-border hover:border-primary/50",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedTags.length}/{MAX_CORE_WORK_FOCUS} selected
      </p>

      <div>
        <label className="text-sm font-medium text-muted-foreground">
          If you had to pick one thing you do really well at work, what would it be? (optional)
        </label>
        <Textarea
          placeholder="e.g., I'm great at turning around under-performing teams and getting them back on track."
          value={oneThingWell || ''}
          onChange={(e) => onOneThingWellChange(e.target.value.slice(0, CORE_CHAR_LIMITS.one_thing_i_do_really_well) || null)}
          maxLength={CORE_CHAR_LIMITS.one_thing_i_do_really_well}
          className="mt-1 resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right mt-1">
          {(oneThingWell || '').length}/{CORE_CHAR_LIMITS.one_thing_i_do_really_well}
        </p>
      </div>
    </div>
  );
}

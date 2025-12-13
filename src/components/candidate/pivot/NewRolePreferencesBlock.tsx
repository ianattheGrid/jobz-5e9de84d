import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { CORE_MORE_OF_OPTIONS, CORE_LESS_OF_OPTIONS, PIVOT_CHAR_LIMITS } from "./constants";

interface NewRolePreferencesBlockProps {
  moreOfTags: string[];
  lessOfTags: string[];
  note: string | null;
  onMoreOfTagsChange: (value: string[]) => void;
  onLessOfTagsChange: (value: string[]) => void;
  onNoteChange: (value: string | null) => void;
}

export function NewRolePreferencesBlock({
  moreOfTags,
  lessOfTags,
  note,
  onMoreOfTagsChange,
  onLessOfTagsChange,
  onNoteChange,
}: NewRolePreferencesBlockProps) {
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
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">My Ideal First Step in My New Direction</h4>
      </div>

      {/* More Of */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">In your new role, you'd like more of...</Label>
        <div className="flex flex-wrap gap-2">
          {CORE_MORE_OF_OPTIONS.map((option) => {
            const isSelected = moreOfTags.includes(option.key);
            return (
              <Badge
                key={option.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5",
                  isSelected && "bg-green-500 hover:bg-green-600"
                )}
                onClick={() => toggleMoreOf(option.key)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Less Of */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">And you'd prefer less of...</Label>
        <div className="flex flex-wrap gap-2">
          {CORE_LESS_OF_OPTIONS.map((option) => {
            const isSelected = lessOfTags.includes(option.key);
            return (
              <Badge
                key={option.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5",
                  isSelected && "bg-red-500 hover:bg-red-600"
                )}
                onClick={() => toggleLessOf(option.key)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          What would a great first role in your new direction look like for you?
          <span className="text-muted-foreground ml-1">(Optional)</span>
        </Label>
        <Textarea
          value={note || ""}
          onChange={(e) => onNoteChange(e.target.value || null)}
          placeholder="Describe what an ideal first role would look like..."
          className="min-h-[80px] resize-none"
          maxLength={PIVOT_CHAR_LIMITS.new_role_note}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(note?.length || 0)}/{PIVOT_CHAR_LIMITS.new_role_note}
        </p>
      </div>
    </div>
  );
}

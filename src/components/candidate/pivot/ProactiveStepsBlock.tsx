import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen } from "lucide-react";
import { PIVOT_PREPARATION_OPTIONS, PIVOT_CHAR_LIMITS } from "./constants";

interface ProactiveStepsBlockProps {
  activities: string[];
  details: string | null;
  onActivitiesChange: (value: string[]) => void;
  onDetailsChange: (value: string | null) => void;
}

export function ProactiveStepsBlock({
  activities,
  details,
  onActivitiesChange,
  onDetailsChange,
}: ProactiveStepsBlockProps) {
  const toggleActivity = (key: string) => {
    if (activities.includes(key)) {
      onActivitiesChange(activities.filter(a => a !== key));
    } else {
      onActivitiesChange([...activities, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">My Commitment: How I'm Preparing for My New Path</h4>
      </div>

      {/* Preparation Activities */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          What steps have you taken to prepare for this career pivot?
          <span className="text-muted-foreground ml-1">(Select all that apply)</span>
        </Label>
        
        <div className="space-y-3">
          {PIVOT_PREPARATION_OPTIONS.map((option) => (
            <label
              key={option.key}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <Checkbox
                checked={activities.includes(option.key)}
                onCheckedChange={() => toggleActivity(option.key)}
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Briefly describe any key courses, projects, or experiences
          <span className="text-muted-foreground ml-1">(Optional)</span>
        </Label>
        <p className="text-xs text-muted-foreground">
          Example: "Completed a Google UX Design Professional Certificate. Built a portfolio website with 3 case studies."
        </p>
        <Textarea
          value={details || ""}
          onChange={(e) => onDetailsChange(e.target.value || null)}
          placeholder="Describe your preparation activities..."
          className="min-h-[100px] resize-none"
          maxLength={PIVOT_CHAR_LIMITS.pivot_preparation_details}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(details?.length || 0)}/{PIVOT_CHAR_LIMITS.pivot_preparation_details}
        </p>
      </div>
    </div>
  );
}

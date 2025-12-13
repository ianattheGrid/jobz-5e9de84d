import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock } from "lucide-react";
import { WORK_HOURS_OPTIONS, PACE_PREFERENCE_OPTIONS } from "./constants";
import { cn } from "@/lib/utils";

interface WorkPatternPaceBlockProps {
  workHoursPreferences: string[];
  pacePreferences: string[];
  onWorkHoursChange: (hours: string[]) => void;
  onPaceChange: (pace: string[]) => void;
}

export function WorkPatternPaceBlock({
  workHoursPreferences,
  pacePreferences,
  onWorkHoursChange,
  onPaceChange,
}: WorkPatternPaceBlockProps) {
  const toggleHours = (key: string) => {
    if (workHoursPreferences.includes(key)) {
      onWorkHoursChange(workHoursPreferences.filter(h => h !== key));
    } else {
      onWorkHoursChange([...workHoursPreferences, key]);
    }
  };

  const togglePace = (key: string) => {
    if (pacePreferences.includes(key)) {
      onPaceChange(pacePreferences.filter(p => p !== key));
    } else {
      onPaceChange([...pacePreferences, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">Work Pattern & Pace</h4>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            What work patterns are you open to?
          </Label>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
          <div className="space-y-2">
            {WORK_HOURS_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  workHoursPreferences.includes(option.key)
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={workHoursPreferences.includes(option.key)}
                  onCheckedChange={() => toggleHours(option.key)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">
            What kind of pace suits you best at this stage?
          </Label>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
          <div className="space-y-2">
            {PACE_PREFERENCE_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors",
                  pacePreferences.includes(option.key)
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={pacePreferences.includes(option.key)}
                  onCheckedChange={() => togglePace(option.key)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

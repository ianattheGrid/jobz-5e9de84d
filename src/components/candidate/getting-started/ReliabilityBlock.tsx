import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RELIABILITY_OPTIONS, TIME_OF_DAY_OPTIONS } from "./constants";

interface ReliabilityBlockProps {
  selectedTags: string[];
  preferredTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  weekendOk: boolean;
  onTagsChange: (tags: string[]) => void;
  onTimeChange: (time: 'morning' | 'afternoon' | 'evening' | 'flexible') => void;
  onWeekendChange: (ok: boolean) => void;
}

export function ReliabilityBlock({
  selectedTags,
  preferredTime,
  weekendOk,
  onTagsChange,
  onTimeChange,
  onWeekendChange,
}: ReliabilityBlockProps) {
  const handleToggle = (key: string) => {
    if (selectedTags.includes(key)) {
      onTagsChange(selectedTags.filter(k => k !== key));
    } else {
      onTagsChange([...selectedTags, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground">Reliability & Availability</h4>
        <p className="text-sm text-muted-foreground">
          Help employers know when you're available and how reliable you are
        </p>
      </div>
      
      {/* Reliability checkboxes */}
      <div className="grid gap-3">
        {RELIABILITY_OPTIONS.map((option) => {
          const isSelected = selectedTags.includes(option.key);
          
          return (
            <label
              key={option.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-primary/5 border-primary/30' 
                  : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(option.key)}
              />
              <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Time of day preference */}
      <div className="pt-4 border-t border-border">
        <Label className="text-sm font-medium text-muted-foreground mb-3 block">
          When are you most energetic?
        </Label>
        <RadioGroup
          value={preferredTime}
          onValueChange={(value) => onTimeChange(value as typeof preferredTime)}
          className="grid grid-cols-2 gap-3"
        >
          {TIME_OF_DAY_OPTIONS.map((option) => (
            <label
              key={option.key}
              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                preferredTime === option.key
                  ? 'bg-primary/5 border-primary/30'
                  : 'bg-background border-border hover:border-primary/30'
              }`}
            >
              <RadioGroupItem value={option.key} />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Weekend toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-background">
        <Label htmlFor="weekend-ok" className="text-sm text-muted-foreground">
          Open to working weekends
        </Label>
        <Switch
          id="weekend-ok"
          checked={weekendOk}
          onCheckedChange={onWeekendChange}
        />
      </div>
    </div>
  );
}

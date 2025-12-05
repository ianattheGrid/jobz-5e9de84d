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
        <h4 className="font-semibold text-gray-900">Reliability & Availability</h4>
        <p className="text-sm text-gray-600">
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
                  ? 'bg-pink-50 border-pink-300' 
                  : 'bg-white border-gray-200 hover:border-pink-200 hover:bg-pink-50/50'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(option.key)}
                className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
              />
              <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Time of day preference */}
      <div className="pt-4 border-t">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
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
                  ? 'bg-pink-50 border-pink-300'
                  : 'bg-white border-gray-200 hover:border-pink-200'
              }`}
            >
              <RadioGroupItem value={option.key} className="text-pink-600" />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Weekend toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border bg-white">
        <Label htmlFor="weekend-ok" className="text-sm text-gray-700">
          Open to working weekends
        </Label>
        <Switch
          id="weekend-ok"
          checked={weekendOk}
          onCheckedChange={onWeekendChange}
          className="data-[state=checked]:bg-pink-600"
        />
      </div>
    </div>
  );
}

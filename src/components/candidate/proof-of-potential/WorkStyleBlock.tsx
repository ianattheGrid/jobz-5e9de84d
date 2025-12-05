import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { WORK_STYLE_OPTIONS, MAX_WORK_STYLE_SELECTIONS } from "./constants";

interface WorkStyleBlockProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function WorkStyleBlock({ selected, onChange }: WorkStyleBlockProps) {
  const handleToggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter(k => k !== key));
    } else if (selected.length < MAX_WORK_STYLE_SELECTIONS) {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-gray-900">My Work Style</h4>
        <p className="text-sm text-gray-600">
          Pick up to {MAX_WORK_STYLE_SELECTIONS} that sound like you ({selected.length}/{MAX_WORK_STYLE_SELECTIONS} selected)
        </p>
      </div>
      
      <div className="grid gap-3">
        {WORK_STYLE_OPTIONS.map((option) => {
          const isSelected = selected.includes(option.key);
          const isDisabled = !isSelected && selected.length >= MAX_WORK_STYLE_SELECTIONS;
          
          return (
            <label
              key={option.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                isSelected 
                  ? 'bg-pink-50 border-pink-300' 
                  : isDisabled 
                    ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                    : 'bg-white border-gray-200 hover:border-pink-200 hover:bg-pink-50/50'
              }`}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(option.key)}
                disabled={isDisabled}
                className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
              />
              <span className={`text-sm ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

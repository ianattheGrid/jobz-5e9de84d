import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EXPERIENCE_CONTEXT_OPTIONS, CHAR_LIMITS } from "./constants";

interface ExperienceContextBlockProps {
  selectedTags: string[];
  otherText: string | null;
  proudOf: string | null;
  onTagsChange: (tags: string[]) => void;
  onOtherChange: (text: string | null) => void;
  onProudOfChange: (text: string | null) => void;
}

export function ExperienceContextBlock({
  selectedTags,
  otherText,
  proudOf,
  onTagsChange,
  onOtherChange,
  onProudOfChange,
}: ExperienceContextBlockProps) {
  const handleToggle = (key: string) => {
    if (selectedTags.includes(key)) {
      onTagsChange(selectedTags.filter(k => k !== key));
    } else {
      onTagsChange([...selectedTags, key]);
    }
  };

  const showOtherInput = selectedTags.includes('other');

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground">Things I've Done (even if not a job)</h4>
        <p className="text-sm text-muted-foreground">
          Select any that apply - helps employers see you have real-world experience
        </p>
      </div>
      
      <div className="grid gap-3">
        {EXPERIENCE_CONTEXT_OPTIONS.map((option) => {
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
        
        {/* Other option */}
        <label
          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
            showOtherInput 
              ? 'bg-primary/5 border-primary/30' 
              : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
          }`}
        >
          <Checkbox
            checked={showOtherInput}
            onCheckedChange={() => {
              if (showOtherInput) {
                onTagsChange(selectedTags.filter(k => k !== 'other'));
                onOtherChange(null);
              } else {
                onTagsChange([...selectedTags, 'other']);
              }
            }}
          />
          <span className={`text-sm ${showOtherInput ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
            Other
          </span>
        </label>
        
        {showOtherInput && (
          <div className="ml-8">
            <Input
              placeholder="Describe briefly..."
              value={otherText || ''}
              onChange={(e) => onOtherChange(e.target.value.slice(0, CHAR_LIMITS.experience_context_other))}
              maxLength={CHAR_LIMITS.experience_context_other}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {(otherText || '').length}/{CHAR_LIMITS.experience_context_other}
            </p>
          </div>
        )}
      </div>

      {/* Proud of section */}
      <div className="pt-4 border-t border-border">
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Optional: briefly describe one thing you've done that you're proud of
          </span>
          <Textarea
            placeholder="e.g., Helped run my family shop every weekend..."
            value={proudOf || ''}
            onChange={(e) => onProudOfChange(e.target.value.slice(0, CHAR_LIMITS.experience_proud_of))}
            maxLength={CHAR_LIMITS.experience_proud_of}
            className="mt-2 text-sm resize-none"
            rows={2}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(proudOf || '').length}/{CHAR_LIMITS.experience_proud_of}
          </p>
        </label>
      </div>
    </div>
  );
}

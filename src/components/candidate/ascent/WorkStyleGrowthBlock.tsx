import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { WORK_STYLE_GROWTH_OPTIONS, ASCENT_CHAR_LIMITS } from "./constants";

interface WorkStyleGrowthBlockProps {
  selectedTags: string[];
  otherText: string | null;
  onTagsChange: (tags: string[]) => void;
  onOtherChange: (text: string | null) => void;
}

export function WorkStyleGrowthBlock({
  selectedTags,
  otherText,
  onTagsChange,
  onOtherChange,
}: WorkStyleGrowthBlockProps) {
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
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">📈</span> How My Work Style Has Evolved
        </h4>
        <p className="text-sm text-muted-foreground">
          Show how you've grown beyond "just starting out" – pick all that apply
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {WORK_STYLE_GROWTH_OPTIONS.map((option) => {
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
      </div>
      
      {showOtherInput && (
        <div>
          <Input
            placeholder="Please specify..."
            value={otherText || ''}
            onChange={(e) => onOtherChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.work_style_growth_other))}
            maxLength={ASCENT_CHAR_LIMITS.work_style_growth_other}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(otherText || '').length}/{ASCENT_CHAR_LIMITS.work_style_growth_other}
          </p>
        </div>
      )}
    </div>
  );
}

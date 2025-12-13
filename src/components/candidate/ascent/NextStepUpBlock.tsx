import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NEXT_STEP_OPTIONS, ASCENT_CHAR_LIMITS } from "./constants";

interface NextStepUpBlockProps {
  selectedTags: string[];
  otherText: string | null;
  noteText: string | null;
  onTagsChange: (tags: string[]) => void;
  onOtherChange: (text: string | null) => void;
  onNoteChange: (text: string | null) => void;
}

export function NextStepUpBlock({
  selectedTags,
  otherText,
  noteText,
  onTagsChange,
  onOtherChange,
  onNoteChange,
}: NextStepUpBlockProps) {
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
          <span className="text-primary">🎯</span> A Step Up Would Look Like...
        </h4>
        <p className="text-sm text-muted-foreground">
          What would feel like a good 'next step up' for you?
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {NEXT_STEP_OPTIONS.map((option) => {
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
            onChange={(e) => onOtherChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.next_step_other))}
            maxLength={ASCENT_CHAR_LIMITS.next_step_other}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(otherText || '').length}/{ASCENT_CHAR_LIMITS.next_step_other}
          </p>
        </div>
      )}

      {/* Additional note */}
      <div className="pt-4 border-t border-border">
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Anything else about your next step you'd like employers to know? (optional)
          </span>
          <Textarea
            placeholder="e.g., I'm looking for a company that will invest in my development..."
            value={noteText || ''}
            onChange={(e) => onNoteChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.next_step_note) || null)}
            maxLength={ASCENT_CHAR_LIMITS.next_step_note}
            className="mt-2 text-sm resize-none"
            rows={2}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(noteText || '').length}/{ASCENT_CHAR_LIMITS.next_step_note}
          </p>
        </label>
      </div>
    </div>
  );
}

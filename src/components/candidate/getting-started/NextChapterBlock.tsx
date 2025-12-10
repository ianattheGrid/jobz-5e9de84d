import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SECTOR_OPTIONS, CHAR_LIMITS } from "./constants";

interface NextChapterBlockProps {
  selectedSectors: string[];
  otherSector: string | null;
  freeText: string | null;
  onSectorsChange: (sectors: string[]) => void;
  onOtherChange: (text: string | null) => void;
  onFreeTextChange: (text: string | null) => void;
}

export function NextChapterBlock({
  selectedSectors,
  otherSector,
  freeText,
  onSectorsChange,
  onOtherChange,
  onFreeTextChange,
}: NextChapterBlockProps) {
  const handleToggle = (key: string) => {
    if (selectedSectors.includes(key)) {
      onSectorsChange(selectedSectors.filter(k => k !== key));
    } else {
      onSectorsChange([...selectedSectors, key]);
    }
  };

  const showOtherInput = selectedSectors.includes('other');

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground">My Next Chapter</h4>
        <p className="text-sm text-muted-foreground">
          What industries or areas interest you? Select all that appeal
        </p>
      </div>
      
      <div className="grid sm:grid-cols-2 gap-3">
        {SECTOR_OPTIONS.map((option) => {
          const isSelected = selectedSectors.includes(option.key);
          
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
                onSectorsChange(selectedSectors.filter(k => k !== 'other'));
                onOtherChange(null);
              } else {
                onSectorsChange([...selectedSectors, 'other']);
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
            placeholder="What other industry interests you?"
            value={otherSector || ''}
            onChange={(e) => onOtherChange(e.target.value.slice(0, CHAR_LIMITS.next_chapter_sectors_other))}
            maxLength={CHAR_LIMITS.next_chapter_sectors_other}
            className="text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(otherSector || '').length}/{CHAR_LIMITS.next_chapter_sectors_other}
          </p>
        </div>
      )}

      {/* Free text section */}
      <div className="pt-4 border-t border-border">
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            In your own words (optional): what would you like your next chapter of work to look like?
          </span>
          <Textarea
            placeholder="e.g., I'd like to move into something creative or media-related, starting with social media or content roles..."
            value={freeText || ''}
            onChange={(e) => onFreeTextChange(e.target.value.slice(0, CHAR_LIMITS.next_chapter_text))}
            maxLength={CHAR_LIMITS.next_chapter_text}
            className="mt-2 text-sm resize-none"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(freeText || '').length}/{CHAR_LIMITS.next_chapter_text}
          </p>
        </label>
      </div>
    </div>
  );
}

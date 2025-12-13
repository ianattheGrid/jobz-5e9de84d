import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { MORE_OF_OPTIONS, LESS_OF_OPTIONS, ASCENT_CHAR_LIMITS } from "./constants";

interface MoreOfLessOfBlockProps {
  moreOfTags: string[];
  moreOfOther: string | null;
  lessOfTags: string[];
  lessOfOther: string | null;
  onMoreOfTagsChange: (tags: string[]) => void;
  onMoreOfOtherChange: (text: string | null) => void;
  onLessOfTagsChange: (tags: string[]) => void;
  onLessOfOtherChange: (text: string | null) => void;
}

export function MoreOfLessOfBlock({
  moreOfTags,
  moreOfOther,
  lessOfTags,
  lessOfOther,
  onMoreOfTagsChange,
  onMoreOfOtherChange,
  onLessOfTagsChange,
  onLessOfOtherChange,
}: MoreOfLessOfBlockProps) {
  const handleMoreOfToggle = (key: string) => {
    if (moreOfTags.includes(key)) {
      onMoreOfTagsChange(moreOfTags.filter(k => k !== key));
    } else {
      onMoreOfTagsChange([...moreOfTags, key]);
    }
  };

  const handleLessOfToggle = (key: string) => {
    if (lessOfTags.includes(key)) {
      onLessOfTagsChange(lessOfTags.filter(k => k !== key));
    } else {
      onLessOfTagsChange([...lessOfTags, key]);
    }
  };

  const showMoreOfOther = moreOfTags.includes('other');
  const showLessOfOther = lessOfTags.includes('other');

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">⚖️</span> What I Want More Of / Less Of Next
        </h4>
        <p className="text-sm text-muted-foreground">
          Help us find roles that match your preferences
        </p>
      </div>

      {/* More Of */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          In your next role, you'd like <span className="text-primary">more of</span>...
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {MORE_OF_OPTIONS.map((option) => {
            const isSelected = moreOfTags.includes(option.key);
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
                  onCheckedChange={() => handleMoreOfToggle(option.key)}
                />
                <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
          
          {/* Other option for More Of */}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              showMoreOfOther 
                ? 'bg-primary/5 border-primary/30' 
                : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <Checkbox
              checked={showMoreOfOther}
              onCheckedChange={() => {
                if (showMoreOfOther) {
                  onMoreOfTagsChange(moreOfTags.filter(k => k !== 'other'));
                  onMoreOfOtherChange(null);
                } else {
                  onMoreOfTagsChange([...moreOfTags, 'other']);
                }
              }}
            />
            <span className={`text-sm ${showMoreOfOther ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Other
            </span>
          </label>
        </div>
        
        {showMoreOfOther && (
          <div>
            <Input
              placeholder="Please specify..."
              value={moreOfOther || ''}
              onChange={(e) => onMoreOfOtherChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.next_role_more_of_other))}
              maxLength={ASCENT_CHAR_LIMITS.next_role_more_of_other}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {(moreOfOther || '').length}/{ASCENT_CHAR_LIMITS.next_role_more_of_other}
            </p>
          </div>
        )}
      </div>

      {/* Less Of */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          In your next role, you'd prefer <span className="text-destructive">less of</span>...
        </label>
        <div className="grid sm:grid-cols-2 gap-2">
          {LESS_OF_OPTIONS.map((option) => {
            const isSelected = lessOfTags.includes(option.key);
            return (
              <label
                key={option.key}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-destructive/5 border-destructive/30' 
                    : 'bg-background border-border hover:border-destructive/30 hover:bg-destructive/5'
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleLessOfToggle(option.key)}
                />
                <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
          
          {/* Other option for Less Of */}
          <label
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              showLessOfOther 
                ? 'bg-destructive/5 border-destructive/30' 
                : 'bg-background border-border hover:border-destructive/30 hover:bg-destructive/5'
            }`}
          >
            <Checkbox
              checked={showLessOfOther}
              onCheckedChange={() => {
                if (showLessOfOther) {
                  onLessOfTagsChange(lessOfTags.filter(k => k !== 'other'));
                  onLessOfOtherChange(null);
                } else {
                  onLessOfTagsChange([...lessOfTags, 'other']);
                }
              }}
            />
            <span className={`text-sm ${showLessOfOther ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
              Other
            </span>
          </label>
        </div>
        
        {showLessOfOther && (
          <div>
            <Input
              placeholder="Please specify..."
              value={lessOfOther || ''}
              onChange={(e) => onLessOfOtherChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.next_role_less_of_other))}
              maxLength={ASCENT_CHAR_LIMITS.next_role_less_of_other}
              className="text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {(lessOfOther || '').length}/{ASCENT_CHAR_LIMITS.next_role_less_of_other}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

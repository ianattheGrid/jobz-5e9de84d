import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { SECTOR_OPTIONS } from "../getting-started/constants";
import { ASCENT_CHAR_LIMITS } from "./constants";

interface DirectionSectorsBlockProps {
  currentSectors: string[];
  interestedSectors: string[];
  directionNote: string | null;
  onCurrentSectorsChange: (sectors: string[]) => void;
  onInterestedSectorsChange: (sectors: string[]) => void;
  onDirectionNoteChange: (note: string | null) => void;
}

export function DirectionSectorsBlock({
  currentSectors,
  interestedSectors,
  directionNote,
  onCurrentSectorsChange,
  onInterestedSectorsChange,
  onDirectionNoteChange,
}: DirectionSectorsBlockProps) {
  const handleCurrentToggle = (key: string) => {
    if (currentSectors.includes(key)) {
      onCurrentSectorsChange(currentSectors.filter(k => k !== key));
    } else {
      onCurrentSectorsChange([...currentSectors, key]);
    }
  };

  const handleInterestedToggle = (key: string) => {
    if (interestedSectors.includes(key)) {
      onInterestedSectorsChange(interestedSectors.filter(k => k !== key));
    } else {
      onInterestedSectorsChange([...interestedSectors, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">📍</span> Direction & Sectors
        </h4>
        <p className="text-sm text-muted-foreground">
          Tell us where you've worked and where you're interested in going
        </p>
      </div>

      {/* Current sectors */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Which sectors have you worked in so far?
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {SECTOR_OPTIONS.map((option) => {
            const isSelected = currentSectors.includes(option.key);
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
                  onCheckedChange={() => handleCurrentToggle(option.key)}
                />
                <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Interested sectors */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Which sectors are you interested in for your next role?
        </label>
        <div className="grid sm:grid-cols-2 gap-3">
          {SECTOR_OPTIONS.map((option) => {
            const isSelected = interestedSectors.includes(option.key);
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
                  onCheckedChange={() => handleInterestedToggle(option.key)}
                />
                <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Direction note */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Optional: briefly explain your direction
        </label>
        <Textarea
          placeholder="e.g., I've worked in hospitality but I'd like to move into office/admin next..."
          value={directionNote || ''}
          onChange={(e) => onDirectionNoteChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.direction_note) || null)}
          maxLength={ASCENT_CHAR_LIMITS.direction_note}
          className="text-sm resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground text-right">
          {(directionNote || '').length}/{ASCENT_CHAR_LIMITS.direction_note}
        </p>
      </div>
    </div>
  );
}

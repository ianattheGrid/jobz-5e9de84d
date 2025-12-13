import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2 } from "lucide-react";
import { SECTOR_OPTIONS, ENCORE_CHAR_LIMITS } from "./constants";
import { cn } from "@/lib/utils";

interface EncoreSectorsBlockProps {
  sectorsExperience: string[];
  sectorsInterestedNext: string[];
  sectorShiftNote: string | null;
  onSectorsExperienceChange: (sectors: string[]) => void;
  onSectorsInterestedNextChange: (sectors: string[]) => void;
  onSectorShiftNoteChange: (note: string | null) => void;
}

export function EncoreSectorsBlock({
  sectorsExperience,
  sectorsInterestedNext,
  sectorShiftNote,
  onSectorsExperienceChange,
  onSectorsInterestedNextChange,
  onSectorShiftNoteChange,
}: EncoreSectorsBlockProps) {
  const toggleExperience = (key: string) => {
    if (sectorsExperience.includes(key)) {
      onSectorsExperienceChange(sectorsExperience.filter(s => s !== key));
    } else {
      onSectorsExperienceChange([...sectorsExperience, key]);
    }
  };

  const toggleInterested = (key: string) => {
    if (sectorsInterestedNext.includes(key)) {
      onSectorsInterestedNextChange(sectorsInterestedNext.filter(s => s !== key));
    } else {
      onSectorsInterestedNextChange([...sectorsInterestedNext, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">Sectors I've Worked In & Sectors I'm Open To</h4>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Which sectors have you mainly worked in so far?
          </Label>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {SECTOR_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                  sectorsExperience.includes(option.key)
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={sectorsExperience.includes(option.key)}
                  onCheckedChange={() => toggleExperience(option.key)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">
            Which sectors are you open to working in now?
          </Label>
          <p className="text-sm text-muted-foreground">You can keep your current sector or choose others.</p>
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {SECTOR_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                  sectorsInterestedNext.includes(option.key)
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={sectorsInterestedNext.includes(option.key)}
                  onCheckedChange={() => toggleInterested(option.key)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sector-shift" className="text-base font-medium">
          If you're changing sectors, briefly explain from what to what (optional)
        </Label>
        <Textarea
          id="sector-shift"
          value={sectorShiftNote || ''}
          onChange={(e) => onSectorShiftNoteChange(e.target.value || null)}
          maxLength={ENCORE_CHAR_LIMITS.sector_shift_note}
          placeholder="e.g. Moving from retail management to education administration..."
          className="min-h-[80px]"
        />
        <p className="text-xs text-muted-foreground text-right">
          {(sectorShiftNote?.length || 0)}/{ENCORE_CHAR_LIMITS.sector_shift_note}
        </p>
      </div>
    </div>
  );
}

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { 
  SECTOR_OPTIONS, 
  YEARS_EXPERIENCE_OPTIONS, 
  CORE_STRENGTH_OPTIONS,
  MAX_CORE_STRENGTHS,
  MIN_CORE_STRENGTHS,
} from "./constants";

interface SnapshotBlockProps {
  currentRoleTitle: string | null;
  currentSector: string | null;
  yearsExperienceRange: string | null;
  coreStrengthTags: string[];
  onRoleTitleChange: (value: string | null) => void;
  onSectorChange: (value: string | null) => void;
  onYearsExperienceChange: (value: string | null) => void;
  onStrengthTagsChange: (value: string[]) => void;
}

export function SnapshotBlock({
  currentRoleTitle,
  currentSector,
  yearsExperienceRange,
  coreStrengthTags,
  onRoleTitleChange,
  onSectorChange,
  onYearsExperienceChange,
  onStrengthTagsChange,
}: SnapshotBlockProps) {
  const toggleStrength = (key: string) => {
    if (coreStrengthTags.includes(key)) {
      onStrengthTagsChange(coreStrengthTags.filter(t => t !== key));
    } else if (coreStrengthTags.length < MAX_CORE_STRENGTHS) {
      onStrengthTagsChange([...coreStrengthTags, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">📊</span> Where I Am Now
        </h4>
        <p className="text-sm text-muted-foreground">
          Tell us where you are in your career right now
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground">Current role title</label>
          <Input
            placeholder="e.g., Operations Manager, Senior Account Executive"
            value={currentRoleTitle || ''}
            onChange={(e) => onRoleTitleChange(e.target.value || null)}
            className="mt-1"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Current sector</label>
          <Select
            value={currentSector || ''}
            onValueChange={(v) => onSectorChange(v || null)}
          >
            <SelectTrigger className="mt-1 bg-background">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border z-50">
              {SECTOR_OPTIONS.map((sector) => (
                <SelectItem key={sector.key} value={sector.key}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">Approximate years of experience</label>
        <Select
          value={yearsExperienceRange || ''}
          onValueChange={(v) => onYearsExperienceChange(v || null)}
        >
          <SelectTrigger className="mt-1 w-full md:w-64 bg-background">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="bg-background border border-border z-50">
            {YEARS_EXPERIENCE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground">
          Core strengths ({MIN_CORE_STRENGTHS}-{MAX_CORE_STRENGTHS})
        </label>
        <p className="text-sm text-muted-foreground mb-3">
          Pick {MIN_CORE_STRENGTHS}–{MAX_CORE_STRENGTHS} areas that best describe your core strengths
        </p>
        <div className="flex flex-wrap gap-2">
          {CORE_STRENGTH_OPTIONS.map((opt) => {
            const isSelected = coreStrengthTags.includes(opt.key);
            const isDisabled = !isSelected && coreStrengthTags.length >= MAX_CORE_STRENGTHS;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleStrength(opt.key)}
                disabled={isDisabled}
                className={cn(
                  "px-3 py-2 rounded-full text-sm font-medium transition-all border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {coreStrengthTags.length}/{MAX_CORE_STRENGTHS} selected
        </p>
      </div>
    </div>
  );
}

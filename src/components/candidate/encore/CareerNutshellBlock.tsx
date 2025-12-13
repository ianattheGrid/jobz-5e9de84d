import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase } from "lucide-react";
import { PRIMARY_CAREER_AREA_OPTIONS, YEARS_EXPERIENCE_OPTIONS, ENCORE_CHAR_LIMITS } from "./constants";
import { cn } from "@/lib/utils";

interface CareerNutshellBlockProps {
  primaryCareerAreas: string[];
  yearsExperience: string | null;
  careerHeadline: string | null;
  onCareerAreasChange: (areas: string[]) => void;
  onYearsExperienceChange: (years: string | null) => void;
  onCareerHeadlineChange: (headline: string | null) => void;
}

export function CareerNutshellBlock({
  primaryCareerAreas,
  yearsExperience,
  careerHeadline,
  onCareerAreasChange,
  onYearsExperienceChange,
  onCareerHeadlineChange,
}: CareerNutshellBlockProps) {
  const toggleArea = (key: string) => {
    if (primaryCareerAreas.includes(key)) {
      onCareerAreasChange(primaryCareerAreas.filter(a => a !== key));
    } else {
      onCareerAreasChange([...primaryCareerAreas, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="h-5 w-5 text-amber-600" />
        <h4 className="text-lg font-semibold text-foreground">My Career in a Nutshell</h4>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Roughly how many years of experience do you have in total?
          </Label>
          <Select
            value={yearsExperience || ''}
            onValueChange={(v) => onYearsExperienceChange(v || null)}
          >
            <SelectTrigger className="w-full md:w-[250px]">
              <SelectValue placeholder="Select years of experience" />
            </SelectTrigger>
            <SelectContent>
              {YEARS_EXPERIENCE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-medium">
            Which main areas has your career been in?
          </Label>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {PRIMARY_CAREER_AREA_OPTIONS.map((option) => (
              <label
                key={option.key}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors",
                  primaryCareerAreas.includes(option.key)
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-border hover:bg-muted/50"
                )}
              >
                <Checkbox
                  checked={primaryCareerAreas.includes(option.key)}
                  onCheckedChange={() => toggleArea(option.key)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="career-headline" className="text-base font-medium">
            In one short line, how would you describe your career so far?
          </Label>
          <p className="text-sm text-muted-foreground">
            Example: "20+ years in retail operations and store leadership across national brands."
          </p>
          <Textarea
            id="career-headline"
            value={careerHeadline || ''}
            onChange={(e) => onCareerHeadlineChange(e.target.value || null)}
            maxLength={ENCORE_CHAR_LIMITS.career_headline}
            placeholder="Summarise your career in one line..."
            className="min-h-[80px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {(careerHeadline?.length || 0)}/{ENCORE_CHAR_LIMITS.career_headline}
          </p>
        </div>
      </div>
    </div>
  );
}

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { WORK_ENVIRONMENT_OPTIONS, WORK_STRUCTURE_OPTIONS } from "./constants";

interface PivotWorkPreferencesBlockProps {
  environmentTags: string[];
  structureTags: string[];
  onEnvironmentTagsChange: (value: string[]) => void;
  onStructureTagsChange: (value: string[]) => void;
}

export function PivotWorkPreferencesBlock({
  environmentTags,
  structureTags,
  onEnvironmentTagsChange,
  onStructureTagsChange,
}: PivotWorkPreferencesBlockProps) {
  const toggleEnvironment = (key: string) => {
    if (environmentTags.includes(key)) {
      onEnvironmentTagsChange(environmentTags.filter(t => t !== key));
    } else {
      onEnvironmentTagsChange([...environmentTags, key]);
    }
  };

  const toggleStructure = (key: string) => {
    if (structureTags.includes(key)) {
      onStructureTagsChange(structureTags.filter(t => t !== key));
    } else {
      onStructureTagsChange([...structureTags, key]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">Where I Do My Best Work</h4>
      </div>

      {/* Environment */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What kind of environment helps you thrive?</Label>
        <div className="flex flex-wrap gap-2">
          {WORK_ENVIRONMENT_OPTIONS.map((option) => {
            const isSelected = environmentTags.includes(option.key);
            return (
              <Badge
                key={option.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5",
                  isSelected && "bg-orange-500 hover:bg-orange-600"
                )}
                onClick={() => toggleEnvironment(option.key)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Structure */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What work structure are you looking for?</Label>
        <div className="flex flex-wrap gap-2">
          {WORK_STRUCTURE_OPTIONS.map((option) => {
            const isSelected = structureTags.includes(option.key);
            return (
              <Badge
                key={option.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5",
                  isSelected && "bg-orange-500 hover:bg-orange-600"
                )}
                onClick={() => toggleStructure(option.key)}
              >
                {option.label}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { WORK_ENVIRONMENT_OPTIONS, WORK_STRUCTURE_OPTIONS } from "./constants";

interface WorkPreferencesBlockProps {
  environmentTags: string[];
  structureTags: string[];
  onEnvironmentTagsChange: (value: string[]) => void;
  onStructureTagsChange: (value: string[]) => void;
}

export function WorkPreferencesBlock({
  environmentTags,
  structureTags,
  onEnvironmentTagsChange,
  onStructureTagsChange,
}: WorkPreferencesBlockProps) {
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
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🏢</span> Work Preferences & Environment
        </h4>
        <p className="text-sm text-muted-foreground">
          What kind of environment do you do your best work in?
        </p>
      </div>

      {/* Environment */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Environment type</p>
        <div className="flex flex-wrap gap-2">
          {WORK_ENVIRONMENT_OPTIONS.map((opt) => {
            const isSelected = environmentTags.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleEnvironment(opt.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Structure */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2">Work structure</p>
        <div className="flex flex-wrap gap-2">
          {WORK_STRUCTURE_OPTIONS.map((opt) => {
            const isSelected = structureTags.includes(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => toggleStructure(opt.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

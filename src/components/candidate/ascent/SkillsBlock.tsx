import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { WORK_SKILLS_OPTIONS, ASCENT_CHAR_LIMITS, MAX_WORK_SKILLS } from "./constants";

interface SkillsBlockProps {
  selectedSkills: string[];
  toolsOrSystems: string | null;
  onSkillsChange: (skills: string[]) => void;
  onToolsChange: (tools: string | null) => void;
}

const SKILL_GROUPS = [
  { key: 'people_service', label: 'People & Service', options: WORK_SKILLS_OPTIONS.people_service },
  { key: 'practical_operational', label: 'Practical & Operational', options: WORK_SKILLS_OPTIONS.practical_operational },
  { key: 'organising_admin', label: 'Organising & Admin', options: WORK_SKILLS_OPTIONS.organising_admin },
  { key: 'creative_problem_solving', label: 'Creative & Problem-solving', options: WORK_SKILLS_OPTIONS.creative_problem_solving },
];

export function SkillsBlock({
  selectedSkills,
  toolsOrSystems,
  onSkillsChange,
  onToolsChange,
}: SkillsBlockProps) {
  const handleToggle = (key: string) => {
    if (selectedSkills.includes(key)) {
      onSkillsChange(selectedSkills.filter(k => k !== key));
    } else if (selectedSkills.length < MAX_WORK_SKILLS) {
      onSkillsChange([...selectedSkills, key]);
    }
  };

  const canSelectMore = selectedSkills.length < MAX_WORK_SKILLS;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <span className="text-primary">🛠️</span> Skills I Use Most at Work
        </h4>
        <p className="text-sm text-muted-foreground">
          Pick up to {MAX_WORK_SKILLS} skills you use regularly ({selectedSkills.length}/{MAX_WORK_SKILLS} selected)
        </p>
      </div>

      {SKILL_GROUPS.map((group) => (
        <div key={group.key} className="space-y-2">
          <label className="text-sm font-medium text-foreground">{group.label}</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {group.options.map((option) => {
              const isSelected = selectedSkills.includes(option.key);
              const isDisabled = !isSelected && !canSelectMore;
              
              return (
                <label
                  key={option.key}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary/5 border-primary/30' 
                      : isDisabled
                      ? 'bg-muted/50 border-border cursor-not-allowed opacity-50'
                      : 'bg-background border-border hover:border-primary/30 hover:bg-primary/5'
                  }`}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(option.key)}
                    disabled={isDisabled}
                  />
                  <span className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {/* Tools & Systems */}
      <div className="pt-4 border-t border-border">
        <label className="block">
          <span className="text-sm font-medium text-muted-foreground">
            Any tools or systems you're comfortable using?
          </span>
          <Input
            placeholder="e.g., Excel, Shopify, CRM, booking systems..."
            value={toolsOrSystems || ''}
            onChange={(e) => onToolsChange(e.target.value.slice(0, ASCENT_CHAR_LIMITS.tools_or_systems) || null)}
            maxLength={ASCENT_CHAR_LIMITS.tools_or_systems}
            className="mt-2"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            {(toolsOrSystems || '').length}/{ASCENT_CHAR_LIMITS.tools_or_systems}
          </p>
        </label>
      </div>
    </div>
  );
}

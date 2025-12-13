import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  TRANSFERABLE_SKILLS_OPTIONS, 
  PIVOT_CHAR_LIMITS,
  MAX_TRANSFERABLE_SKILLS,
  MIN_TRANSFERABLE_SKILLS,
  MAX_SKILL_EXAMPLES,
  MIN_SKILL_EXAMPLES,
} from "./constants";

interface TransferableStrengthsBlockProps {
  selectedSkills: string[];
  examples: string[];
  onSkillsChange: (value: string[]) => void;
  onExamplesChange: (value: string[]) => void;
}

export function TransferableStrengthsBlock({
  selectedSkills,
  examples,
  onSkillsChange,
  onExamplesChange,
}: TransferableStrengthsBlockProps) {
  const toggleSkill = (key: string) => {
    if (selectedSkills.includes(key)) {
      onSkillsChange(selectedSkills.filter(s => s !== key));
    } else if (selectedSkills.length < MAX_TRANSFERABLE_SKILLS) {
      onSkillsChange([...selectedSkills, key]);
    }
  };

  const addExample = () => {
    if (examples.length < MAX_SKILL_EXAMPLES) {
      onExamplesChange([...examples, ""]);
    }
  };

  const updateExample = (index: number, value: string) => {
    const updated = [...examples];
    updated[index] = value;
    onExamplesChange(updated);
  };

  const removeExample = (index: number) => {
    onExamplesChange(examples.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-orange-600" />
        <h4 className="text-lg font-semibold text-foreground">My Superpowers: Skills I'm Bringing to My New Field</h4>
      </div>

      {/* Skill Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Which of these high-level skills are your strongest and most transferable?
          <span className="text-muted-foreground ml-1">(Select {MIN_TRANSFERABLE_SKILLS}-{MAX_TRANSFERABLE_SKILLS})</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {TRANSFERABLE_SKILLS_OPTIONS.map((skill) => {
            const isSelected = selectedSkills.includes(skill.key);
            const isDisabled = !isSelected && selectedSkills.length >= MAX_TRANSFERABLE_SKILLS;
            return (
              <Badge
                key={skill.key}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all px-3 py-1.5",
                  isSelected && "bg-orange-500 hover:bg-orange-600",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isDisabled && toggleSkill(skill.key)}
              >
                {skill.label}
              </Badge>
            );
          })}
        </div>
        {selectedSkills.length > 0 && selectedSkills.length < MIN_TRANSFERABLE_SKILLS && (
          <p className="text-xs text-amber-600">
            Please select at least {MIN_TRANSFERABLE_SKILLS} skills
          </p>
        )}
      </div>

      {/* Skill Examples */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Give {MIN_SKILL_EXAMPLES}-{MAX_SKILL_EXAMPLES} short examples of how you've used these skills in your previous roles
        </Label>
        <p className="text-xs text-muted-foreground">
          Make them relevant to your new direction. Example: "As a teacher, I managed complex classroom projects (Project Management) and adapted lessons for diverse learners (Adaptability)."
        </p>
        
        <div className="space-y-3">
          {examples.map((example, index) => (
            <div key={index} className="flex gap-2">
              <Textarea
                value={example}
                onChange={(e) => updateExample(index, e.target.value)}
                placeholder={`Example ${index + 1}: How you used these skills...`}
                className="flex-1 min-h-[80px] resize-none"
                maxLength={PIVOT_CHAR_LIMITS.transferable_skill_example}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeExample(index)}
                className="text-muted-foreground hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        {examples.length < MAX_SKILL_EXAMPLES && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addExample}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Example
          </Button>
        )}

        {examples.length > 0 && examples.length < MIN_SKILL_EXAMPLES && (
          <p className="text-xs text-amber-600">
            Please add at least {MIN_SKILL_EXAMPLES} examples
          </p>
        )}
      </div>
    </div>
  );
}

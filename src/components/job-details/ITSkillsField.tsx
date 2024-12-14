import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { itSkills } from "./constants";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface ITSkillsFieldProps {
  control: Control<any>;
}

const ITSkillsField = ({ control }: ITSkillsFieldProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillSelect = (skill: string) => {
    if (skill === "none") {
      setSelectedSkills([]);
      return;
    }

    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <FormField
      control={control}
      name="required_skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Required IT Skills (Max 5)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Select 
                onValueChange={(value) => {
                  handleSkillSelect(value);
                  field.onChange(selectedSkills);
                }} 
                value=""
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="None">None</SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  <SelectItem value="none">None</SelectItem>
                  {itSkills.map((skill) => (
                    <SelectItem 
                      key={skill} 
                      value={skill}
                      disabled={selectedSkills.length >= 5 && !selectedSkills.includes(skill)}
                    >
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge 
                    key={skill}
                    variant="secondary"
                    className="px-3 py-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        removeSkill(skill);
                        field.onChange(selectedSkills.filter(s => s !== skill));
                      }}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </FormControl>
          {selectedSkills.length >= 5 && (
            <p className="text-sm text-muted-foreground mt-1">
              Maximum of 5 skills reached
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ITSkillsField;
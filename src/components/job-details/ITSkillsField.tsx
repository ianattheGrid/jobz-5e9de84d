
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";
import { itSkills } from "@/components/job-details/constants";

interface ITSkillsFieldProps {
  control: Control<any>;
}

const ITSkillsField = ({ control }: ITSkillsFieldProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const handleSkillSelect = (value: string, onChange: (value: string[]) => void) => {
    if (!value || value === "none") return;

    if (!selectedSkills.includes(value) && selectedSkills.length < 10) {
      const updatedSkills = [...selectedSkills, value];
      setSelectedSkills(updatedSkills);
      onChange(updatedSkills);
    }
  };

  const removeSkill = (skillToRemove: string, onChange: (value: string[]) => void) => {
    const updatedSkills = selectedSkills.filter((skill) => skill !== skillToRemove);
    setSelectedSkills(updatedSkills);
    onChange(updatedSkills);
  };

  return (
    <FormField
      control={control}
      name="required_skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Required Skills (Select up to 10)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Select 
                onValueChange={(value) => {
                  handleSkillSelect(value, field.onChange);
                }}
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select required skills" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {itSkills.map((skill) => (
                    <SelectItem 
                      key={skill} 
                      value={skill}
                      disabled={selectedSkills.includes(skill) || selectedSkills.length >= 10}
                      className="cursor-pointer"
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
                      onClick={() => removeSkill(skill, field.onChange)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </FormControl>
          {selectedSkills.length >= 10 && (
            <p className="text-sm text-muted-foreground mt-1">
              Maximum of 10 skills reached
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ITSkillsField;

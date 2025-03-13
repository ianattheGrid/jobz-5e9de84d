
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

  const handleSkillSelect = (skill: string) => {
    if (!skill || skill === "none") return;

    if (!selectedSkills.includes(skill) && selectedSkills.length < 10) {
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      control._formValues.required_skills = updatedSkills;
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = selectedSkills.filter((skill) => skill !== skillToRemove);
    setSelectedSkills(updatedSkills);
    control._formValues.required_skills = updatedSkills;
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
                onValueChange={handleSkillSelect}
                value=""
              >
                <SelectTrigger className="w-full bg-white">
                  <SelectValue placeholder="Select required skills" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-[300px]">
                  {itSkills.map((skill) => (
                    <SelectItem 
                      key={skill} 
                      value={skill}
                      disabled={selectedSkills.length >= 10 && !selectedSkills.includes(skill)}
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
                      onClick={() => removeSkill(skill)}
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

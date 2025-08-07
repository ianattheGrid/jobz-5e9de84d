import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";
import { useSkills } from "@/hooks/useSkills";
import SkillSuggestionForm from "./SkillSuggestionForm";

interface DynamicSkillsSelectProps {
  control: Control<any>;
  fieldName: string;
  label: string;
  workArea: string;
  specialization?: string;
  maxSkills?: number;
  placeholder?: string;
}

const DynamicSkillsSelect = ({ 
  control, 
  fieldName, 
  label, 
  workArea, 
  specialization,
  maxSkills = 10,
  placeholder = "Select skills..." 
}: DynamicSkillsSelectProps) => {
  const { skills, loading, refetch } = useSkills(workArea, specialization);

  return (
    <FormField
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center justify-between">
            <FormLabel>{label} {maxSkills && `(Select up to ${maxSkills})`}</FormLabel>
            <SkillSuggestionForm 
              workArea={workArea}
              specialization={specialization}
              onSuggestionSubmitted={refetch}
            />
          </div>
          <FormControl>
            <MultiSelect
              options={skills.map(skill => ({ 
                label: skill.skill_name, 
                value: skill.skill_name 
              }))}
              selected={field.value || []}
              onChange={(values) => {
                if (!maxSkills || values.length <= maxSkills) {
                  field.onChange(values);
                }
              }}
              placeholder={loading ? "Loading skills..." : placeholder}
            />
          </FormControl>
          {maxSkills && field.value?.length >= maxSkills && (
            <p className="text-sm text-muted-foreground mt-1">
              Maximum of {maxSkills} skills reached
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DynamicSkillsSelect;
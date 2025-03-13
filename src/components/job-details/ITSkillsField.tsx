
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { itSkills } from "@/components/job-details/constants";
import { MultiSelect } from "@/components/ui/multi-select";

interface ITSkillsFieldProps {
  control: Control<any>;
}

const ITSkillsField = ({ control }: ITSkillsFieldProps) => {
  return (
    <FormField
      control={control}
      name="required_skills"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Required Skills (Select up to 10)</FormLabel>
          <FormControl>
            <MultiSelect
              options={itSkills.map(skill => ({ label: skill, value: skill }))}
              selected={field.value || []}
              onChange={(values) => {
                if (values.length <= 10) {
                  field.onChange(values);
                }
              }}
              placeholder="Select required skills..."
            />
          </FormControl>
          {field.value?.length >= 10 && (
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

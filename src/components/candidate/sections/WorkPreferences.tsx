import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { Checkbox } from "@/components/ui/checkbox";

interface WorkPreferencesProps {
  control: Control<CandidateFormValues>;
}

const workTypeOptions = [
  { id: "flexible", label: "Flexible" },
  { id: "office", label: "Office based" },
  { id: "hybrid", label: "Hybrid" },
  { id: "remote", label: "Working from home" }
];

const WorkPreferences = ({ control }: WorkPreferencesProps) => {
  return (
    <FormField
      control={control}
      name="preferred_work_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">Preferred Work Types</FormLabel>
          <div className="grid gap-4">
            {workTypeOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      if (checked) {
                        field.onChange([...currentValue, option.id]);
                      } else {
                        field.onChange(currentValue.filter((value) => value !== option.id));
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">{option.label}</FormLabel>
              </div>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Select all work arrangements that you would consider
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WorkPreferences;
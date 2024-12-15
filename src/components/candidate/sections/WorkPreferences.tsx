import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { MultiSelect } from "@/components/ui/multi-select";

interface WorkPreferencesProps {
  control: Control<CandidateFormValues>;
}

const workTypeOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "office", label: "Office-based" }
];

const WorkPreferences = ({ control }: WorkPreferencesProps) => {
  return (
    <FormField
      control={control}
      name="preferred_work_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">Preferred Work Types</FormLabel>
          <FormControl>
            <MultiSelect
              options={workTypeOptions}
              selected={Array.isArray(field.value) ? field.value : []}
              onChange={(values) => field.onChange(values)}
              placeholder="Select work types"
              className="w-full bg-white border border-gray-300"
            />
          </FormControl>
          <div className="text-sm text-gray-600 mt-1">
            Select your preferred work arrangements
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WorkPreferences;
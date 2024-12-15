import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues, WorkType } from "../candidateFormSchema";

interface WorkPreferencesProps {
  control: Control<CandidateFormValues>;
}

const WorkPreferences = ({ control }: WorkPreferencesProps) => {
  return (
    <FormField
      control={control}
      name="preferred_work_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">Preferred Work Type</FormLabel>
          <FormControl>
            <select
              className="w-full p-2 border rounded text-sm"
              {...field}
            >
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="office">Office-based</option>
            </select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WorkPreferences;
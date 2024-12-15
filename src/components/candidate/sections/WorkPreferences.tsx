import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CandidateFormValues, WorkType } from "../candidateFormSchema";

interface WorkPreferencesProps {
  control: Control<CandidateFormValues>;
}

const WorkPreferences = ({ control }: WorkPreferencesProps) => {
  return (
    <>
      <FormField
        control={control}
        name="years_experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Years of Experience</FormLabel>
            <FormControl>
              <Input type="number" min="0" max="50" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="preferred_work_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Work Type</FormLabel>
            <FormControl>
              <select
                className="w-full p-2 border rounded"
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
    </>
  );
};

export default WorkPreferences;
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { JobSearchSchema } from "./JobSearchSchema";
import { PRIMARY_COLOR_PATTERN } from "@/styles/colorPatterns";

interface CommissionFilterFieldProps {
  control: Control<JobSearchSchema>;
}

const CommissionFilterField = ({ control }: CommissionFilterFieldProps) => {
  return (
    <FormField
      control={control}
      name="hasCommission"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <label className="text-pink-400 hover:text-pink-300 text-sm font-medium leading-none cursor-pointer">
            Show jobs with "You're Hired" bonus
          </label>
        </FormItem>
      )}
    />
  );
};

export default CommissionFilterField;

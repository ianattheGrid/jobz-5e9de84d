
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { JobSearchSchema } from "./JobSearchSchema";

interface CommissionFilterFieldProps {
  control: Control<JobSearchSchema>;
}

const CommissionFilterField = ({ control }: CommissionFilterFieldProps) => {
  return (
    <FormField
      control={control}
      name="hasCommission"
      render={({ field }) => (
        <FormItem className="flex items-center space-x-3">
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <span className="text-white font-medium leading-none cursor-pointer select-none">
            Show jobs with "You're Hired" bonus
          </span>
        </FormItem>
      )}
    />
  );
};

export default CommissionFilterField;

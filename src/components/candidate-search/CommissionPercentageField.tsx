import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";

interface CommissionPercentageFieldProps {
  control: Control<any>;
}

const CommissionPercentageField = ({ control }: CommissionPercentageFieldProps) => {
  return (
    <FormField
      control={control}
      name="includeCommissionCandidates"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Include "You're Hired" Bonus Candidates</FormLabel>
            <FormMessage />
          </div>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CommissionPercentageField;
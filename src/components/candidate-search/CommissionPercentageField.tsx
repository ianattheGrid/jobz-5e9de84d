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
        <FormItem>
          <FormLabel>Do you want to include candidates who have asked for a "You're Hired" bonus?</FormLabel>
          <FormControl>
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommissionPercentageField;
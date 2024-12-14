import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Control } from "react-hook-form";

interface CommissionPercentageFieldProps {
  control: Control<any>;
}

const CommissionPercentageField = ({ control }: CommissionPercentageFieldProps) => {
  return (
    <FormField
      control={control}
      name="minCommissionPercentage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Minimum "You're Hired" Bonus Percentage</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Slider
                value={[field.value || 0]}
                onValueChange={(value) => field.onChange(value[0])}
                min={0}
                max={14}
                step={0.5}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">
                {field.value ? `${field.value}% of salary` : 'No minimum percentage'}
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommissionPercentageField;
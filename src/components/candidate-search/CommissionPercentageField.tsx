import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
            <RadioGroup
              onValueChange={(value) => field.onChange(value === 'yes')}
              defaultValue={field.value ? 'yes' : 'no'}
              className="flex flex-row space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="yes" id="yes" className="h-3 w-3" />
                <label htmlFor="yes" className="text-xs">Yes</label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="no" id="no" className="h-3 w-3" />
                <label htmlFor="no" className="text-xs">No</label>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CommissionPercentageField;
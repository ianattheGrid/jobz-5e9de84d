import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";

interface CommissionFilterFieldProps {
  control: Control<any>;
}

const CommissionFilterField = ({ control }: CommissionFilterFieldProps) => {
  return (
    <FormField
      control={control}
      name="includeCommission"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Show jobs with "You're Hired" bonus?</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={(value) => field.onChange(value === 'yes')}
              defaultValue={field.value ? 'yes' : 'no'}
              className="flex flex-row space-x-2"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="yes" id="commission-yes" className="h-3 w-3" />
                <label htmlFor="commission-yes" className="text-xs">Yes</label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="no" id="commission-no" className="h-3 w-3" />
                <label htmlFor="commission-no" className="text-xs">No</label>
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CommissionFilterField;
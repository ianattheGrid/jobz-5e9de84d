
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
        <div className="space-y-3">
          <div className="text-white font-medium text-base">
            Show jobs with "You're Hired" bonus
          </div>
          <FormItem className="space-y-2">
            <FormControl>
              <RadioGroup
                onValueChange={(value) => field.onChange(value === 'true')}
                defaultValue={field.value ? 'true' : 'false'}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="show-bonus" />
                  <label 
                    htmlFor="show-bonus" 
                    className="text-[#FFFFFF] cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Only show jobs with bonus
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="hide-bonus" />
                  <label 
                    htmlFor="hide-bonus" 
                    className="text-[#FFFFFF] cursor-pointer text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show all jobs
                  </label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        </div>
      )}
    />
  );
};

export default CommissionFilterField;

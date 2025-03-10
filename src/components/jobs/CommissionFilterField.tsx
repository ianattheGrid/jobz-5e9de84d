
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
              <div className="bg-background rounded-md p-4">
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === 'true')}
                  defaultValue={field.value ? 'true' : 'false'}
                  className="flex flex-col space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="true" id="show-bonus" className="border-white" />
                    <label 
                      htmlFor="show-bonus" 
                      className="text-white text-sm leading-none"
                    >
                      Only show jobs with bonus
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="false" id="hide-bonus" className="border-white" />
                    <label 
                      htmlFor="hide-bonus" 
                      className="text-white text-sm leading-none"
                    >
                      Show all jobs
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </FormControl>
          </FormItem>
        </div>
      )}
    />
  );
};

export default CommissionFilterField;

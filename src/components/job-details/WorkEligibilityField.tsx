import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface WorkEligibilityFieldProps {
  control: Control<any>;
}

const WORK_ELIGIBILITY_OPTIONS = [
  "I am a UK citizen",
  "I have settled or pre-settled status under the EU Settlement Scheme",
  "I have an existing valid work visa",
  "I require visa sponsorship to work in the UK",
  "I am not currently eligible to work in the UK"
];

const WorkEligibilityField = ({ control }: WorkEligibilityFieldProps) => {
  return (
    <FormField
      control={control}
      name="workEligibility"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What is your UK work status?</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your work status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {WORK_ELIGIBILITY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WorkEligibilityField;
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface WorkEligibilityFieldProps {
  control: Control<any>;
}

const WORK_ELIGIBILITY_OPTIONS = [
  "UK citizens only",
  "UK citizens and individuals with settled or pre-settled status under the EU Settlement Scheme",
  "Individuals who already have the legal right to work in the UK (e.g., UK citizens, settled/pre-settled status, or valid work visas)",
  "Individuals who require visa sponsorship to work in the UK",
  "Open to all candidates, regardless of current right to work, as long as they meet the role's requirements"
];

const WorkEligibilityField = ({ control }: WorkEligibilityFieldProps) => {
  return (
    <FormField
      control={control}
      name="workEligibility"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What type of candidates are you willing to consider for this role based on their right to work in the UK?</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select work eligibility requirements" />
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
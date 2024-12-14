import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

const SECURITY_CLEARANCE_LEVELS = [
  "BPSS",
  "SC",
  "CTC", 
  "DV",
  "eDV"
];

interface SecurityClearanceFieldsProps {
  control: Control<any>;
}

const SecurityClearanceFields = ({ control }: SecurityClearanceFieldsProps) => {
  return (
    <FormField
      control={control}
      name="securityClearanceLevel"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What level of security clearance is required?</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger className="w-full bg-white border border-gray-300">
              <SelectValue placeholder="Select clearance level" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              {SECURITY_CLEARANCE_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SecurityClearanceFields;
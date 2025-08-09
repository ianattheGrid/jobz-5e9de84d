
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Control } from "react-hook-form";
import { useState } from "react";

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
  const [requiresClearance, setRequiresClearance] = useState(false);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="requiresSecurityClearance"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Does this role require security clearance?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(value) => {
                  field.onChange(value === "yes");
                  setRequiresClearance(value === "yes");
                }}
                defaultValue={field.value ? "yes" : "no"}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {requiresClearance && (
        <FormField
          control={control}
          name="securityClearanceLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What level of security clearance?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full bg-white text-gray-900 border border-gray-300">
                  <SelectValue placeholder="Select clearance level" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 z-50">
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
      )}
    </div>
  );
};

export default SecurityClearanceFields;

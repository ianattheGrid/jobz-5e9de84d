import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setRequiresClearance(checked as boolean);
                }}
              />
            </FormControl>
            <FormLabel className="font-normal">
              Does this role require security clearance?
            </FormLabel>
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
      )}
    </div>
  );
};

export default SecurityClearanceFields;
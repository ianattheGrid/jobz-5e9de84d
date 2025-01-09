import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

const financeSpecializations = [
  "Accounting Roles",
  "Financial Analysis and Planning Roles",
  "Auditing and Compliance Roles",
  "Banking and Investment Roles",
  "Tax and Treasury Roles",
  "Finance Operations Roles",
  "Specialized Accounting and Finance Roles"
];

interface FinanceSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const FinanceSpecializationSelect = ({ control, onSpecializationChange }: FinanceSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="financeSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Finance Specialization</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your finance specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {financeSpecializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
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

export default FinanceSpecializationSelect;
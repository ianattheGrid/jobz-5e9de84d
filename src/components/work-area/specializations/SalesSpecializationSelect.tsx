
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { salesSpecializations } from "../constants/sales-roles";

interface SalesSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const SalesSpecializationSelect = ({ control, onSpecializationChange }: SalesSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="specialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Sales Specialization</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your sales specialization" />
              </SelectTrigger>
              <SelectContent>
                {salesSpecializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default SalesSpecializationSelect;

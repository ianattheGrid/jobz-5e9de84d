import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { customerServiceSpecializations } from "../constants/customer-service-roles";

interface CustomerServiceSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const CustomerServiceSpecializationSelect = ({ control, onSpecializationChange }: CustomerServiceSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="customerServiceSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Customer Service Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your customer service specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {customerServiceSpecializations.map((specialization) => (
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

export default CustomerServiceSpecializationSelect;
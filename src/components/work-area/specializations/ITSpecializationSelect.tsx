
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { itSpecializations } from "../constants/it-roles";

interface ITSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const ITSpecializationSelect = ({ control, onSpecializationChange }: ITSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="itSpecialization"
      render={({ field }) => {
        // Ensure we always have a valid value
        const currentValue = field.value || "";
        
        return (
          <FormItem>
            <FormLabel>IT Specialization</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  onSpecializationChange(value);
                }}
                value={currentValue}
                defaultValue={currentValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your IT specialization" />
                </SelectTrigger>
                <SelectContent>
                  {itSpecializations.map((specialization) => (
                    <SelectItem key={specialization} value={specialization}>
                      {specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default ITSpecializationSelect;

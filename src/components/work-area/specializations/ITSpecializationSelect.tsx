
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
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">IT Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="select-trigger">
                <SelectValue placeholder="Select your IT specialization" className="text-gray-900" />
              </SelectTrigger>
              <SelectContent className="select-content">
                {itSpecializations.map((specialization) => (
                  <SelectItem 
                    key={specialization} 
                    value={specialization}
                    className="text-gray-900"
                  >
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

export default ITSpecializationSelect;

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { itSpecializations } from "./constants";

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
          <FormLabel>IT Specialisation</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your IT specialisation" />
              </SelectTrigger>
              <SelectContent className="bg-white">
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
      )}
    />
  );
};

export default ITSpecializationSelect;
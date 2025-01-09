import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { hrSpecializations } from "./constants/hr-roles";

interface HRSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const HRSpecializationSelect = ({ control, onSpecializationChange }: HRSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="hrSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>HR Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your HR specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {hrSpecializations.map((specialization) => (
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

export default HRSpecializationSelect;
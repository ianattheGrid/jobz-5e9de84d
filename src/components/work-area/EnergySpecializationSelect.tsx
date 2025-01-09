import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { energySpecializations } from "./constants/energy-roles";

interface EnergySpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const EnergySpecializationSelect = ({ control, onSpecializationChange }: EnergySpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="energySpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Energy & Utilities Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {energySpecializations.map((specialization) => (
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

export default EnergySpecializationSelect;
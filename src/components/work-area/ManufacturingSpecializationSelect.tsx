import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { manufacturingSpecializations } from "./constants/manufacturing-roles";

interface ManufacturingSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const ManufacturingSpecializationSelect = ({ 
  control,
  onSpecializationChange
}: ManufacturingSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="manufacturingSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Manufacturing Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your manufacturing specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {manufacturingSpecializations.map((specialization) => (
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

export default ManufacturingSpecializationSelect;
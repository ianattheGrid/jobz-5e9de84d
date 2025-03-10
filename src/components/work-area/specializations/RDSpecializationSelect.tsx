
import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { rdSpecializations } from "../constants/rd-roles";

interface RDSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const RDSpecializationSelect = ({ control, onSpecializationChange }: RDSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="specialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">R&D Specialization</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your R&D specialization" />
              </SelectTrigger>
              <SelectContent>
                {rdSpecializations.map((specialization) => (
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

export default RDSpecializationSelect;

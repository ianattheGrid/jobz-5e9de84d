
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
      name="specialisation"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">R&D Specialisation</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your R&D specialisation" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {rdSpecializations.map((specialisation) => (
                  <SelectItem key={specialisation} value={specialisation}>
                    {specialisation}
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

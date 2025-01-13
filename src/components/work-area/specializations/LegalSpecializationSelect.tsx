import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { legalSpecializations } from "../constants/legal-roles";

interface LegalSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const LegalSpecializationSelect = ({ control, onSpecializationChange }: LegalSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="legalSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Legal Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your legal specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {legalSpecializations.map((specialization) => (
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

export default LegalSpecializationSelect;
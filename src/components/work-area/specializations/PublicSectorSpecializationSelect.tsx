
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { publicSectorSpecializations } from "../constants/public-sector";

interface PublicSectorSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const PublicSectorSpecializationSelect = ({ control, onSpecializationChange }: PublicSectorSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="publicSectorSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Public Sector Specialization</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }} 
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your public sector specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {publicSectorSpecializations.map((specialization) => (
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

export default PublicSectorSpecializationSelect;

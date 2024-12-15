import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface LocationInputProps {
  control: Control<any>;
}

const LocationInput = ({ control }: LocationInputProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter location (e.g., London, Manchester)" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationInput;
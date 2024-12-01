import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Control } from "react-hook-form";

interface LocationFieldProps {
  control: Control<any>;
}

const LocationField = ({ control }: LocationFieldProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location (Bristol Area)</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a postcode area" />
              </SelectTrigger>
              <SelectContent>
                {bristolPostcodes.map((postcode) => (
                  <SelectItem key={postcode} value={postcode}>
                    {postcode}
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

export default LocationField;
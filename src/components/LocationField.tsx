import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Control } from "react-hook-form";

interface LocationFieldProps {
  control: Control<any>;
}

const LocationField = ({ control }: LocationFieldProps) => {
  const locationOptions = ["All", ...bristolPostcodes];

  return (
    <FormField
      control={control}
      name="location"
      defaultValue="All"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What location are you looking to work in (Bristol postcodes only)</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select a postcode area" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {locationOptions.map((postcode) => (
                <SelectItem key={postcode} value={postcode}>
                  {postcode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
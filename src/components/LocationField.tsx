import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Control } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";

interface LocationFieldProps {
  control: Control<any>;
}

const LocationField = ({ control }: LocationFieldProps) => {
  const locationOptions = [
    { value: "All", label: "All Areas" },
    ...bristolPostcodes.map(postcode => ({ value: postcode, label: postcode }))
  ];

  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Location (Bristol Area)</FormLabel>
          <FormControl>
            <MultiSelect
              options={locationOptions}
              selected={field.value || []}
              onChange={field.onChange}
              placeholder="Select postcode areas"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
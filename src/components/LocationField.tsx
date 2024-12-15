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
          <FormLabel>What locations are you looking to work in (Bristol postcodes only)</FormLabel>
          <FormControl>
            <MultiSelect
              options={locationOptions}
              selected={field.value || []}
              onChange={(value) => field.onChange(value)}
              placeholder="Select postcode areas"
            />
          </FormControl>
          <p className="text-sm text-muted-foreground mt-2">
            You can select multiple postcodes to increase your job match opportunities
          </p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationField;
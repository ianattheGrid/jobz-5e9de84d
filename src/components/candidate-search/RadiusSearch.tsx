import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import AddressFinder from "@/components/AddressFinder";

interface RadiusSearchProps {
  control: Control<any>;
}

const RADIUS_OPTIONS = [
  { value: 1, label: "1 mile" },
  { value: 5, label: "5 miles" },
  { value: 10, label: "10 miles" },
  { value: 15, label: "15 miles" },
  { value: 20, label: "20 miles" },
  { value: 25, label: "25 miles" },
  { value: 30, label: "30 miles" },
  { value: 50, label: "50 miles" },
  { value: 75, label: "75 miles" },
  { value: 100, label: "100 miles" },
];

const RadiusSearch = ({ control }: RadiusSearchProps) => {
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Office postcode</FormLabel>
        <AddressFinder control={control} />
      </FormItem>

      <FormField
        control={control}
        name="searchRadius"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Search radius</FormLabel>
            <FormControl>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select search radius" />
                </SelectTrigger>
                <SelectContent>
                  {RADIUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default RadiusSearch;
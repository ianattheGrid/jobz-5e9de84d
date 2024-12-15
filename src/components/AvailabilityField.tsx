import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface AvailabilityFieldProps {
  control: Control<any>;
}

const availabilityOptions = [
  "Immediate",
  "1 weeks notice",
  "2 weeks notice",
  "3 weeks notice",
  "1 months notice",
  "6 weeks notice",
  "2 months notice",
  "3 months notice",
  "6 months notice"
];

const AvailabilityField = ({ control }: AvailabilityFieldProps) => {
  return (
    <FormField
      control={control}
      name="availability"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Availability</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your availability" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {availabilityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
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

export default AvailabilityField;
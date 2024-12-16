import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";

interface TravelRadiusSelectProps {
  control: Control<CandidateFormValues>;
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

const TravelRadiusSelect = ({ control }: TravelRadiusSelectProps) => {
  return (
    <FormField
      control={control}
      name="travel_radius"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Maximum travel distance from home</FormLabel>
          <FormControl>
            <Select
              value={field.value?.toString()}
              onValueChange={(value) => field.onChange(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select travel radius" />
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
  );
};

export default TravelRadiusSelect;
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Control, useWatch } from "react-hook-form";
import { VacancyFormValues } from "../vacancy/VacancyFormSchema";

interface LocationRadiusFieldsProps {
  control: Control<VacancyFormValues>;
}

const RADIUS_OPTIONS = [
  { value: 3, label: "3 miles" },
  { value: 5, label: "5 miles" },
  { value: 10, label: "10 miles" },
  { value: 20, label: "20 miles" },
  { value: 30, label: "30 miles" },
  { value: 50, label: "50 miles" },
];

const LocationRadiusFields = ({ control }: LocationRadiusFieldsProps) => {
  const workLocation = useWatch({
    control,
    name: "workLocation",
  });

  const requireLocationRadius = useWatch({
    control,
    name: "requireLocationRadius",
  });

  // Only show if work location is office, hybrid, or all
  const shouldShow = workLocation === "office" || workLocation === "hybrid" || (!workLocation) || (workLocation !== "remote");

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="requireLocationRadius"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Do you require candidates to live within a certain radius of your office?</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value ? "yes" : "no"}
                onValueChange={(value) => field.onChange(value === "yes")}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {requireLocationRadius && (
        <>
          <FormField
            control={control}
            name="officePostcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office postcode</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your office postcode"
                    {...field}
                    className="max-w-[200px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="locationRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Please select a radius</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value))}
                >
                  <FormControl>
                    <SelectTrigger className="max-w-[200px]">
                      <SelectValue placeholder="Select radius" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RADIUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default LocationRadiusFields;
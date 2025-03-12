
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

const YEARS_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20];

interface TitleExperienceSelectProps {
  control: Control<any>;
  name: string;
  label: string;
}

const TitleExperienceSelect = ({ control, name, label }: TitleExperienceSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value?.toString()}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select years of experience" />
              </SelectTrigger>
              <SelectContent>
                {YEARS_OPTIONS.map((years) => (
                  <SelectItem key={years} value={years.toString()}>
                    {years === 20 ? "20+ years" : `${years} ${years === 1 ? "year" : "years"}`}
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

export default TitleExperienceSelect;

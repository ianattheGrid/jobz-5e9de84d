import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface SalaryRangeFieldProps {
  control: Control<any>;
}

const salaryRanges = [
  "£20,000 - £30,000",
  "£30,000 - £40,000",
  "£40,000 - £50,000",
  "£50,000 - £60,000",
  "£60,000 - £70,000",
  "£70,000 - £80,000",
  "£80,000 - £90,000",
  "£90,000 - £100,000",
  "£100,000+"
];

const SalaryRangeField = ({ control }: SalaryRangeFieldProps) => {
  return (
    <FormField
      control={control}
      name="salary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Salary Range (for search)</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {salaryRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
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

export default SalaryRangeField;
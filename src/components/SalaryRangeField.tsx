import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { InfoIcon } from "lucide-react";

interface SalaryRangeFieldProps {
  control: Control<any>;
}

const salaryRanges = [
  "£20,000 - £25,000",
  "£25,000 - £30,000",
  "£30,000 - £35,000",
  "£35,000 - £40,000",
  "£40,000 - £45,000",
  "£45,000 - £50,000",
  "£50,000 - £55,000",
  "£55,000 - £60,000",
  "£60,000 - £65,000",
  "£65,000 - £70,000",
  "£70,000 - £75,000",
  "£75,000 - £80,000",
  "£80,000 - £85,000",
  "£85,000 - £90,000",
  "£90,000 - £95,000",
  "£95,000 - £100,000",
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
          <div className="flex items-center gap-2 mt-1 text-sm text-blue-600">
            <InfoIcon className="h-3 w-3" />
            <span>Results include candidates within £5,000 of selected range</span>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SalaryRangeField;
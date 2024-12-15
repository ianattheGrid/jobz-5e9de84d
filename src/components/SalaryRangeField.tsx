import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";

interface SalaryRangeFieldProps {
  control: Control<any>;
}

const salaryRanges = [
  { value: "£20,000 - £25,000", label: "£20,000 - £25,000" },
  { value: "£25,000 - £30,000", label: "£25,000 - £30,000" },
  { value: "£30,000 - £35,000", label: "£30,000 - £35,000" },
  { value: "£35,000 - £40,000", label: "£35,000 - £40,000" },
  { value: "£40,000 - £45,000", label: "£40,000 - £45,000" },
  { value: "£45,000 - £50,000", label: "£45,000 - £50,000" },
  { value: "£50,000 - £55,000", label: "£50,000 - £55,000" },
  { value: "£55,000 - £60,000", label: "£55,000 - £60,000" },
  { value: "£60,000 - £65,000", label: "£60,000 - £65,000" },
  { value: "£65,000 - £70,000", label: "£65,000 - £70,000" },
  { value: "£70,000 - £75,000", label: "£75,000 - £75,000" },
  { value: "£75,000 - £80,000", label: "£75,000 - £80,000" },
  { value: "£80,000 - £85,000", label: "£80,000 - £85,000" },
  { value: "£85,000 - £90,000", label: "£85,000 - £90,000" },
  { value: "£90,000 - £95,000", label: "£90,000 - £95,000" },
  { value: "£95,000 - £100,000", label: "£95,000 - £100,000" },
  { value: "£100,000+", label: "£100,000+" }
];

const SalaryRangeField = ({ control }: SalaryRangeFieldProps) => {
  return (
    <FormField
      control={control}
      name="salary"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Salary Range</FormLabel>
          <FormControl>
            <MultiSelect
              options={salaryRanges}
              selected={field.value ? field.value.split(',').filter(Boolean) : []}
              onChange={(values) => field.onChange(values.join(','))}
              placeholder="Select salary range"
              className="w-full bg-white border border-gray-300"
            />
          </FormControl>
          <div className="flex items-center gap-2 mt-1 text-sm text-blue-600">
            You can select multiple salary ranges
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default SalaryRangeField;
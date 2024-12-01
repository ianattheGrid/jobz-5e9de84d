import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control } from "react-hook-form";

interface SalaryRangeFieldProps {
  control: Control<any>;
}

const salaryRanges = [
  "£10,000 - £15,000",
  "£15,000 - £20,000",
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
  "£100,000 - £110,000",
  "£110,000 - £120,000",
  "£120,000 - £130,000",
  "£130,000 - £140,000",
  "£140,000 - £150,000",
  "£150,000 - £160,000",
  "£160,000 - £170,000",
  "£170,000 - £180,000",
  "£180,000 - £190,000",
  "£190,000 - £200,000",
  "£200,000+"
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select salary range" />
              </SelectTrigger>
              <SelectContent>
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
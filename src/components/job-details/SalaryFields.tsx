import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import SalaryRangeField from "../SalaryRangeField";

interface SalaryFieldsProps {
  control: Control<any>;
}

const SalaryFields = ({ control }: SalaryFieldsProps) => {
  return (
    <>
      <SalaryRangeField control={control} />
      <FormField
        control={control}
        name="actualSalary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Actual salary</FormLabel>
            <FormControl>
              <Input placeholder="Enter the actual salary..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SalaryFields;
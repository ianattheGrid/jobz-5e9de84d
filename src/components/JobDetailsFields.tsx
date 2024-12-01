import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import SalaryRangeField from "./SalaryRangeField";

interface JobDetailsFieldsProps {
  control: Control<any>;
}

const JobDetailsFields = ({ control }: JobDetailsFieldsProps) => {
  return (
    <>
      <div className="space-y-4">
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

        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Input placeholder="Describe the role, requirements, and benefits..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default JobDetailsFields;
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface JobDetailsFieldsProps {
  control: Control<any>;
}

const JobDetailsFields = ({ control }: JobDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <FormControl>
              <Input placeholder="e.g. Full-time, Contract, Part-time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="salary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Range</FormLabel>
            <FormControl>
              <Input placeholder="e.g. £40,000" {...field} />
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
    </>
  );
};

export default JobDetailsFields;
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface JobTitleSelectProps {
  control: Control<any>;
  titles: string[];
  name?: string;
}

const JobTitleSelect = ({ control, titles, name = "title" }: JobTitleSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Job Title</FormLabel>
          <FormControl>
            <Select 
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select the job title" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
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

export default JobTitleSelect;
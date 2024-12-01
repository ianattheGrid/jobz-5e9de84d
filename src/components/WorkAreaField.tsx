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

interface WorkAreaFieldProps {
  control: Control<any>;
}

const workAreas = [
  "R&D",
  "Quality Assurance",
  "Sales",
  "Marketing",
  "Customer Service",
  "IT",
  "Accounting & Finance",
  "Human Resources",
  "Legal",
  "Manufacturing",
  "Energy & Utilities",
  "Pharma",
  "Public Sector",
  "Engineering",
  "Hospitality & Tourism",
  "Other"
];

const WorkAreaField = ({ control }: WorkAreaFieldProps) => {
  return (
    <FormField
      control={control}
      name="workArea"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Area of Work</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select the area of work" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {workAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
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

export default WorkAreaField;
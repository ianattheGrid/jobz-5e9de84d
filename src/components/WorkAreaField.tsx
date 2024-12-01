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
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { useState } from "react";

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
  const [showOtherInput, setShowOtherInput] = useState(false);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="workArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Area of Work</FormLabel>
            <FormControl>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setShowOtherInput(value === "Other");
                }} 
                defaultValue={field.value}
              >
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

      {showOtherInput && (
        <FormField
          control={control}
          name="otherWorkArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Please specify the area of work</FormLabel>
              <FormControl>
                <Input placeholder="Enter the area of work..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default WorkAreaField;
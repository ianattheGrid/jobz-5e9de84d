import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "../constants";

interface WorkAreaSelectProps {
  control: Control<any>;
  onWorkAreaChange: (value: string) => void;
  defaultValue?: string;
}

const WorkAreaSelect = ({ control, onWorkAreaChange, defaultValue }: WorkAreaSelectProps) => {
  return (
    <FormField
      control={control}
      name="workArea"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Current Area of Work</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onWorkAreaChange(value);
              }}
              defaultValue={defaultValue || field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your current area of work" />
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

export default WorkAreaSelect;
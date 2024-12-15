import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { workAreas } from "../constants";

interface DesiredWorkAreaProps {
  control: Control<any>;
  onWorkAreaChange: (value: string) => void;
}

const DesiredWorkArea = ({ control, onWorkAreaChange }: DesiredWorkAreaProps) => {
  return (
    <FormField
      control={control}
      name="desired_work_area"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Desired Area of Work</FormLabel>
          <FormControl>
            <Select 
              onValueChange={(value) => {
                field.onChange(value);
                onWorkAreaChange(value);
              }} 
              defaultValue={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your desired area of work" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
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

export default DesiredWorkArea;
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface DesiredOtherWorkAreaProps {
  control: Control<any>;
}

const DesiredOtherWorkArea = ({ control }: DesiredOtherWorkAreaProps) => {
  return (
    <FormField
      control={control}
      name="desired_other_work_area"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Please specify the desired area of work</FormLabel>
          <FormControl>
            <Input placeholder="Enter the area of work..." {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DesiredOtherWorkArea;
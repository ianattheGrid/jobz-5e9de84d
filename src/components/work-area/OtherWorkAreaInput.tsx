import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface OtherWorkAreaInputProps {
  control: Control<any>;
}

const OtherWorkAreaInput = ({ control }: OtherWorkAreaInputProps) => {
  return (
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
  );
};

export default OtherWorkAreaInput;

import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { JobSearchSchema } from "./JobSearchSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BristolPostcodeSelectProps {
  control: Control<JobSearchSchema>;
}

const BristolPostcodeSelect = ({ control }: BristolPostcodeSelectProps) => {
  return (
    <FormField
      control={control}
      name="location"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-white text-gray-900">
                <SelectValue placeholder="Select Bristol postcode area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bristol Areas</SelectItem>
                {bristolPostcodes.map((postcode) => (
                  <SelectItem key={postcode} value={postcode}>
                    BS {postcode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default BristolPostcodeSelect;

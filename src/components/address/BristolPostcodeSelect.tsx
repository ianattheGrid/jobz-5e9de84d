
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidate/candidateFormSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";

interface BristolPostcodeSelectProps {
  control: Control<CandidateFormValues>;
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
              <SelectTrigger className="bg-zinc-900 text-white border-zinc-700">
                <SelectValue placeholder="Select your postcode area" />
              </SelectTrigger>
              <SelectContent>
                {bristolPostcodes.map((postcode) => (
                  <SelectItem key={postcode} value={postcode}>
                    {postcode}
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

export default BristolPostcodeSelect;

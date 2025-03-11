
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidate/candidateFormSchema";
import { bristolPostcodes } from "@/data/bristolPostcodes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HomePostcodeSelectProps {
  control: Control<CandidateFormValues>;
}

const HomePostcodeSelect = ({ control }: HomePostcodeSelectProps) => {
  return (
    <FormField
      control={control}
      name="home_postcode"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900">Your home postcode location</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select your home postcode" />
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

export default HomePostcodeSelect;

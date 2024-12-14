import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface ExperienceSelectProps {
  control: Control<any>;
  jobTitle: string;
}

const ExperienceSelect = ({ control, jobTitle }: ExperienceSelectProps) => {
  return (
    <FormField
      control={control}
      name="yearsExperience"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Required years of experience in {jobTitle}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select required experience" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="0">No experience required</SelectItem>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="3-4">3-4 years</SelectItem>
              <SelectItem value="5-6">5-6 years</SelectItem>
              <SelectItem value="7-8">7-8 years</SelectItem>
              <SelectItem value="9-10">9-10 years</SelectItem>
              <SelectItem value="11-12">11-12 years</SelectItem>
              <SelectItem value="13-14">13-14 years</SelectItem>
              <SelectItem value="15-16">15-16 years</SelectItem>
              <SelectItem value="17-18">17-18 years</SelectItem>
              <SelectItem value="19-20">19-20 years</SelectItem>
              <SelectItem value="20+">20+ years</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ExperienceSelect;
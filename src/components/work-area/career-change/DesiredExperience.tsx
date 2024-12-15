import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";

interface DesiredExperienceProps {
  control: Control<any>;
  jobTitle: string;
}

const DesiredExperience = ({ control, jobTitle }: DesiredExperienceProps) => {
  return (
    <FormField
      control={control}
      name="desired_years_experience"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Years experience in {jobTitle}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select years of experience" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="0">No experience</SelectItem>
                <SelectItem value="1-2">1-2 years</SelectItem>
                <SelectItem value="3-4">3-4 years</SelectItem>
                <SelectItem value="5-6">5-6 years</SelectItem>
                <SelectItem value="7-8">7-8 years</SelectItem>
                <SelectItem value="9-10">9-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DesiredExperience;
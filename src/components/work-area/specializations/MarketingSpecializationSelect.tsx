
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { marketingSpecializations } from "../constants/marketing-roles";

interface MarketingSpecializationSelectProps {
  control: Control<any>;
  onSpecializationChange: (value: string) => void;
}

const MarketingSpecializationSelect = ({ control, onSpecializationChange }: MarketingSpecializationSelectProps) => {
  return (
    <FormField
      control={control}
      name="marketingSpecialization"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-900 font-medium">Marketing Specialization</FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onSpecializationChange(value);
              }}
              value={field.value}
            >
              <SelectTrigger className="w-full bg-white border border-gray-300">
                <SelectValue placeholder="Select your marketing specialization" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {marketingSpecializations.map((specialization) => (
                  <SelectItem key={specialization} value={specialization}>
                    {specialization}
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

export default MarketingSpecializationSelect;

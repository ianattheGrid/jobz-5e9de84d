import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface CompanyInfoFieldsProps {
  control: Control<any>;
}

const CompanyInfoFields = ({ control }: CompanyInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="showCompanyName"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Do you want your company name on the Job Vacancy?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {field.value === "yes" && (
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default CompanyInfoFields;
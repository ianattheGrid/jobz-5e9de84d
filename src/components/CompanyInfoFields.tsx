import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface CompanyInfoFieldsProps {
  control: Control<any>;
}

const CompanyInfoFields = ({ control }: CompanyInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input {...field} placeholder="Enter company name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyInfoFields;
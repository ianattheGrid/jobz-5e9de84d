import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface CompanyInfoFieldsProps {
  control: Control<any>;
}

const CompanyInfoFields = ({ control }: CompanyInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Company Information</h3>

      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyInfoFields;
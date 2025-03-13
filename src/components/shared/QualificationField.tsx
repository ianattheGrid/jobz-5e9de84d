
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface QualificationFieldProps {
  control: Control<any>;
}

const QualificationField = ({ control }: QualificationFieldProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="requiresQualification"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Do you require the candidate to have an industry qualification for this role?
              </FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {control._formValues.requiresQualification && (
        <FormField
          control={control}
          name="qualificationRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What qualification do you require?</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter required qualification..." 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default QualificationField;

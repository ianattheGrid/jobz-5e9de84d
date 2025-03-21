
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
          <div>
            <FormLabel className="text-sm font-medium text-gray-900 mb-2 block">
              Do you require the candidate to have an industry qualification for this role?
            </FormLabel>
            <FormItem className="bg-white rounded-lg border border-gray-200 p-1.5">
              <FormControl>
                <div className="flex items-center gap-3 justify-end">
                  <span className={`text-xs ${!field.value ? 'text-[#FF69B4] font-medium' : 'text-gray-600'}`}>No</span>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="data-[state=checked]:bg-[#FF69B4]"
                  />
                  <span className={`text-xs ${field.value ? 'text-[#FF69B4] font-medium' : 'text-gray-600'}`}>Yes</span>
                </div>
              </FormControl>
            </FormItem>
          </div>
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

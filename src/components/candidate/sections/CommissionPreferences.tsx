import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";

interface CommissionPreferencesProps {
  control: Control<CandidateFormValues>;
}

const CommissionPreferences = ({ control }: CommissionPreferencesProps) => {
  return (
    <>
      <FormField
        control={control}
        name="open_to_commission"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Open to Commission-Based Roles</FormLabel>
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

      <FormField
        control={control}
        name="commission_percentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Desired Commission Percentage</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                max="100"
                {...field}
                onChange={(e) => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CommissionPreferences;
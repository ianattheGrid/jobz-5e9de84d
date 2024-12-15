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
      <div className="mb-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          "You're Hired" Bonus Scheme
        </h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            Our unique "You're Hired" bonus scheme allows you to earn a bonus when you're successfully placed in a role. Here's how it works:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Some employers offer a bonus of between 2.5% and 14% of your basic salary
            </li>
            <li>
              The bonus is typically split between you (the successful candidate) and anyone who referred you to the position
            </li>
            <li>
              You'll be able to see the exact bonus amount and split on job listings that offer this incentive
            </li>
            <li>
              By enabling this option, your profile will be visible to jobs offering this bonus scheme
            </li>
          </ul>
        </div>
      </div>

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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { useState } from "react";
import { calculateTotalCommission, calculateSplitCommissions, formatCurrency } from "@/utils/commissionCalculations";

interface CommissionPreferencesProps {
  control: Control<CandidateFormValues>;
}

const CommissionPreferences = ({ control }: CommissionPreferencesProps) => {
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [sampleSalary, setSampleSalary] = useState("");
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [totalCommission, setTotalCommission] = useState(0);

  const handleSalaryChange = (value: string) => {
    setSampleSalary(value);
    if (value) {
      const commission = calculateTotalCommission(value, feePercentage);
      setTotalCommission(commission);
    }
  };

  const handleFeeChange = (value: number[]) => {
    setFeePercentage(value[0]);
    if (sampleSalary) {
      const commission = calculateTotalCommission(sampleSalary, value[0]);
      setTotalCommission(commission);
    }
  };

  const { candidateCommission, referralCommission } = calculateSplitCommissions(totalCommission, splitPercentage);

  return (
    <>
      <FormField
        control={control}
        name="view_scheme"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-sm">Would you like to view the "You're Hired" bonus scheme?</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value || false}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setShowSchemeDetails(checked);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showSchemeDetails && (
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <h4 className="font-medium text-gray-900">Try the Bonus Calculator</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Enter a sample yearly salary</label>
                <Input
                  type="text"
                  placeholder="e.g. 50000"
                  value={sampleSalary}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Select bonus percentage (2.5%-14%)</label>
                <Slider
                  value={[feePercentage]}
                  onValueChange={handleFeeChange}
                  min={2.5}
                  max={14}
                  step={0.5}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  Selected: {feePercentage}%
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Adjust bonus split</label>
                <Slider
                  value={[splitPercentage]}
                  onValueChange={(value) => setSplitPercentage(value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="text-sm text-muted-foreground">
                  You: {splitPercentage}% | Referrer: {100 - splitPercentage}%
                </div>
              </div>

              {sampleSalary && (
                <div className="mt-4 p-3 bg-green-50 rounded-md">
                  <p className="text-sm font-medium text-green-800 mb-2">
                    Potential Bonus Breakdown
                  </p>
                  <div className="text-sm text-green-700 space-y-1">
                    <p>Total Bonus: {formatCurrency(totalCommission)}</p>
                    <p>• Your Share: {formatCurrency(candidateCommission)}</p>
                    <p>• Referrer's Share: {formatCurrency(referralCommission)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <FormField
        control={control}
        name="open_to_commission"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-sm">Would you like to participate in the bonus scheme?</FormLabel>
              <p className="text-sm text-muted-foreground">
                Your profile will be visible to employers offering commission-based roles
              </p>
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
            <FormLabel>What is your desired commission percentage? (2.5% - 14%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="2.5"
                max="14"
                step="0.5"
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
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { useState } from "react";
import CommissionToggle from "./commission/CommissionToggle";
import SchemeExplanation from "./commission/SchemeExplanation";
import BonusCalculator from "./commission/BonusCalculator";

interface CommissionPreferencesProps {
  control: Control<CandidateFormValues>;
}

const CommissionPreferences = ({ control }: CommissionPreferencesProps) => {
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [sampleSalary, setSampleSalary] = useState("");
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);

  return (
    <div className="space-y-4">
      <CommissionToggle
        control={control}
        name="view_scheme"
        label="Would you like to view the &quot;You're Hired&quot; bonus scheme?"
        onChange={setShowSchemeDetails}
      />

      {showSchemeDetails && (
        <div className="mb-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            "You're Hired" Bonus Scheme
          </h3>
          <SchemeExplanation />
          <BonusCalculator
            sampleSalary={sampleSalary}
            feePercentage={feePercentage}
            splitPercentage={splitPercentage}
            onSalaryChange={setSampleSalary}
            onFeeChange={(value) => setFeePercentage(value[0])}
            onSplitChange={(value) => setSplitPercentage(value[0])}
          />
        </div>
      )}

      <div className="mt-6">
        <CommissionToggle
          control={control}
          name="open_to_commission"
          label="Would you like to participate in the bonus scheme?"
        />
      </div>

      {control._formValues.open_to_commission && (
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
      )}
    </div>
  );
};

export default CommissionPreferences;
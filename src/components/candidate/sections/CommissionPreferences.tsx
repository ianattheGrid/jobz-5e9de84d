import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { useState } from "react";
import CommissionToggle from "./commission/CommissionToggle";
import SchemeExplanation from "./commission/SchemeExplanation";
import BonusCalculator from "./commission/BonusCalculator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommissionPreferencesProps {
  control: Control<CandidateFormValues>;
}

const CommissionPreferences = ({ control }: CommissionPreferencesProps) => {
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [sampleSalary, setSampleSalary] = useState("");
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);

  // Generate commission percentage options
  const commissionOptions = [
    { value: "flexible", label: "Flexible - consider all commission rates" },
    ...Array.from({ length: 24 }, (_, i) => ({
      value: (2.5 + i * 0.5).toString(),
      label: `${(2.5 + i * 0.5).toFixed(1)}%`
    }))
  ];

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
              <FormLabel>What is the minimum commission percentage you would consider?</FormLabel>
              <FormControl>
                <Select
                  value={field.value?.toString() || "flexible"}
                  onValueChange={(value) => {
                    if (value === "flexible") {
                      field.onChange(null);
                    } else {
                      field.onChange(parseFloat(value));
                    }
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select minimum commission percentage" />
                  </SelectTrigger>
                  <SelectContent>
                    {commissionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
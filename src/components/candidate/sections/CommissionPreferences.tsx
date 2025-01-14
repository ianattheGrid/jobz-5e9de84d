import { Control } from "react-hook-form";
import { CandidateFormValues } from "../candidateFormSchema";
import { useState } from "react";
import CommissionToggle from "./commission/CommissionToggle";
import SchemeExplanation from "./commission/SchemeExplanation";
import { BonusCalculator } from "./commission/BonusCalculator";
import CommissionNegotiation from "./commission/CommissionNegotiation";
import BonusPreferencesHeader from "./bonus/BonusPreferencesHeader";
import MinimumBonusSelect from "./bonus/MinimumBonusSelect";

interface CommissionPreferencesProps {
  control: Control<CandidateFormValues>;
}

const CommissionPreferences = ({ control }: CommissionPreferencesProps) => {
  const [showSchemeDetails, setShowSchemeDetails] = useState(false);
  const [sampleSalary, setSampleSalary] = useState("");
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);

  const handleSchemeToggle = (checked: boolean) => {
    setShowSchemeDetails(checked);
  };

  return (
    <div className="space-y-4">
      <CommissionToggle
        control={control}
        name="view_scheme"
        label="Would you like to view the &quot;You're Hired&quot; bonus scheme?"
        onChange={handleSchemeToggle}
      />

      {showSchemeDetails && (
        <div className="mb-6 space-y-4">
          <BonusPreferencesHeader />
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
          defaultValue={false}
        />
      </div>

      {control._formValues.open_to_commission && (
        <>
          <MinimumBonusSelect control={control} />
          <CommissionNegotiation />
        </>
      )}
    </div>
  );
};

export default CommissionPreferences;
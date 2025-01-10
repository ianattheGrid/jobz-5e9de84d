import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { calculateTotalCommission, calculateSplitCommissions, formatCurrency } from "@/utils/commissionCalculations";

interface BonusCalculatorProps {
  sampleSalary: string;
  feePercentage: number;
  splitPercentage: number;
  onSalaryChange: (value: string) => void;
  onFeeChange: (value: number[]) => void;
  onSplitChange: (value: number[]) => void;
}

export const BonusCalculator = ({
  sampleSalary,
  feePercentage,
  splitPercentage,
  onSalaryChange,
  onFeeChange,
  onSplitChange,
}: BonusCalculatorProps) => {
  const totalCommission = sampleSalary ? calculateTotalCommission(sampleSalary, feePercentage) : 0;
  const { candidateCommission, referralCommission } = calculateSplitCommissions(totalCommission, splitPercentage);

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
      <h4 className="font-medium text-gray-900">Try the Bonus Calculator</h4>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Enter a sample yearly salary</label>
          <Input
            type="text"
            placeholder="e.g. 50000"
            value={sampleSalary}
            onChange={(e) => onSalaryChange(e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Select bonus percentage (2.5%-14%)</label>
          <Slider
            value={[feePercentage]}
            onValueChange={onFeeChange}
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
            onValueChange={onSplitChange}
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
  );
};
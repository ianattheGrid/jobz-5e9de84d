import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateTotalCommission, calculateSplitCommissions, formatCurrency } from "@/utils/commissionCalculations";

interface CommissionSectionProps {
  salary: string;
  form: any;
}

const CommissionSection = ({ salary, form }: CommissionSectionProps) => {
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [totalCommission, setTotalCommission] = useState(0);
  const [showCommissionStructure, setShowCommissionStructure] = useState(false);

  useEffect(() => {
    if (salary) {
      const commission = calculateTotalCommission(salary, feePercentage);
      setTotalCommission(commission);
      
      const { candidateCommission, referralCommission } = calculateSplitCommissions(commission, splitPercentage);
      
      if (form.getValues("offerCandidateCommission")) {
        form.setValue("candidateCommission", formatCurrency(candidateCommission));
      }
      if (form.getValues("offerReferralCommission")) {
        form.setValue("referralCommission", formatCurrency(referralCommission));
      }
    }
  }, [salary, feePercentage, splitPercentage, form]);

  const handleCommissionChange = (value: string) => {
    const isOffering = value === "yes";
    setShowCommissionStructure(isOffering);
    form.setValue("offerCandidateCommission", isOffering);
    form.setValue("offerReferralCommission", isOffering);
  };

  return (
    <div className="space-y-6">
      <FormItem className="space-y-3">
        <FormLabel>Would you like to offer a "You're Hired" bonus to the successful candidate and commission to the person who recommends the hired candidate?</FormLabel>
        <RadioGroup
          defaultValue="no"
          onValueChange={handleCommissionChange}
          className="flex flex-row space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <label htmlFor="yes">Yes</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <label htmlFor="no">No</label>
          </div>
        </RadioGroup>
      </FormItem>

      {showCommissionStructure && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <FormLabel>Please select the commission you are prepared to pay (2.5%-14% basic salary)</FormLabel>
            <Slider
              value={[feePercentage]}
              onValueChange={(value) => setFeePercentage(value[0])}
              min={2.5}
              max={14}
              step={0.5}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              Total Commission: {formatCurrency(totalCommission)} ({feePercentage}%)
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Commission Split</FormLabel>
            <div className="text-sm text-muted-foreground mb-2">
              Adjust how the commission is split between the successful candidate and the referrer. This flexibility allows you to incentivize either direct applications or referrals based on your recruitment needs.
            </div>
            <Slider
              value={[splitPercentage]}
              onValueChange={(value) => setSplitPercentage(value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              Candidate: {splitPercentage}% | Referral: {100 - splitPercentage}%
            </div>
          </div>

          <FormField
            control={form.control}
            name="candidateCommission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Candidate Commission Amount</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralCommission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Referral Commission Amount</FormLabel>
                <FormControl>
                  <Input {...field} readOnly />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CommissionSection;
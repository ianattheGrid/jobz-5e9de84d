
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
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
        <div className="flex items-center gap-2">
          <FormLabel className="text-gray-900">Would you like to attract candidates and/or use recruiters by offering a bonus?</FormLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-500" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>To offer bonuses or use recruiters, you'll need to provide a salary figure for calculation purposes. This helps determine appropriate bonus amounts.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup
          defaultValue="no"
          onValueChange={handleCommissionChange}
          className="flex flex-row space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" className="text-primary" />
            <label htmlFor="yes" className="text-gray-900">Yes</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" className="text-primary" />
            <label htmlFor="no" className="text-gray-900">No</label>
          </div>
        </RadioGroup>
      </FormItem>

      {showCommissionStructure && (
        <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
          <div className="space-y-2">
            <FormLabel className="text-gray-900">Please select the commission you are prepared to pay (2.5%-14% basic salary)</FormLabel>
            <Slider
              value={[feePercentage]}
              onValueChange={(value) => setFeePercentage(value[0])}
              min={2.5}
              max={14}
              step={0.5}
              className="w-full bg-white"
            />
            <div className="text-sm text-gray-600">
              Total Commission: {formatCurrency(totalCommission)} ({feePercentage}%)
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel className="text-gray-900">Commission Split</FormLabel>
            <div className="text-sm text-gray-600 mb-2">
              Adjust how the commission is split between the successful candidate and the referrer. This flexibility allows you to incentivize either direct applications or referrals based on your recruitment needs.
            </div>
            <Slider
              value={[splitPercentage]}
              onValueChange={(value) => setSplitPercentage(value[0])}
              min={0}
              max={100}
              step={5}
              className="w-full bg-white"
            />
            <div className="text-sm text-gray-600">
              Candidate: {splitPercentage}% | Referral: {100 - splitPercentage}%
            </div>
          </div>

          <FormField
            control={form.control}
            name="candidateCommission"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Candidate Commission Amount</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-white text-gray-900" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralCommission"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-900">Referral Commission Amount</FormLabel>
                <FormControl>
                  <Input {...field} readOnly className="bg-white text-gray-900" />
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

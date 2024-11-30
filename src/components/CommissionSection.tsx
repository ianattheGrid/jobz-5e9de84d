import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { calculateTotalCommission, calculateSplitCommissions, formatCurrency } from "@/utils/commissionCalculations";

interface CommissionSectionProps {
  salary: string;
  form: any;
}

const CommissionSection = ({ salary, form }: CommissionSectionProps) => {
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [totalCommission, setTotalCommission] = useState(0);

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="offerCandidateCommission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Offer Candidate Commission
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Offer a signing bonus to successful candidates
                </div>
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
          control={form.control}
          name="offerReferralCommission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Offer Referral Commission
                </FormLabel>
                <div className="text-sm text-muted-foreground">
                  Offer a bonus for successful referrals
                </div>
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
      </div>

      {(form.watch("offerCandidateCommission") || form.watch("offerReferralCommission")) && (
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="space-y-2">
            <FormLabel>Total Commission Fee ({feePercentage}%)</FormLabel>
            <Slider
              value={[feePercentage]}
              onValueChange={(value) => setFeePercentage(value[0])}
              min={2.5}
              max={14}
              step={0.5}
              className="w-full"
            />
            <div className="text-sm text-muted-foreground">
              Total Commission: {formatCurrency(totalCommission)}
            </div>
          </div>

          <div className="space-y-2">
            <FormLabel>Commission Split</FormLabel>
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

          {form.watch("offerCandidateCommission") && (
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
          )}

          {form.watch("offerReferralCommission") && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default CommissionSection;
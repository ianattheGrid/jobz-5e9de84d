import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { calculateTotalCommission, calculateSplitCommissions, formatCurrency } from "@/utils/commissionCalculations";

interface CommissionSectionProps {
  salary: string;
  form: any;
}

const CommissionSection = ({ salary, form }: CommissionSectionProps) => {
  const [feePercentage, setFeePercentage] = useState(7);
  const [splitPercentage, setSplitPercentage] = useState(50);
  const [totalCommission, setTotalCommission] = useState(0);
  const [showCommissionDialog, setShowCommissionDialog] = useState(true);
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

  const handleCommissionConfirmation = (confirmed: boolean) => {
    setShowCommissionDialog(false);
    setShowCommissionStructure(confirmed);
    form.setValue("offerCandidateCommission", confirmed);
    form.setValue("offerReferralCommission", confirmed);
  };

  if (!showCommissionStructure && !showCommissionDialog) {
    return null;
  }

  return (
    <div className="space-y-6">
      <AlertDialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Commission Structure</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to offer a "You're Hired" bonus to the successful candidate and commission to the person who recommends the hired candidate?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleCommissionConfirmation(false)}>No</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleCommissionConfirmation(true)}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showCommissionStructure && (
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
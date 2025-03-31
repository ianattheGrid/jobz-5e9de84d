
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useBonusPayment } from "@/hooks/useBonusPayment";
import { BonusPaymentConfirmation } from "./BonusPaymentConfirmation";

interface BonusPaymentModalProps {
  applicationId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const BonusPaymentModal = ({ 
  applicationId, 
  isOpen, 
  onClose 
}: BonusPaymentModalProps) => {
  const { loading, bonusData } = useBonusPayment(applicationId);
  
  const handleComplete = () => {
    setTimeout(() => {
      onClose();
    }, 2000);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Candidate Bonus Payment</DialogTitle>
          <DialogDescription>
            Complete the information below to confirm the candidate start date and bonus payment details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          ) : !bonusData ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No bonus is configured for this position.</p>
            </div>
          ) : (
            <BonusPaymentConfirmation 
              jobId={bonusData.jobId}
              candidateId={bonusData.candidateId}
              candidateEmail={bonusData.candidateEmail}
              candidateCommission={bonusData.candidateCommission}
              vrCommission={bonusData.vrCommission}
              recommendationId={bonusData.recommendationId}
              vrId={bonusData.vrId}
              onComplete={handleComplete}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
